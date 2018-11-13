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
    case Consts.SENDMESSAGE_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case Consts.FRIENDSLIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        friends: action.result
      }
    case Consts.SENDMESSAGE_SUCCESS:
      let newChatHistory = JSON.parse(action.result);
      return {
        ...state,
        isFetching: false,
        friends: state.friends.map(friend => {
          if (friend.id === newChatHistory.id) {
            return {
              ...friend,
              chatHistory: newChatHistory.chatHistory
            };
          }
          return friend;
        })
      }
    case Consts.FRIENDSLIST_FAILED:
    case Consts.SENDMESSAGE_FAILED:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      }
    default:
      return state
  }
};

