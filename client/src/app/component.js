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
} from 'Components'
import { Loadable } from 'Utils'
import SplitPane from 'react-split-pane'
import socketIOClient from 'socket.io-client'
import { Route, Switch, Link } from 'react-router-dom'
import { Modal, Icon, Message } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector'

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
      navWidth: 700
    };
    this.initializeSocket = this.initializeSocket.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toggleFriendRequestsModal = this.toggleFriendRequestsModal.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    const { endpoint, socket } = this.state;
    const { requestSession, requestFriendsList, requestPendingFriendRequests, user } = this.props;

    if (user) {
      requestFriendsList(user);
      requestPendingFriendRequests(user);
      this.initializeSocket();
    }
    if (!user) requestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { requestFriendsList, requestPendingFriendRequests, user, pendingFriendRequests } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
      requestPendingFriendRequests(user);
      this.initializeSocket();
    }

    if (prevProps.pendingFriendRequests.length !== pendingFriendRequests.length && pendingFriendRequests.length === 0) {
      this.toggleFriendRequestsModal();
    }
  }

  initializeSocket() {
    const { user, requestReceiveMessages, requestPendingFriendRequests, requestFriendsList } = this.props;
    this.setState({
      socket: socketIOClient('localhost:8080', { transport: ['websocket', 'polling', 'flashsocket'] })
    }, () => {
      const { socket } = this.state;
      socket.on('connect', () => {
        socket.emit('connected', {socketId: socket.id, userEmail: user.email}); 
      })
      socket.on('messageReceive', message => {
        // console.log('receiving messages', message)
        requestReceiveMessages({socketId: socket.id, userEmail: message.userEmail, friendEmail: message.friendEmail});
      })
      socket.on('sentFriendRequest', userInfo => {
        requestPendingFriendRequests(user);
      })
      socket.on('acceptedFriendRequest', userInfo => {
        requestFriendsList(user);
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

  onResize(navWidth) {
    this.setState({navWidth});
  }

  render() {
    const { socket, friendRequestsModal, navWidth } = this.state;
    const { user, friends, chatroom, profile, pendingFriendRequests, requestManageFriendRequest, errorManageFriendRequest } = this.props;
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={300}
          pane1Style={{maxWidth: chatroom || profile ? '67%' : 'inherit'}}
          resizerStyle={{display: chatroom || profile ? 'inherit' : 'none'}}
        >
          <NavAndViews
            {...this.state}
            {...this.props}
            {...this}
          />
          {
            profile ? 
            <UserProfile /> : (
              chatroom &&
              <Chatroom
                socket={socket}
              />
            )
          }
        </SplitPane>
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
  const { user, friends, chatroom, socket, logOut, toggleFriendRequestsModal, onResize, navWidth } = props;

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
          />
          <Switch>
            <Route exact path='/' render={(props) => (
              <Friends {...props} socket={socket} />
            )}/>
            <Route path='/chats' render={(props) => (
              <Chats {...props} socket={socket} />
            )}/>
            <Route path='/find' render={(props) => (
              <Find {...props} socket={socket} />
            )}/>
            <Route path='/more' component={More} />
          </Switch>
        </div> :
        <Auth />
      }
      <ReactResizeDetector handleWidth onResize={onResize}/>
    </div>
  );
} 