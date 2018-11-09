import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from 'Modules/auth'
import user from 'Modules/user'

export default (history) => combineReducers({
  router: connectRouter(history),
  auth,
  user
});
