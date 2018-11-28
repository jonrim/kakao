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
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const secrets = process.env.NODE_ENV === 'production' ? require('../secretsProd') : require('../secrets');
const env = process.env.NODE_ENV;
const PORT = process.env.PORT;
const chance = require('chance')(123);

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/token', function(request, response) {
  var identity = chance.word();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

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