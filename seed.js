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

const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Promise = require('sequelize').Promise;
const chance = require('chance')(123);

const numUsers = 15;

const seedUsers = function () {
    const users = [
        {
            username: 'sejin',
            password: 'p',
            name: '세진❤'
        },
        {
            username: 'johnchen',
            password: 'p',
            firstName: 'Barack',
            lastName: 'Obama'
        },
        {
            username: 'm',
            password: 'm',
            email: 'm@m.com',
            phone: '3476032811',
            name: 'J. Rim'
            isAdmin: true
        },
    ];

    function generateRandomUser() {
        const name = chance.word() + chance.word();
        return {
            username: name.toLowerCase(),
            password: 'password',
            firstName: chance.word(),
            lastName: chance.word(),

        };
    }

    while (users.length <= numUsers) {
        users.push(generateRandomUser());
    }

    const creatingUsers = users.map(userObj => {
        return User.create(userObj);
    });


    return Promise.all(creatingUsers);

};

db.sync({ force: true })
    .then(function () {
        return Promise.all([seedUsers()]);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        // process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });