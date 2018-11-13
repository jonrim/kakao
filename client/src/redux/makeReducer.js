import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from 'Reducers/auth'
import user from 'Reducers/user'

export default (history) => combineReducers({
  router: connectRouter(history),
  auth,
  user
});
