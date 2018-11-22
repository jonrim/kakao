import React, { Component } from 'react'
import {
  Auth,
  Nav,
  Friends,
  Chats,
  Find,
  More,
  Chatroom
} from 'Components'
import { Loadable } from 'Utils'
import SplitPane from 'react-split-pane'
import socketIOClient from 'socket.io-client'
import { Route, Switch, Link } from 'react-router-dom'
import { Modal } from 'semantic-ui-react'

import './index.scss'

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080',
      friendRequestsModal: false
    };
    this.initializeSocket = this.initializeSocket.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toggleFriendRequestsModal = this.toggleFriendRequestsModal.bind(this);
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
    const { requestFriendsList, requestPendingFriendRequests, user } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
      requestPendingFriendRequests(user);
      this.initializeSocket();
    }
  }

  initializeSocket() {
    const { user, requestReceiveMessages, requestPendingFriendRequests } = this.props;
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
      socket.on('friendRequest', userInfo => {
        requestPendingFriendRequests({socketId: socket.id, email: userInfo.userEmail});
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

  render() {
    const { socket, friendRequestsModal } = this.state;
    const { user, friends, chatroom, pendingFriendRequests } = this.props;
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={300}
          resizerStyle={{display: chatroom ? 'inherit' : 'none'}}
        >
          <NavAndViews
            {...this.state}
            {...this.props}
            logOut={this.logOut}
            toggleFriendRequestsModal={this.toggleFriendRequestsModal}
          />
          {
            chatroom &&
            <Chatroom
              socket={socket}
            />
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
              pendingFriendRequests.map((pendingFriend, i) => (
                <div className='pending-friend' key={i}>
                  <div className='pending-friend-photo'>
                    <img src={pendingFriend.photo} />
                  </div>
                  <div className='pending-friend-name'>
                    <p>{pendingFriend.name}</p>
                  </div>
                  <div className='pending-friend-motto'>
                    <p>{pendingFriend.motto}</p>
                  </div>
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
  const { user, friends, chatroom, socket, logOut, toggleFriendRequestsModal } = props;

  return (
    <div className='nav-and-views'>
      {
        user ?
        <div>
          <Nav friends={friends} logOut={logOut} toggleFriendRequestsModal={toggleFriendRequestsModal} />
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
    </div>
  );
} 