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
      name: '김세진',
      email: 'm1@m.com',
      phone: '0000000000',
      motto: '🥑',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254123/sejin_mdaurn.jpg',
      backgroundPhoto: 'http://2.bp.blogspot.com/-WjWL3hpOTho/VlJKXjiYR9I/AAAAAAAAh48/6awsYhIHY6w/s1600/Beach-HD%2B%25282%2529.jpg',
      isAdmin: false,
      friends: [
        JSON.stringify({email: 'm@m.com', favorite: true, chatHistory: [
          {
            date: new Date(2018, 9, 20, 7, 30, 20, 0),
            text: '보고시뿌 보낼려구 들어왔는데~',
            friend: false,
            firstMessageOfDay: true,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 30, 55, 0),
            text: '문자와있었네ㅋㅋ 잠깐 깼어요?',
            friend: false,
            firstMessageOfDay: false,
            firstMessageOfMinute: false,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 30, 58, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: true,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 31, 20, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: true,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 30, 20, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: true,
            firstMessageOfDay: true,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 30, 21, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: false,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 32, 22, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: false,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          }
        ]})
      ]
    },
    {
      password: 'm',
      name: 'John Chen',
      email: 'm2@m.com',
      phone: '0000000000',
      motto: 'happy new years',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/johnchen_hnl598.jpg',
      backgroundPhoto: 'https://ak2.picdn.net/shutterstock/videos/5517722/thumb/1.jpg',
      isAdmin: false,
      friends: [JSON.stringify({email: 'm@m.com', favorite: true, chatHistory: []})]
    },
    {
      password: 'm',
      name: 'Jonathan Rim',
      email: 'm@m.com',
      phone: '3476032811',
      motto: '이 세상에서 제일 필요한건.. 마음이 따뜻한 사람~',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1543289995/rk6z64bprndp66k2rnxf.jpg',
      backgroundPhoto: 'https://i.redd.it/enmir0135l6y.jpg',
      isAdmin: true,
      friends: [
        JSON.stringify({email: 'm1@m.com', favorite: true, chatHistory: [
          {
            date: new Date(2018, 9, 20, 7, 30, 20, 0),
            text: '보고시뿌 보낼려구 들어왔는데~',
            friend: true,
            firstMessageOfDay: true,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 30, 55, 0),
            text: '문자와있었네ㅋㅋ 잠깐 깼어요?',
            friend: true,
            firstMessageOfDay: false,
            firstMessageOfMinute: false,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 30, 58, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: false,
            firstMessageOfDay: false,
            firstMessageOfMinute: false,
            read: false
          },
          {
            date: new Date(2018, 9, 20, 7, 31, 20, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: false,
            firstMessageOfDay: false,
            firstMessageOfMinute: false,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 30, 20, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: false,
            firstMessageOfDay: true,
            firstMessageOfMinute: false,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 30, 21, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: true,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          },
          {
            date: new Date(2018, 9, 21, 7, 32, 22, 0),
            text: '아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데 아까 진짜 슬펐어.. 누나가 뉴욕에 있었는데  😅',
            friend: true,
            firstMessageOfDay: false,
            firstMessageOfMinute: true,
            read: false
          }
        ]}),
        JSON.stringify({email: 'm2@m.com', favorite: true, chatroom: []}),
        JSON.stringify({email: 'm3@m.com', chatroom: []}),
        JSON.stringify({email: 'm4@m.com', chatroom: []}),
        JSON.stringify({email: 'm5@m.com', chatroom: []}),
        JSON.stringify({email: 'm6@m.com', chatroom: []}),
        JSON.stringify({email: 'm7@m.com', chatroom: []}),
      ]
    },
    {
      password: 'm',
      name: 'Aaron An',
      email: 'm3@m.com',
      phone: '0000000000',
      motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`,
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/aaronan_rbzmc4.jpg',
      isAdmin: false,
      friends: []
    },
    {
      password: 'm',
      name: 'Justin Kim',
      email: 'm4@m.com',
      phone: '0000000000',
      motto: `Throwback to the good ol' days in Europe.`,
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254120/justinkim_edkbzp.jpg',
      isAdmin: false,
      friends: []
    },
    {
      password: 'm',
      name: '이용우',
      email: 'm5@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254124/yongwoolee_bvxpon.jpg',
      isAdmin: false,
      friends: []
    },
    {
      password: 'm',
      name: '이현호',
      email: 'm6@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/scottlee_wvfnxd.jpg',
      isAdmin: false,
      friends: []
    },
    {
      password: 'm',
      name: 'Lawrence Parsons',
      email: 'm7@m.com',
      phone: '0000000000',
      photo: 'https://res.cloudinary.com/fresh-aire-mechanical-co/image/upload/v1541254122/lawrenceparsons_qx1a7r.jpg',
      motto: `"But I have trusted in your steadfast love;
          my heart shall rejoice in your salvation." -Psalm 13:5`,
      isAdmin: false,
      friends: []
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