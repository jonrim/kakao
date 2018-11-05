'use strict'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import getRoutes from './routes'
import configureStore from './redux/configureStore'
import { ConnectedRouter } from 'connected-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { hot } from 'react-hot-loader'
import App from './app'

import 'Styles/index.scss'

// const history = syncHistoryWithStore(browserHistory, store)
const history = createBrowserHistory()
const store = configureStore(history)


render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App store={store} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)

export default hot(module)(App)