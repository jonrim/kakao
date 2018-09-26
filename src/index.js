'use strict'

import React from 'react'
import { render } from 'react-dom'
import {
  Friends,
  Chats,
  Find,
  More
} from 'Components';
// import { Provider } from 'react-redux'
// import { Router, browserHistory } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
// import getRoutes from './routes'
// import configureStore from './redux/configureStore'

// import 'styles/index.scss'

// const store = configureStore(browserHistory)
// const history = syncHistoryWithStore(browserHistory)

// const component = (
//   <Router history={history} routes={getRoutes(store)} />
// )

// render(
//   <Provider store={store} key='provider'>
//     {component}
//   </Provider>,
//   document.getElementById('app')
// )

import { BrowserRouter, Route, Link } from 'react-router-dom'

const App = () => (
  <div>
    <ul>
      <li><Link to="/">Friends</Link></li>
      <li><Link to="/chats">Chats</Link></li>
      <li><Link to="/find">Find</Link></li>
      <li><Link to="/more">More</Link></li>
    </ul>
    
    <hr/>

    <Route exact path='/' component={Friends}/>
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