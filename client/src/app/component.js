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

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080',
      mobileWindow: window.innerWidth < 900
    };
    this.changeFriendState = this.changeFriendState.bind(this);
    this.changeIsMobileState = this.changeIsMobileState.bind(this);
    this.initializeSocket = this.initializeSocket.bind(this);
  }

  componentDidMount() {
    const { endpoint, socket } = this.state;
    const { requestSession, requestFriendsList, user } = this.props;

    if (user) {
      requestFriendsList(user);
      this.initializeSocket();
    }
    if (!user) requestSession();
    window.addEventListener('resize', this.changeIsMobileState);
  }

  componentDidUpdate(prevProps, prevState) {
    const { requestFriendsList, user } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
      this.initializeSocket();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeIsMobileState);
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
        requestReceiveMessages({socketId: socket.id, userEmail: user.email});
      })
    }); 
  }

  changeFriendState(propName, friend) {
    this.setState({
      [propName]: friend
    });
  }

  changeIsMobileState() {
    const { mobileWindow } = this.state;
    if (window.innerWidth < 900 && !mobileWindow) this.setState({mobileWindow: true});
    else if (window.innerWidth >= 900 && mobileWindow) this.setState({mobileWindow: false});
  }

  render() {
    const { chatroom, mobileWindow, socket } = this.state;
    const { user, friends } = this.props;
    return (
      <div style={{height: '100%'}}>
        {
          chatroom && !mobileWindow ? (
            <SplitPane split='vertical' minSize={350} defaultSize={450}>
              <NavAndViews
                {...this.props} 
                changeFriendState={this.changeFriendState}
              />
              <Chatroom
                chatroom={chatroom}
                changeFriendState={this.changeFriendState}
                mobileWindow={mobileWindow}
                socket={socket}
              />
            </SplitPane>
          ) : chatroom && mobileWindow ? (
            <Chatroom
              chatroom={chatroom}
              changeFriendState={this.changeFriendState}
              mobileWindow={mobileWindow}
              socket={socket}
            />
          ) : (
            <NavAndViews
              {...this.props} 
              changeFriendState={this.changeFriendState}
            />
          )
        }
      </div>
    )
  }
}

const NavAndViews = props => {
  const { user, friends, chatroom, mobileWindow, socket, changeFriendState } = props;

  return (
    <div style={{height: '100%'}}>
      {
        user ?
        <div>
          <Nav friends={friends} />
          <Switch>
            <Route exact path='/' render={(props) => (
              <Friends {...props}
                chatroom={chatroom}
                changeFriendState={changeFriendState}
                socket={socket}
              />
            )}/>
            <Route path='/chats' render={(props) => (
              <Chats {...props}
                chatroom={chatroom}
                changeFriendState={changeFriendState}
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