'use strict';
const router = require('express').Router();
const db = require('../db');
const User = db.model('user');
const Auth = require('../configure/auth-middleware');
const cloudinary = require('cloudinary');
const secrets = process.env.NODE_ENV === 'production' ? require('../../secretsProd') : require('../../secrets');

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

router.get('/', Auth.assertAdmin, function(req, res) {
  User.all()
  .then(users => {
    res.json(users);
  });
});

// used for user to fetch all friends
router.post('/friendsList', function(req, res, next) {
  // friendFavoriteChatHistory is an array of user's friends that contains friend's info (favorited, chat history)
  let friendFavoriteChatHistory = [];
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('Cannot find user when trying to obtain friends list. User email:', req.body.email);
      error.status = 400;
      next(error);
    }
    friendFavoriteChatHistory = user.friends;
    return Promise.all(user.friends.map(friendInfo => {
      friendInfo = JSON.parse(friendInfo);
      return User.findOne({
        where: {
          email: friendInfo.email
        }
      });
    }));
  })
  .then(friends => {
    if (!friends) {
      const error = new Error('Cannot obtain chat histories of friends for user with email:', req.body.email);
      error.status = 400;
      next(error);
    }
    res.json(friends.map((friend, i) => {
      return {
        name: friend.name,
        tempName: JSON.parse(friendFavoriteChatHistory[i]).tempName,
        email: friend.email,
        phone: friend.phone,
        photo: friend.photo,
        backgroundPhoto: friend.backgroundPhoto,
        motto: friend.motto,
        chatHistory: JSON.parse(friendFavoriteChatHistory[i]).chatHistory,
        favorite: JSON.parse(friendFavoriteChatHistory[i]).favorite
      };
    }));
  })
  .catch(next);
});

// used for when user wants to search for a friend (to make a friend request)
router.post('/findUser', function(req, res, next) {
  let userID = req.body.userID;
  User.findOne({
    where: {
      email: userID
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('User does not exist.');
      error.status = 400;
      next(error);
    }
    res.json({
      email: user.email,
      name: user.name,
      photo: user.photo
    });
  });
});

/*------------------------------- ROUTES FOR FRIEND REQUESTS ---------------------------------*/

// used for when user wants to send a friend request to a friend
router.put('/friendRequest', function(req, res, next) {
  let user = req.body.user;
  let friend = req.body.friend;
  User.findOne({
    where: {
      email: friend.email
    }
  })
  .then(friend => {
    if (!friend) {
      const error = new Error('User does not exist.');
      error.status = 400;
      next(error);
    }
    // if there is no pending friend request, push to the friend's friendRequest list
    if (friend.friendRequests.findIndex(f => f.email === user.email) === -1) friend.friendRequests.push(JSON.stringify(user));
    return friend.update({friendRequests: friend.friendRequests});
  })
  .then(user => {
    res.json({
      email: user.email,
      name: user.name,
      photo: user.photo
    });
  });
});

// used for when user wants to accept or reject a pending friend request
router.put('/manageFriendRequest', function(req, res, next) {
  let { user, action, pendingFriend } = req.body;
  let updatedUser;
  User.findOne({
    where: {
      email: user.email
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('User does not exist.');
      error.status = 400;
      next(error);
    }

    // first remove the pending friend request from the user's list of friend requests
    let i = user.friendRequests.findIndex(f => f.email === pendingFriend.email);
    user.friendRequests.splice(i, 1);

    // then add the new friend to user's friend list if accepted
    if (action === 'accept') {
      // don't want to push in the friend's friends when using spread operator, so list all the other props instead
      user.friends.push(JSON.stringify({
        name: pendingFriend.name, 
        email: pendingFriend.email, 
        photo: pendingFriend.photo,
        backgroundPhoto: pendingFriend.backgroundPhoto,
        phone: pendingFriend.phone, 
        motto: pendingFriend.motto, 
        favorite: false, 
        chatroom: []
      }));
    }
    updatedUser = user;
    return user.update({friendRequests: user.friendRequests, friends: user.friends});
  })
  .then(_user => {
    return User.findOne({
      where: {
        email: pendingFriend.email
      }
    })
  })
  .then(friend => {
    if (!friend) {
      const error = new Error('Pending Friend does not exist.');
      error.status = 400;
      next(error);
    }
    // now update the friend's Friend List if the user accepted
    if (action === 'accept') {
      // don't want to push in the user's friends when using spread operator, so list all the other props instead
      friend.friends.push(JSON.stringify({
        name: user.name, 
        email: user.email, 
        photo: user.photo, 
        backgroundPhoto: user.backgroundPhoto, 
        phone: user.phone, 
        motto: user.motto, 
        favorite: false, 
        chatroom: []
      }));
      friend.update({friends: friend.friends});
    }
    // before sending the result back to the user, first populate friends with their info again
    return Promise.all(updatedUser.friends.map(friendInfo => {
      friendInfo = JSON.parse(friendInfo);
      return User.findOne({
        where: {
          email: friendInfo.email
        }
      });
    }));
  })
  .then(friends => {
    res.json({
      friends: action === 'reject' ? friends : friends.map((friend, i) => {
        return {
          name: friend.name,
          email: friend.email,
          phone: friend.phone,
          photo: friend.photo,
          backgroundPhoto: friend.backgroundPhoto,
          motto: friend.motto,
          chatHistory: JSON.parse(updatedUser.friends[i]).chatHistory,
          favorite: JSON.parse(updatedUser.friends[i]).favorite
        };
      }),
      friendRequests: updatedUser.friendRequests
    });
  });
});

// used for user to fetch all pending friend requests
router.post('/pendingFriendRequests', function(req, res, next) {
  let email = req.body.email;
  User.findOne({
    where: {
      email
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('User does not exist.');
      error.status = 400;
      next(error);
    }
    res.json(user.friendRequests);
  });
});

/*------------------------------- ROUTES FOR MESSAGING ---------------------------------*/

// used for when user sends a message to a friend
router.put('/messageSend', function(req, res, next) {
  var { messages, userEmail, friendEmail } = req.body;
  var today = Array.isArray(messages) ? messages[0].date : messages.date;
  var friend;

  function sameDate(a, b) {
    a = new Date(a);
    b = new Date(b);
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function sameMinute(a, b) {
    a = new Date(a);
    b = new Date(b);
    return a.getHours() === b.getHours() &&
           a.getMinutes() === b.getMinutes();
  }


  function updateInfo(personEmail) {
    return User.findOne({
      where: {
        email: personEmail
      }
    })
    .then(person => {
      // look for user in this person's friends
      if (!person) {
        const error = new Error('Cannot find user/friend when sending a message. User/friend email:', personEmail);
        error.status = 400;
        next(error);
      }
      let i = person.friends.map(f => JSON.parse(f)).findIndex(f => f.email && f.email === (person.email === userEmail ? friendEmail : userEmail));
      if (i < 0) {
        const error = new Error('Cannot find user/friend when sending a message. User/friend email:', personEmail);
        error.status = 400;
        next(error);
      }
      let chatInfo = JSON.parse(person.friends[i]);
      if (person.email === userEmail) friend = chatInfo;
      chatInfo.chatHistory = chatInfo.chatHistory || [];
      let chatHistory = chatInfo.chatHistory;
      let latestMessage, sameDay, sameTime;

      if (chatHistory.length > 0) {
        latestMessage = chatHistory[chatHistory.length - 1];
        sameDay = sameDate(today, latestMessage.date);
        sameTime = sameMinute(today, latestMessage.date);
      }
      if (Array.isArray(messages)) {
        chatHistory.concat(messages.map(message => {
          message.friend = personEmail === friendEmail;
          /* 
            when sending multiple files, only check the first file to see if it's
            the first message of the day/minute
          */
          message.firstMessageOfDay = i === 0 && (chatHistory.length === 0 || !sameDay);
          message.firstMessageOfMinute = latestMessage && (latestMessage.friend && personEmail === userEmail ||
                                          !latestMessage.friend && personEmail === friendEmail)
                                         || i === 0 && (chatHistory.length === 0 || !sameDay || sameDay && !sameTime);
          return message;
        }));
      }
      else {
        messages.friend = personEmail === friendEmail; 
        messages.firstMessageOfDay = chatHistory.length === 0 || !sameDay;

        // If this person is me (the user) and the latest message was from a friend, then this new message will be
        // the first message of the minute (used to display photo for this message)
        // If this person is the friend, and the latest message was from me, then also display photo
        messages.firstMessageOfMinute = latestMessage && (latestMessage.friend && personEmail === userEmail ||
                                          !latestMessage.friend && personEmail === friendEmail)
                                        || chatHistory.length === 0 || !sameDay || sameDay && !sameTime;
        chatHistory.push(messages);
      }

      person.friends[i] = JSON.stringify(chatInfo);
      return person.update({friends: person.friends});
    })
    .catch(next);
  }

  updateInfo(friendEmail)
  .then(user => updateInfo(userEmail))
  .then(user => {
    res.json(friend);
  })
  .catch(next);
});

// used for when user receives a friend's messages
router.put('/messageReceive', function(req, res, next) {
  var { userEmail, friendEmail } = req.body;
  User.findOne({
    where: {
      email: userEmail
    }
  })
  .then(user => {
    if (!user) {
      const error = new Error('Cannot find user when trying to receive message. User email:', userEmail);
      error.status = 400;
      next(error);
    }
    res.json(user.friends.find(friend => JSON.parse(friend).email === friendEmail));
  })
  .catch(next);
});

// used for when user reads a friend's messages
router.put('/messageRead', function(req, res, next) {
  var { userEmail, friendEmail } = req.body;
  // make sure friend is the user's friend by using the if statement (person.email === userEmail) ?
  // this is because there's a race condition where updateInfo(userEmail) and
  // updateInfo(friendEmail) can both run and whichever runs 'if (person.email === userEmail) friend = chatInfo;'
  // last will determine the 'friend' var's value
  var friend;
  function updateInfo(personEmail) {
    return User.findOne({
      where: {
        email: personEmail
      }
    })
    .then(person => {
      if (!person) {
        const error = new Error('Cannot find user/friend when trying to mark messages as read. User/friend email:', personEmail);
        error.status = 400;
        next(error);
      }
      let index = person.friends.map(f => JSON.parse(f)).findIndex(f => f.email === (person.email === userEmail ? friendEmail : userEmail));
      
      let chatInfo = friend = JSON.parse(person.friends[index]);
      if (person.email === friendEmail) friend = chatInfo;

      chatInfo.chatHistory = chatInfo.chatHistory || [];
      let chatHistory = chatInfo.chatHistory;
      let message;

      // keep checking messages (starting from the latest) and mark all of friend's 
      // unread messages as read for both the user and the friend until a read message is reached

      for (let i = chatHistory.length - 1; i >= 0; i--) {
        message = chatHistory[i];
        if (message.friend && personEmail === userEmail || !message.friend && personEmail === friendEmail) {
          if (message.read) break;
          message.read = true;
        } 
      }

      person.friends[index] = JSON.stringify(chatInfo);
      return person.update({friends: person.friends})
    });
  }
  // mark friend's messages as read for friend
  updateInfo(friendEmail)
  .then(user => updateInfo(userEmail))
  // mark friend's messages as read for user
  .then(user => {
    res.json(friend);
  })
  .catch(next);
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
  const { user, friends, friend, favorite, newFriendName, newInfo } = req.body;
  // If I'm changing my own info (name, motto, photo, background photo, etc.)
  if (newInfo) {
    User.findOne({
      where: {
        email: user.email
      }
    })
    .then(user => {
      if ((newInfo.photo || newInfo.photo === '') && user.photo) {
        var regex = /upload\/[a-zA-z0-9]+\/([a-zA-z0-9]+)/;
        var match = regex.exec(user.photo);
        cloudinary.uploader.destroy(match[1], result => { console.log(result) });
      }
      let newUser = {
        ...user.dataValues,
        ...newInfo
      };
      return user.update(newUser);
    })
    .then(user => {
      res.json({changedMyInfo: true, user});
    })
    .catch(next);
    return;
  }
  // If I'm favoriting/unfavoriting a friend or changing a friend's name...
  if (favorite || newFriendName) {
    User.findOne({
      where: {
        email: user.email
      }
    })
    .then(user => {
      // user.friends stores the 'favorite' info (it stores favorite, chatHistory)
      // therefore update user.friends first, then update 'friends' from req.body and
      // send back 'friends'
      let indexInUserFriends = user.friends.map(f => JSON.parse(f)).findIndex(f => f.email === friend.email);
      let indexInFriends = friends.findIndex(f => f.email === friend.email);
      let foundFriend = JSON.parse(user.friends[indexInUserFriends]);
      // update 'friends' as well since it has the fetched friend list (populated with info)
      if (favorite) foundFriend.favorite = friends[indexInFriends].favorite = favorite === 'add';
      if (newFriendName) foundFriend.tempName = friends[indexInFriends].tempName = newFriendName;

      user.friends[indexInUserFriends] = JSON.stringify(foundFriend);
      return user.update({friends: user.friends});
    })
    .then(user => {
      if (favorite) res.json({favorite, friends});
      if (newFriendName) res.json({newFriendName, friends});
    })
    .catch(next);
    return;
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

router.param('userEmail', function(req, res, next, userEmail) {
  User.findByPk(userEmail)
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

router.get('/:userEmail', function(req, res) {
  res.json(req.requestedUser);
});

router.put('/:userEmail', function(req, res, next) {
  req.requestedUser.update(req.body)
  .then(function(user) {
    res.send(user);
  })
  .catch(next);
});

router.delete('/:userEmail', function(req, res, next) {
  req.requestedUser.destroy()
  .then(function() {
    res.sendStatus(204)
  })
  .catch(next);
})

module.exports = router;