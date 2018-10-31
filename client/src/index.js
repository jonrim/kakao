'use strict'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import {
  Nav,
  Friends,
  Chats,
  Find,
  More,
  Chatroom
} from 'Components'
import Loadable from 'Utils'
import SplitPane from 'react-split-pane'
import socketIOClient from 'socket.io-client'
import { hot } from 'react-hot-loader'

import 'Styles/index.scss'


const history = createBrowserHistory()

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080',
      chatroom: {id: 1, photo: '/images/sejin.jpg', name: '세진❤', favorite: true, motto: '🥑'},
      mobileWindow: window.innerWidth < 900
    };
    this.changeFriendState = this.changeFriendState.bind(this);
    this.changeIsMobileState = this.changeIsMobileState.bind(this);
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

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    window.addEventListener('resize', this.changeIsMobileState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeIsMobileState);
  }

  render() {
    const { chatroom, mobileWindow } = this.state;
    const { changeFriendState } = this;
    return (
      <div style={{height: '100%'}}>
        {
          chatroom && !mobileWindow ? (
            <SplitPane split='vertical' minSize={350} defaultSize={450}>
              <div>
                <Nav/>
                <Switch>
                  <Route exact path='/' render={props => (
                    <AsyncFriends {...props}
                      chatroom={chatroom}
                      changeFriendState={changeFriendState}
                    />
                  )}/>
                  <Route path='/chats' component={Chats} />
                  <Route path='/find' component={Find} />
                  <Route path='/more' component={More} />
                </Switch>
              </div>
              <Chatroom
                chatroom={chatroom}
                changeFriendState={changeFriendState}
                mobileWindow={mobileWindow}
              />
            </SplitPane>
          ) : chatroom && mobileWindow ? (
            <Chatroom
              chatroom={chatroom}
              changeFriendState={changeFriendState}
              mobileWindow={mobileWindow}
            />
          ) : (
            <div>
              <Nav/>
              <Switch>
                <Route exact path='/' render={props => (
                  <AsyncFriends {...props}
                    chatroom={chatroom}
                    changeFriendState={changeFriendState}
                  />
                )}/>
                <Route path='/chats' component={Chats} />
                <Route path='/find' component={Find} />
                <Route path='/more' component={More} />
              </Switch>
            </div>
          )
        }
      </div>
    )
  }
}

render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('app')
)

export default hot(module)(App)