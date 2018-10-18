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
      chatroom: null,
      width: window.innerWidth
    };
    this.changeFriendState = this.changeFriendState.bind(this);
    this.changeWidthState = this.changeWidthState.bind(this);
  }

  changeFriendState(propName, friend, router) {
    this.setState({
      [propName]: friend
    }, () => {
      // router.push('/chat/' + this.state.chatroom.id)
    });
  }

  changeWidthState() {
    this.setState({width: window.innerWidth});
  }

  componentDidMount() {
    window.addEventListener('resize', this.changeWidthState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeWidthState);
  }

  render() {
    const { chatroom, width } = this.state;
    const { changeFriendState } = this;
    return (
      <div>
        {
          chatroom && width >= 900 ? (
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
              <div>
                <Chatroom
                  chatroom={chatroom}
                />  
              </div>
            </SplitPane>
          ) : chatroom && width < 900 ? (
            <Chatroom
              chatroom={chatroom}
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