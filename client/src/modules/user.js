import { push } from 'connected-react-router';
import { auth } from 'Api';
import * as Consts from 'Constants/user';

const initialState = {
  isFetching: false,
  error: null,
  friends: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Consts.FRIENDSLIST_REQUEST:
    case Consts.FRIENDSLIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        friends: action.result
      }
    case Consts.FRIENDSLIST_FAILED:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      }
    default:
      return state
  }
};

