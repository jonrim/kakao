import React, { Component } from 'react'
import {
  Auth,
  Nav,
  Friends,
  Chats,
  Find,
  More,
  Chatroom,
  UserProfile,
  VideoChat
} from 'Components'
import { Loadable } from 'Utils'
import SplitPane from 'react-split-pane'
import socketIOClient from 'socket.io-client'
import { Route, Switch, Link } from 'react-router-dom'
import { Modal, Icon, Message, Button } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector'
import {
  isBrowser,
  isMobileOnly,
  isAndroid,
  isWinPhone,
  isIOS
} from 'react-device-detect'

import './index.scss'

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080',
      friendRequestsModal: false,
      navWidth: null,
      windowWidth: null,
      socket: null,
      videoChat: null,
      incomingCall: null,
    };
    this.initializeSocket = this.initializeSocket.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toggleFriendRequestsModal = this.toggleFriendRequestsModal.bind(this);
    this.onNavResize = this.onNavResize.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.openVideoChat = this.openVideoChat.bind(this);
    this.closeVideoChat = this.closeVideoChat.bind(this);
    this.hideNotification = this.hideNotification.bind(this);
    this.acceptCall = this.acceptCall.bind(this);
  }

  componentDidMount() {
    const { endpoint, socket } = this.state;
    const { requestSession, requestFriendsList, requestPendingFriendRequests, user } = this.props;

    if (user) {
      requestFriendsList(user);
      requestPendingFriendRequests(user);
    }
    if (!user) requestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, friends, isFetchingFriendList, requestFriendsList, requestPendingFriendRequests, pendingFriendRequests } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
      requestPendingFriendRequests(user);
    }

    // initialize socket only after getting back results from fetching friend list
    if (prevProps.isFetchingFriendList && !isFetchingFriendList) {
      this.initializeSocket();
    }

    if (prevProps.pendingFriendRequests.length !== pendingFriendRequests.length && pendingFriendRequests.length === 0) {
      this.toggleFriendRequestsModal();
    }
  }

  initializeSocket() {
    const { user, friends, requestReceiveMessages, requestPendingFriendRequests, requestFriendsList } = this.props;
    this.setState({
      socket: socketIOClient('localhost:8080', { transport: ['websocket', 'polling', 'flashsocket'] })
    }, () => {
      const { socket } = this.state;
      socket.on('connect', () => {
        socket.emit('connected', {socketId: socket.id, userEmail: user.email}); 
      })
      socket.on('messageReceive', message => {
        requestReceiveMessages({socketId: socket.id, userEmail: message.userEmail, friendEmail: message.friendEmail});
      })
      socket.on('sentFriendRequest', userInfo => {
        requestPendingFriendRequests(user);
      })
      socket.on('acceptedFriendRequest', userInfo => {
        requestFriendsList(user);
      })
      socket.on('callIncoming', data => {
        this.setState({incomingCall: {
          ...data,
          friend: friends.find(f => f.email === data.friendEmail)
        }}, () => {
          let notification = document.getElementById('noti-incoming-call');
          notification.classList.remove('active', 'inactive');
          notification.classList.add('active');
          setTimeout(() => {
            if (notification.classList.contains('active'))
              notification.classList.add('inactive');
          }, 14000);
          setTimeout(() => {
            if (notification.classList.contains('inactive'))
              notification.classList.remove('active', 'inactive');
          }, 15000);
          
          setTimeout(() => {
            if (this.state.incomingCall) this.setState({incomingCall: null});
          }, 15000); 
        });
      })
    }); 
  }

  logOut() {
    const { requestLogout } = this.props;
    requestLogout();
  }

  toggleFriendRequestsModal() {
    this.setState({
      friendRequestsModal: !this.state.friendRequestsModal
    });
  }

  onNavResize(navWidth) {
    this.setState({navWidth});
  }

  onWindowResize(windowWidth, windowHeight) {
    this.setState({windowWidth, windowHeight, mobileLandscape: (windowHeight < windowWidth) && (isMobileOnly || isIOS || isAndroid || isWinPhone)});
  }

  openVideoChat(roomId, friend) {
    this.setState({videoChat: {roomId, friend}}, () => {
      this.props.push('r/'+this.state.videoChat.roomId);
    });
  }

  closeVideoChat() {
    this.setState({videoChat: null});
  }

  hideNotification() {
    let notification = document.getElementById('noti-incoming-call');
    notification.classList.add('inactive');
    setTimeout(() => {
      notification.classList.remove('active', 'inactive');
    }, 1000);
    
    setTimeout(() => this.setState({incomingCall: null}), 1000); 
  }

  acceptCall() {
    const { incomingCall } = this.state;
    this.hideNotification();
    this.openVideoChat(incomingCall.roomId, incomingCall.friend);
  }

  render() {
    const { socket, friendRequestsModal, navWidth, windowWidth, videoChat, incomingCall, mobileLandscape } = this.state;
    const { user, friends, chatroom, profile, pendingFriendRequests, requestManageFriendRequest, errorManageFriendRequest } = this.props;
    return (
      <div style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}>
        <SplitPane
          split='vertical'
          minSize={300}
          pane1Style={{
            maxWidth: chatroom || profile ? '67%' : 'inherit',
            display: (chatroom || profile) && (windowWidth <= 900 || (isMobileOnly || isIOS || isAndroid || isWinPhone) && !mobileLandscape) ? 'none': 'block' 
          }}
          resizerStyle={{display: (chatroom || profile) && windowWidth >= 900 ? 'inherit' : 'none'}}
        >
          <NavAndViews
            {...this.state}
            {...this.props}
            logOut={this.logOut}
            toggleFriendRequestsModal={this.toggleFriendRequestsModal}
            openVideoChat={this.openVideoChat}
            closeVideoChat={this.closeVideoChat}
            navWidth={navWidth}
          />
          {
            profile ? 
            <UserProfile socket={socket} openVideoChat={this.openVideoChat} /> : 
            (
              chatroom &&
              <Chatroom socket={socket} />
            )
          }
        </SplitPane>
        <ReactResizeDetector handleWidth handleHeight onResize={this.onWindowResize}/>
        {
          !videoChat && incomingCall &&
          <div className='notification' id='noti-incoming-call'>
            <i className='fas fa-times' onClick={this.hideNotification} />
            <div className='photo'>
              <img src={incomingCall.friend && incomingCall.friend.photo} /> 
            </div>
            <div className='name'>{incomingCall.friend && (incomingCall.friend.tempName || incomingCall.friend.name)}</div>
            <div className='text'>Incoming Call...</div>
            <Button.Group>
              <Button icon='phone' onClick={this.acceptCall} />
              <Button.Or text='' />
              <Button icon='phone' onClick={this.hideNotification} />
            </Button.Group>
          </div>
        }
        <Modal
          open={friendRequestsModal}
          onClose={this.toggleFriendRequestsModal}
          dimmer='blurring'
        >
          <Modal.Header>Pending Friend Requests</Modal.Header>
          <Modal.Content>
            {
              errorManageFriendRequest &&
              <Message negative style={{margin: '10px -15px'}}>{ errorManageFriendRequest }</Message>
            }
            {
              pendingFriendRequests.map((pendingFriend, i) => (
                <div className='pending-friend' key={i}>
                  <div 
                    className='accept-reject'
                    style={{
                      paddingLeft: navWidth <= 550 ? '20px' : '10px'
                    }}
                  >
                    <Icon className='accept' name='check circle' onClick={() => {
                      requestManageFriendRequest({user: user, action: 'accept', pendingFriend});
                      // need to find a way to get the above request's results first before emitting to socket
                      // socket.emit('acceptedFriendRequest', {userEmail: user.email, friendEmail: pendingFriend.email});
                    }} />
                    <Icon className='reject' name='times circle' onClick={() => requestManageFriendRequest({user: user, action: 'reject', pendingFriend})} />
                  </div>
                  <div
                    style={{
                      paddingLeft: navWidth <= 550 ? '20px' : '0',
                      position: 'absolute',
                      width: navWidth <= 550 ? '70%' : '50%',
                      display: 'inline-block',
                      overflow: 'hidden',
                      left: '100px',
                      top: '5px'
                    }}
                  >
                    <div className='pending-friend-photo photo'>
                      <img src={pendingFriend.photo} />
                    </div>
                    <div className='pending-friend-name'>
                      <p>{pendingFriend.name}</p>
                    </div>
                    <div className='pending-friend-email'>
                      <p>{pendingFriend.email}</p>
                    </div>
                  </div>
                  {
                    navWidth > 550 &&
                    <div className='pending-friend-motto'>
                      <p>{pendingFriend.motto}</p>
                    </div>
                  }
                </div>
              ))
            }
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

const NavAndViews = props => {
  const { user, friends, chatroom, socket, logOut, toggleFriendRequestsModal, 
          onNavResize, navWidth, videoChat, openVideoChat, closeVideoChat } = props;

  return (
    <div className='nav-and-views'>
      {
        user ?
        <div>
          <Nav 
            friends={friends} 
            logOut={logOut} 
            toggleFriendRequestsModal={toggleFriendRequestsModal}
            navWidth={navWidth}
            videoChat={videoChat}
          />
          <Switch>
            <Route exact path='/' render={(props) => (
              <Friends {...props} openVideoChat={openVideoChat} socket={socket} />
            )}/>
            <Route path='/chats' render={(props) => (
              <Chats {...props} socket={socket} />
            )}/>
            <Route path='/find' render={(props) => (
              <Find {...props} socket={socket} />
            )}/>
            <Route path='/more' component={More} />
            <Route path='/r/:room' render={(props) => (
              <VideoChat 
                {...props}
                socket={socket}
                videoChat={videoChat}
                closeVideoChat={closeVideoChat}
              />
            )}/>
          </Switch>
        </div> :
        <Auth />
      }
      <ReactResizeDetector handleWidth onResize={onNavResize}/>
    </div>
  );
} 