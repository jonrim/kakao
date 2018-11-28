import { auth } from 'Api';
import * as Consts from 'Constants/auth';
import * as ConstsUser from 'Constants/user';

const initialState = {
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Consts.LOGIN_REQUEST:
    case Consts.LOGOUT_REQUEST:
    case Consts.SIGNUP_REQUEST:
    case Consts.SESSION_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case Consts.LOGIN_SUCCESS:
    case Consts.SIGNUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.result
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
          friends: [],
        }
      }
    case ConstsUser.CHANGEINFO_SUCCESS:
      if (action.result.changedMyInfo) {
        return {
          ...state,
          user: action.result.user
        }
      }
      return state;
    case Consts.LOGIN_FAILED:
    case Consts.LOGOUT_FAILED:
    case Consts.SESSION_FAILED:
    case Consts.SIGNUP_FAILED:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      }
    default:
      return state
  }
};

