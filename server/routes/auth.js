const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const db = require('../db');
const User = db.model('user');

router.post('/login', (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('Invalid username.');
      error.status = 400;
      throw error;
    }

    const passwordAttempt = User.encryptPassword(req.body.password, user.salt);
    
    if (user.password === passwordAttempt) {
      req.session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin
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
  if (req.body.password !== req.body.reenterPassword) {
    const error = new Error('You reentered your password incorrectly.');
    error.status = 400;
    next(error);
    return;
  }

  User.findOne({
    where: {
      $or: [
        {username: req.body.username},
        {email: req.body.email}
      ]
    }
  })
  .then(user => {
    if (user) {
      var error;
      if (user.username === req.body.username)
        error = new Error('Username already taken.');
      else
        error = new Error('Email already in use.');
      error.status = 400;
      throw error;
    }

    return User.findAll()
    .then(users => {
      return User.create({
        id: users.length,
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
      });
    });
  })
  .then(user => {
    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
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

  User.findById(req.session.user.id)
  .then(user => {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      photoURL: user.photoURL
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