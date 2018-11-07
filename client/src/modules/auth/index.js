import { push } from 'connected-react-router';
import { auth } from 'Api';
import * as Consts from 'Constants/auth';

const initialState = {
  login: {
    isFetching: false,
    error: null
  },
  logout: {
    isFetching: false,
    error: null
  },
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
        user: action.result.user
      }
    case Consts.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: null
      }
    case Consts.LOGIN_FAILED:
    case Consts.LOGOUT_FAILED:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      }
    default:
      return state
  }
};

