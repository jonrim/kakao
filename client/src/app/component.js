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
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const { requestSession, requestFriendsList, user } = this.props;

    if (user) requestFriendsList(user);
    if (!user) requestSession();
    // const socket = socketIOClient(endpoint);
    window.addEventListener('resize', this.changeIsMobileState);
  }

  componentDidUpdate(prevProps, prevState) {
    const { requestFriendsList, user } = this.props;
    
    if (!prevProps.user && user) {
      requestFriendsList(user);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeIsMobileState);
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
    const { chatroom, mobileWindow } = this.state;
    const { user } = this.props;
    return (
      <div style={{height: '100%'}}>
        {
          chatroom && !mobileWindow ? (
            <SplitPane split='vertical' minSize={350} defaultSize={450}>
              <div style={{height: '100%'}}>
                {
                  user ?
                  <div>
                    <Nav/>
                    <Switch>
                      <Route exact path='/' render={(props) => (
                        <Friends {...props}
                          chatroom={chatroom}
                          changeFriendState={this.changeFriendState}
                        />
                      )}/>
                      <Route path='/chats' component={Chats} />
                      <Route path='/find' component={Find} />
                      <Route path='/more' component={More} />
                    </Switch>
                  </div> :
                  <Auth />
                }
              </div>
              <Chatroom
                chatroom={chatroom}
                changeFriendState={this.changeFriendState}
                mobileWindow={mobileWindow}
              />
            </SplitPane>
          ) : chatroom && mobileWindow ? (
            <Chatroom
              chatroom={chatroom}
              changeFriendState={this.changeFriendState}
              mobileWindow={mobileWindow}
            />
          ) : (
            <div style={{height: '100%'}}>
              {
                user ?
                <div>
                  <Nav/>
                  <Switch>
                    <Route exact path='/' render={(props) => (
                      <Friends {...props}
                        chatroom={chatroom}
                        changeFriendState={this.changeFriendState}
                      />
                    )}/>
                    <Route path='/chats' component={Chats} />
                    <Route path='/find' component={Find} />
                    <Route path='/more' component={More} />
                  </Switch>
                </div> :
                <Auth />
              }
            </div>
          )
        }
      </div>
    )
  }
}