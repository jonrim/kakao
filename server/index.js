const path = require('path');
const chalk = require('chalk');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

require('babel-register');
require('dotenv').config({
  path: path.join(__dirname, './env/development.env')
});


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

io.on('connection', socket => {
  console.log(chalk.cyan('A user connected'));
  socket.on('disconnect', () => {
    console.log(chalk.cyan('A user disconnected'));
  })
});

server.listen(process.env.PORT, () => {
  console.log(chalk.blue('Server started on port', chalk.magenta(process.env.PORT)));
});