const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const db = require('../db');
const User = db.model('user');
const Op = require('sequelize').Op;

router.post('/login', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('Email not registered.');
      error.status = 400;
      throw error;
    }

    const passwordAttempt = User.encryptPassword(req.body.password, user.salt);
    
    if (user.password === passwordAttempt) {
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        backgroundPhoto: user.backgroundPhoto,
        isAdmin: user.isAdmin,
        motto: user.motto
      };
      
      res.json(req.session.user);
    } else {
      const error = new Error('Incorrect Password.');
      error.status = 400;
      throw error;
    }
  })
  .catch(next);
});

router.post('/signup', (req, res, next) => {
  // if (req.body.password !== req.body.reenterPassword) {
  //   const error = new Error('You reentered your password incorrectly.');
  //   error.status = 400;
  //   next(error);
  //   return;
  // }
  User.findOne({
    where: {
      [Op.or]: [
        {email: req.body.email},
        {phone: req.body.phone}
      ]
    }
  })
  .then(user => {
    if (user) {
      var error;
      if (user.email === req.body.email)
        error = new Error('Email already taken.');
      if (user.phone === req.body.phone)
        error = new Error('Phone number already taken.');
      error.status = 400;
      throw error;
    }

    return User.findAll()
    .then(users => {
      return User.create({
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone
      });
    });
  })
  .then(user => {
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    res.json(req.session.user);
  })
  .catch(next);
});

router.get('/session', (req, res, next) => {
  if (!req.session.user || !req.session.user.id) {
    const error = new Error('You are not logged in.');
    error.status = 400;
    next(error);
    return;
  }

  User.findByPk(req.session.user.id)
  .then(user => {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      backgroundPhoto: user.backgroundPhoto,
      isAdmin: user.isAdmin,
      motto: user.motto,
      friends: user.friends
    })
  })
  .catch(next);
});

router.get('/logout', (req, res, next) => {
  req.session = null;
  res.json({
    message: 'Logged out successfully.'
  });
});

module.exports = router;