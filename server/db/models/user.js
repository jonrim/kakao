'use strict';

import Sequelize from 'sequelize'
import crypto from 'crypto'
import _omit from 'lodash/omit'

module.exports = function(db) {
  const User = db.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    phone: {
      type: Sequelize.STRING
    },
    photo: {
      type: Sequelize.STRING
    },
    motto: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
  }, {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword
    }
  })

  // Instance Methods
  User.prototype.sanitize = function() {
    return _omit(this.toJSON(), ['password', 'salt'])
  }

  User.prototype.correctPassword = function(testPassword) {
    return this.Model.encryptPassword(testPassword, this.salt) === this.password
  }

  // Class Methods
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
  }

  User.encryptPassword = function(plainText, salt) {
    const hash = crypto.createHash('sha1')
    hash.update(plainText)
    hash.update(salt)
    return hash.digest('hex')
  }

  function setSaltAndPassword(user) {
    if (user.changed('password')) {
      user.salt = User.generateSalt()
      user.password = User.encryptPassword(user.password, user.salt)
    }
  }

  return User;
}

