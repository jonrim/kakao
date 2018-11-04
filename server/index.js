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
const cookieSession = require('cookie-session')
const secrets = require('../secretsProd');
const env = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
  res.sendFile(path.resolve(__dirname, '../public/bundle.js'));
});

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
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

io.on('connection', socket => {
  console.log(chalk.cyan('A user connected'));
  socket.on('disconnect', () => {
    console.log(chalk.cyan('A user disconnected'));
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