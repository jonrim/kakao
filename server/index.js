require('@babel/register');
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const db = require('./db');
const compiler = webpack(webpackConfig);
require('dotenv').config({
  path: path.join(__dirname, './env/development.env')
});
const fs = require('fs');
const http = require('http');
const https = require('https');
const sio = require('socket.io');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const secrets = process.env.NODE_ENV === 'production' ? require('../secretsProd') : require('../secrets');
const env = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();
const options = { 
  key: fs.readFileSync(__dirname + '/rtc-video-room-key.pem'),
  cert: fs.readFileSync(__dirname + '/rtc-video-room-cert.pem')
};
// const server = process.env.NODE_ENV === 'production' ?
//               http.createServer(app) : http.createServer(options, app);
const server = http.createServer(app);
const io = sio(server);

// express can put req onto req.body
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
  secret: secrets.SESSION_SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  keys: ['verification9123', 'helperkey9123']
}));
app.use((req, res, next) => {
  if (req.session.user) {
    console.log(req.session);
  }
  next();
});


if (process.env.NODE_ENV !== 'production') {
  app.use(require("webpack-hot-middleware")(compiler));
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  var hotMiddleware = require('webpack-hot-middleware')(compiler, {
      log: () => {},
      heartbeat: 2000
  });

  compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {  
    hotMiddleware.publish({  
      action: 'reload'  
    });  
  });
}
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.get('/bundle.js', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/bundle.js'));
});

app.get('/*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);

  res
  .status(err.status || 500)
  .json({
    errorStatus: err.status || 500,
    message: err.message || 'Internal Server Error'
  });
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM users', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');

// the clients hash stores the sockets
// the users hash stores the username of the connected user and its socket.id
var clients = {};
var users = {};


io.on('connection', socket => {
  console.log(chalk.cyan('A user connected'));
  // var hs = socket.handshake;
  // users[hs.session.username] = socket.id;
  clients[socket.id] = socket;
  // on connection, should receive all new messages

  socket.on('connected', IDs => {
    users[IDs.userEmail] = IDs.socketId;
  });

  // Socket handler for setting up video call
  let room = '';
  const create = err => {
    if (err) {
      return console.log(err);
    }
    socket.join(room);
    socket.emit('create');
  };

  socket.on('find', () => {
    const url = socket.request.headers.referer.split('/');
    room = url[url.length - 1];
    const sr = io.sockets.adapter.rooms[room];
    if (sr === undefined) {
      // no room with such name is found so create it
      socket.join(room);
      socket.emit('create');
    } else if (sr.length === 1) {
      socket.emit('join');
    } else { // max two clients
      socket.emit('full', room);
    }
  });
  socket.on('auth', data => {
    data.sid = socket.id;
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('approve', data);
  });
  socket.on('accept', id => {
    io.sockets.connected[id].join(room);
    // sending to all clients in 'game' room(channel), include sender
    io.in(room).emit('bridge');
  });
  socket.on('reject', () => socket.emit('full'));
  socket.on('leave', () => {
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('hangup');
    socket.leave(room);
  });

  socket.on('callingFriend', data => {
    const { user, friend, roomId } = data;
    io.to(`${users[data.friend.email]}`).emit('callIncoming', {friendEmail: user.email, roomId});
  });

  // Socket handler for sending/receiving messages in chatroom
  socket.on('message', message => {
    // should still send message even if other user isn't connected
    // first update both users' friends prop (chatroom for friend/friends)

    // If the friend is currently online, if there is a message, emit the message to the friend right away
    // Or, after reading the messages, alert friend that the messages were read
    if (users[message.friendEmail]) {
      io.to(`${users[message.friendEmail]}`).emit('messageReceive', {
        ...message,
        userEmail: message.friendEmail,
        friendEmail: message.userEmail
      });
    }
  })

  socket.on('sentFriendRequest', userInfo => {
    if (users[userInfo.friendEmail]) {
      io.to(`${users[userInfo.friendEmail]}`).emit('sentFriendRequest', {
        ...userInfo,
        userEmail: userInfo.friendEmail,
        friendEmail: userInfo.userEmail
      });
    } 
  })

  socket.on('acceptedFriendRequest', userInfo => {
    if (users[userInfo.friendEmail]) {
      io.to(`${users[userInfo.friendEmail]}`).emit('acceptedFriendRequest', {
        ...userInfo,
        userEmail: userInfo.friendEmail,
        friendEmail: userInfo.userEmail
      });
    } 
  })

  socket.on('disconnect', () => {
    console.log(chalk.cyan('A user disconnected'));
    // delete user from clients and users hashes
    delete clients[socket.id];
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    delete users[userId];
  })
});

const startServer = () => {
  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)))
  })
}

db.sync()
.then(startServer)
.catch(err => console.error(chalk.red(err.stack)))

module.exports = db;