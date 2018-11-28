import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import roomReducer from 'Reducers/room-reducer'
import audioReducer from 'Reducers/audio-reducer'
import videoReducer from 'Reducers/video-reducer'
import auth from 'Reducers/auth'
import user from 'Reducers/user'

export default (history) => combineReducers({
  router: connectRouter(history),
  auth,
  user,
  rooms: roomReducer,
  video: videoReducer,
  audio: audioReducer
});
