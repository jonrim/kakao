'use strict'
import 'babel-polyfill'; /* for generators */
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import getRoutes from './routes'
import configureStore from './redux/configureStore'
import { ConnectedRouter } from 'connected-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { hot } from 'react-hot-loader'
import App from './app'
import createSagaMiddleware from 'redux-saga'
import mySaga from 'Sagas'

const sagaMiddleware = createSagaMiddleware()
// const history = syncHistoryWithStore(browserHistory, store)
const history = createBrowserHistory()
const store = configureStore(history, sagaMiddleware)

sagaMiddleware.run(mySaga)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)

export default hot(module)(App)