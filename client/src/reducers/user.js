import { push } from 'connected-react-router';
import { auth } from 'Api';
import * as Consts from 'Constants/user';

const initialState = {
  isFetchingMessage: false,
  isFetchingFriendList: false,
  error: null,
  friends: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Consts.FRIENDSLIST_REQUEST:
      return {
        ...state,
        isFetchingFriendList: true
      }
    case Consts.SENDMESSAGE_REQUEST:
    case Consts.RECEIVEMESSAGES_REQUEST:
    case Consts.READMESSAGES_REQUEST:
      return {
        ...state,
        isFetchingMessage: true
      }
    case Consts.FRIENDSLIST_SUCCESS:
      return {
        ...state,
        isFetchingFriendList: false,
        friends: action.result
      }
    case Consts.RECEIVEMESSAGES_SUCCESS:
      let friendsWithUpdatedChatHistories = action.result.map(friend => JSON.parse(friend));
      return {
        ...state,
        isFetchingMessage: false,
        friends: state.friends.map(friendInState => {
          // make sure same ID
          let friendInReceivedObject = friendsWithUpdatedChatHistories.find(f => f.email === friendInState.email);
          return {
            ...friendInState,
            chatHistory: friendInReceivedObject.chatHistory
          }
        })
      }
    case Consts.READMESSAGES_SUCCESS:
    case Consts.SENDMESSAGE_SUCCESS:
      let newChatHistory = JSON.parse(action.result);
      return {
        ...state,
        isFetchingMessage: false,
        friends: state.friends.map(friend => {
          if (friend.email === newChatHistory.email) {
            return {
              ...friend,
              chatHistory: newChatHistory.chatHistory
            };
          }
          return friend;
        })
      }
    case Consts.FRIENDSLIST_FAILED:
      return {
        ...state,
        isFetchingFriendList: false,
        error: action.error.message
      }
    case Consts.SENDMESSAGE_FAILED:
    case Consts.RECEIVEMESSAGES_FAILED:
    case Consts.READMESSAGES_FAILED:
      return {
        ...state,
        isFetchingMessage: false,
        error: action.error.message
      }
    default:
      return state
  }
};

