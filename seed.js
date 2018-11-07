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
      password: 'p',
      name: '세진❤',
      email: 'm1@m.com',
      phone: '0000000000',
      motto: '🥑',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254123/sejin_mdaurn.jpg',
      isAdmin: false
    },
    {
      password: 'p',
      name: 'John Chen',
      email: 'm2@m.com',
      phone: '0000000000',
      motto: 'happy new years',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/johnchen_hnl598.jpg',
      isAdmin: false
    },
    {
      password: 'm',
      name: 'Jonathan Rim',
      email: 'm@m.com',
      phone: '3476032811',
      motto: '이 세상에서 제일 필오한건.. 마음이 따뜻한 사람~',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/me_chsm06.jpg',
      isAdmin: true
    },
    {
      password: 'm',
      name: 'Aaron An',
      email: 'm3@m.com',
      phone: '0000000000',
      motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`,
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/aaronan_rbzmc4.jpg',
      isAdmin: false
    },
    {
      password: 'm',
      name: 'Justin Kim',
      email: 'm4@m.com',
      phone: '0000000000',
      motto: `Throwback to the good ol' days in Europe.`,
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/justinkim_edkbzp.jpg',
      isAdmin: false
    },
    {
      password: 'm',
      name: '이용우',
      email: 'm5@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254124/yongwoolee_bvxpon.jpg',
      isAdmin: false
    },
    {
      password: 'm',
      name: '이현호',
      email: 'm6@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/scottlee_wvfnxd.jpg',
      isAdmin: false
    },
    {
      password: 'm',
      name: 'Lawrence Parsons',
      email: 'm7@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/lawrenceparsons_qx1a7r.jpg',
      isAdmin: false
    },
  ];

  function generateRandomUser() {
    const name = chance.word() + ' ' + chance.word();
    return {
      password: 'password',
      name: name,
      email: chance.email(),
      phone: chance.phone(),
      isAdmin: false
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
.then(() => seedUsers())
.then(() => {
    console.log(chalk.green('Seed successful!'));
    process.kill(0);
})
.catch(err => {
    console.error(err);
    process.kill(1);
});