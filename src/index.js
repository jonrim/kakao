'use strict'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import {
  Friends,
  Chats,
  Find,
  More
} from 'Components';
import Loadable from 'Utils';

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
});

const App = () => (
  <div>
    <ul>
      <li><Link to="/">Friends</Link></li>
      <li><Link to="/chats">Chats</Link></li>
      <li><Link to="/find">Find</Link></li>
      <li><Link to="/more">More</Link></li>
    </ul>
    
    <hr/>

    <Route exact path='/' component={AsyncFriends}/>
    <Route path='/chats' component={Chats}/>
    <Route path='/find' component={Find}/>
    <Route path='/more' component={More}/>
  </div>
)


render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('app')
)