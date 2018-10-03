'use strict'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import {
  Nav,
  Friends,
  Chats,
  Find,
  More
} from 'Components'
import Loadable from 'Utils'

import 'Styles/index.scss'

const AsyncFriends = Loadable({
  loader: () => import(/* webpackChunkName: 'friends' */ 'Components/friends')
})

const App = () => (
  <div>
    <Nav/>
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