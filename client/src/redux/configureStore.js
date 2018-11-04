'use strict'

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from './middleware/promise'
import makeReducer from './makeReducer'

export default function configureStore (history, initialState) {

  const reducer = makeReducer();

  const middleware = [thunk, promise, routerMiddleware(history)]
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
  }

  const enhancers = composeWithDevTools(
    applyMiddleware(...middleware)
  )

  return createStore(reducer, initialState, enhancers)
}
