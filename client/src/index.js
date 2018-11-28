'use strict'
import 'babel-polyfill'; /* for generators */
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader'
import App from './app'
import { history, store } from './redux/configureStore'

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)

export default hot(module)(App)