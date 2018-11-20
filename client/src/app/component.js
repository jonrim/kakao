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

import './index.scss'

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080'
    };
    this.initializeSocket = this.initializeSocket.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const { endpoint, socket } = this.state;
    const { requestSession, requestFriendsList, user } = this.props;

    if (user) {
      requestFriendsList(user);
      this.initializeSocket();
    }
    if (!user) requestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { requestFriendsList, user } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
      this.initializeSocket();
    }
  }

  initializeSocket() {
    const { user, requestReceiveMessages } = this.props;
    this.setState({
      socket: socketIOClient('localhost:8080', { transport: ['websocket', 'polling', 'flashsocket'] })
    }, () => {
      const { socket } = this.state;
      socket.on('connect', () => {
        socket.emit('connected', {socketId: socket.id, userEmail: user.email}); 
      })
      socket.on('messageReceive', message => {
        console.log('receiving messages', message)
        // requestReceiveMessages({socketId: socket.id, userEmail: message.userEmail, friendEmail: message.friendEmail});
      })
    }); 
  }

  logOut() {
    const { requestLogout } = this.props;
    requestLogout();
  }

  render() {
    const { socket } = this.state;
    const { user, friends, chatroom } = this.props;
    return (
      <SplitPane className={chatroom ? '' :'soloPane1'} split='vertical' minSize={300}>
        <NavAndViews
          {...this.props}
          logOut={this.logOut}
        />
        {
          chatroom &&
          <Chatroom
            socket={socket}
          />
        }
      </SplitPane>
    )
  }
}

const NavAndViews = props => {
  const { user, friends, chatroom, socket, logOut } = props;

  return (
    <div className='nav-and-views'>
      {
        user ?
        <div>
          <Nav friends={friends} logOut={logOut} />
          <Switch>
            <Route exact path='/' render={(props) => (
              <Friends {...props}
                chatroom={chatroom}
                socket={socket}
              />
            )}/>
            <Route path='/chats' render={(props) => (
              <Chats {...props}
                socket={socket}
              />
            )}/>
            <Route path='/find' component={Find} />
            <Route path='/more' component={More} />
          </Switch>
        </div> :
        <Auth />
      }
    </div>
  );
} 