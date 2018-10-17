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

import 'Styles/index.scss'


const history = createBrowserHistory()

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatroom: null
    };
    this.changeFriendState = this.changeFriendState.bind(this);
  }

  changeFriendState(propName, friend, router) {
    this.setState({
      [propName]: friend
    }, () => {
      router.push('/chat/' + this.state.chatroom.id)
    });
  }

  render() {
    const { chatroom } = this.state;
    const { changeFriendState } = this;
    return (
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
          
            <Route path='/chat/:id' exact render={props => (
              <Chatroom
                chatroom={chatroom}
              />
            )}/>
          
        </Switch>
        {
          chatroom && window.innerWidth >= 900 &&
          <Route path='/chat/:id' exact render={props => (
            <Chatroom
              chatroom={chatroom}
            />
          )}/>
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