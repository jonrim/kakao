import { push } from 'connected-react-router';
import { auth } from 'Api';
import * as Consts from 'Constants/auth';

const initialState = {
  isFetching: false,
  error: null,
  user: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Consts.LOGIN_REQUEST:
    case Consts.LOGOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case Consts.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: {
          ...action.result,
          friends: action.result.friends.map(friend => JSON.parse(friend)),
        }
      }
    case Consts.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: null
      }
    case Consts.SESSION_SUCCESS:
      return {
        ...state,
        user: {
          ...action.result,
          friends: action.result.friends.map(friend => JSON.parse(friend)),
        }
      };
    case Consts.LOGIN_FAILED:
    case Consts.LOGOUT_FAILED:
    case Consts.SESSION_FAILED:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      }
    default:
      return state
  }
};

