'use strict'

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from './middleware/promise'
import makeReducer from './makeReducer'
import mySaga from 'Sagas'

function configureStore (history, sagaMiddleware) {

  const reducer = makeReducer(history);
  
  // const mapStoreToStorage = () => localStorage.setItem('reduxState', JSON.stringify(store.getState()));
  // const persistedState = localStorage.getItem('reduxState')
  //   ? JSON.parse(localStorage.getItem('reduxState'))
  //   : {
  //     rooms: [],
  //     video: true,
  //     audio: true
  //   };

  const middleware = [thunk, promise, routerMiddleware(history), sagaMiddleware]
  
    middleware.push(logger)
  

  const enhancers = composeWithDevTools(
    applyMiddleware(...middleware)
  )


  // const store = createStore(reducer, persistedState, enhancers)
  const store = createStore(reducer, {}, enhancers)
  // store.subscribe(mapStoreToStorage);
  return store;
}

const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory()
const store = configureStore(history, sagaMiddleware)

sagaMiddleware.run(mySaga)

export { history, store };