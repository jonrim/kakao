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
import { Route, Switch, Redirect } from 'react-router-dom'
import {
  isLoaded as isAuthLoaded,
  load as loadAuth
} from 'Modules/auth';

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: require('ip').address() + ':8080',
      chatroom: {id: 1, photo: '/images/sejin.jpg', name: '세진❤', favorite: true, motto: '🥑'},
      mobileWindow: window.innerWidth < 900
    };
    this.changeFriendState = this.changeFriendState.bind(this);
    this.changeIsMobileState = this.changeIsMobileState.bind(this);
    this.getAuth = this.getAuth.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.getAuth();
    window.addEventListener('resize', this.changeIsMobileState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeIsMobileState);
  }

  getAuth() {
    console.log('getAuth');
    const { store } = this.props;
    if (!isAuthLoaded(store.getState())) {
      store
        .dispatch(loadAuth())
    }
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
    const { store } = this.props;
    const { auth: { user } } = store.getState();
    return (
      <div style={{height: '100%'}}>
        {
          chatroom && !mobileWindow ? (
            <SplitPane split='vertical' minSize={350} defaultSize={450}>
              <div>
                <Nav/>
                <Switch>
                  <Route exact path='/' render={() => (
                    user ? (
                      <Redirect to='/friends' />
                    ) : (
                      <Auth />
                    )
                  )}/>
                  <Route path='/friends' render={props => (
                    <AsyncFriends {...props}
                      chatroom={chatroom}
                      changeFriendState={this.changeFriendState}
                    />
                  )}/>
                  <Route path='/chats' component={Chats} />
                  <Route path='/find' component={Find} />
                  <Route path='/more' component={More} />
                </Switch>
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
            <div>
              <Nav/>
              <Switch>
                <Route exact path='/' render={props => (
                  <AsyncFriends {...props}
                    chatroom={chatroom}
                    changeFriendState={this.changeFriendState}
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