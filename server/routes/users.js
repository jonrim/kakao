'use strict';
var router = require('express').Router();
var db = require('../db');
var User = db.model('user');
var Auth = require('../configure/auth-middleware');
var cloudinary = require('cloudinary');
var secrets = require('../../secretsProd');
cloudinary.config({ 
  cloud_name: secrets.CLOUDINARY_CLOUD_NAME, 
  api_key: secrets.CLOUDINARY_API_KEY, 
  api_secret: secrets.CLOUDINARY_API_SECRET
});

const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secrets.TRANSPORTER_USER,
        pass: secrets.TRANSPORTER_PASS
    }
});

router.get('/', Auth.assertAdmin, function (req, res) {
  User.all()
  .then(users => {
    res.json(users);
  });
});

router.post('/formInfo', function(req, res, next) {
  if (!req.body.name || !req.body.email || (!req.body.subject && !req.body.address) || !req.body.message) {
    const error = new Error('Fill out the required forms.');
    error.status = 400;
    next(error);
    return;
  }
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"' + req.body.name + ' ' + req.body.email + '"', // sender address
    to: 'jonrim@umich.edu, rim.jonathan16@gmail.com', // list of receivers
    subject: req.body.email + ': ' + (req.body.subject || req.body.address), // Subject line
    text: req.body.message, // plain text body
    html: '' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      const err = new Error(error);
      err.message = "Error on server-side";
      next(err);
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.json({success: true})
  });
});

router.put('/changeInfo', function(req, res, next) {
  if (req.body.photoURL || req.body.photoURL === '') {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(user => {
      if (user.photoURL) {
        var regex = /upload\/[a-zA-z0-9]+\/([a-zA-z0-9]+)/;
        var match = regex.exec(user.photoURL);
        cloudinary.uploader.destroy(match[1], result => { console.log(result) });
      }
      return user.update({photoURL: req.body.photoURL})
    })
    .then(user => {
      res.json({photoURL: req.body.photoURL})
    })
    .catch(next);
  }
  if (req.body.newEmail !== req.body.reenterNewEmail) {
    const error = new Error('You reentered your new email incorrectly.');
    error.status = 400;
    next(error);
    return;
  }
  if (req.body.newPassword !== req.body.reenterNewPassword) {
    const error = new Error('You reentered your new password incorrectly.');
    error.status = 400;
    next(error);
    return;
  }
  if (req.body.newPhone) {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(user => {
      return user.update({phone: req.body.newPhone})
    })
    .then(user => {
      res.json({newPhone: req.body.newPhone});
    })
    .catch(next);
  }
  if (req.body.newPassword) {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(user => {
      if (user.correctPassword(req.body.oldPassword))
        return user.update({password: req.body.newPassword})
      else {
        const error = new Error('You entered your old password incorrectly.');
        error.status = 400;
        throw error;
      }
    })
    .then(user => {
      res.json({newPassword: req.body.newPassword});
    })
    .catch(next);
  }
  if (req.body.newEmail) {
    User.findOne({
      where: {
        email: req.body.newEmail
      }
    })
    .then(user => {
      if (user) {
        const error = new Error('New email already in use.');
        error.status = 400;
        throw error;
      }
      return User.findOne({
        where: {
          username: req.body.username
        }
      });
    })
    .then(user => {
      return user.update({email: req.body.newEmail})
    })
    .then(user => {
      res.json({newEmail: req.body.newEmail});
    })
    .catch(next);
  }
});

router.param('userId', function(req, res, next, userId) {
  User.findById(userId)
  .then(user => {
    if (!user) {
      res.status(404);
      throw next(new Error('User not found.'));
    }
    else {
      req.requestedUser = user;
      next();
    }
  })
  .catch(next);
});

router.get('/:userId', function(req, res) {
  res.json(req.requestedUser);
});

router.put('/:userId', function(req, res, next) {
  req.requestedUser.update(req.body)
  .then(function(user) {
    res.send(user);
  })
  .catch(next);
});

router.delete('/:userId', function(req, res, next) {
  req.requestedUser.destroy()
  .then(function() {
    res.sendStatus(204)
  })
  .catch(next);
})

module.exports = router;