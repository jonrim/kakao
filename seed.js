/*
This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.
It uses the same file the server uses to establish
the database connection:
--- server/db/index.js
The name of the database used is set in your environment files:
--- server/env/*
This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.
*/

require('@babel/register');
const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Promise = require('sequelize').Promise;
const chance = require('chance')(123);
const numUsers = 15;

const seedUsers = () => {
  const users = [
    {
      username: 'sejin',
      password: 'p',
      name: '세진❤',
      email: 'm@m.com',
      phone: '0000000000',
    },
    {
      username: 'johnchen',
      password: 'p',
      name: 'John Chen',
      email: 'm@m.com',
      phone: '0000000000',
    },
    {
      username: 'm',
      password: 'm',
      name: 'J. Rim',
      email: 'm@m.com',
      phone: '3476032811',
    },
  ];

  function generateRandomUser() {
    const name = chance.word() + ' ' + chance.word();
    return {
      username: chance.word(),
      password: 'password',
      name: name,
      email: chance.email(),
      phone: chance.phone()
    };
  }

  while (users.length <= numUsers) {
    users.push(generateRandomUser());
  }

  const creatingUsers = users.map(userObj => {
    return User.create(userObj);
  });

  console.log(creatingUsers[0])

  return Promise.all(creatingUsers);
};

db.sync({ force: true })
.then(() => seedUsers())
.then(() => {
    console.log(chalk.green('Seed successful!'));
    process.kill(0);
})
.catch(err => {
    console.error(err);
    process.kill(1);
});