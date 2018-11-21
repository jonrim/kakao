import { push } from 'connected-react-router';
import { auth } from 'Api';
import * as Consts from 'Constants/user';
import * as ConstsAuth from 'Constants/auth';

const initialState = {
  isFetchingMessage: false,
  isFetchingFriendList: false,
  isFetchingUser: false,
  isFetchingFriendRequest: false,
  errorMessage: null,
  errorFriendList: null,
  errorFindingUser: null,
  errorFriendRequest: null,
  foundUser: null,
  friends: [],
  chatHistory: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Consts.CHANGECHATROOM:
      return {
        ...state,
        chatroom: action.chatroomInfo,
        chatHistory: action.chatroomInfo && action.chatroomInfo.chatHistory || null
      }
    // clear out state.user on logout success
    case ConstsAuth.LOGOUT_SUCCESS:
      return {
      }
    case Consts.FRIENDSLIST_REQUEST:
      return {
        ...state,
        isFetchingFriendList: true,
        errorFriendList: null,
      }
    case Consts.SENDMESSAGE_REQUEST:
    case Consts.RECEIVEMESSAGES_REQUEST:
    case Consts.READMESSAGES_REQUEST:
      return {
        ...state,
        isFetchingMessage: true,
        errorMessage: null,
      }
    case Consts.FINDUSER_REQUEST:
      return {
        ...state,
        isFetchingUser: true,
        errorFindingUser: null
      }
    case Consts.FRIENDREQUEST_REQUEST:
      return {
        ...state,
        isFetchingFriendRequest: true,
        errorFriendRequest: null
      }
    case Consts.FRIENDSLIST_SUCCESS:
      return {
        ...state,
        isFetchingFriendList: false,
        friends: action.result
      }
    case Consts.RECEIVEMESSAGES_SUCCESS:
      let friend = JSON.parse(action.result);
      let friends = state.friends.map(friendInState => {
        // find the friend in 'friends', then return the newly updated friend
        if (friendInState.email === friend.email) return {...friendInState, ...friend};
        return friendInState;
      });
      return {
        ...state,
        isFetchingMessage: false,
        friends,
        chatHistory: friend.chatHistory,
        chatroom: {
          ...state.chatroom,
          chatHistory: friend.chatHistory
        }
      }
    case Consts.READMESSAGES_SUCCESS:
    case Consts.SENDMESSAGE_SUCCESS:
      var newChatroom = action.result;
      let updatedFriends = state.friends.map(friend => {
        if (friend.email === newChatroom.email) {
          return {
            ...friend,
            chatHistory: newChatroom.chatHistory
          };
        }
        return friend;
      });
      return {
        ...state,
        isFetchingMessage: false,
        friends: updatedFriends,
        chatHistory: newChatroom.chatHistory,
        chatroom: {
          ...state.chatroom,
          ...newChatroom
        }
      }
    case Consts.FINDUSER_SUCCESS:
      return {
        ...state,
        foundUser: action.result,
        isFetchingUser: false
      }
    case Consts.FRIENDREQUEST_SUCCESS:
      return {
        ...state,
        isFetchingFriendRequest: false
      }
    case Consts.FRIENDSLIST_FAILED:
      return {
        ...state,
        isFetchingFriendList: false,
        errorFriendList: action.error.message
      }
    case Consts.SENDMESSAGE_FAILED:
    case Consts.RECEIVEMESSAGES_FAILED:
    case Consts.READMESSAGES_FAILED:
      return {
        ...state,
        isFetchingMessage: false,
        errorMessage: action.error.message
      }
    case Consts.FINDUSER_FAILED:
      return {
        ...state,
        isFetchingUser: false,
        errorFindingUser: action.error.message
      }
    case Consts.FRIENDREQUEST_FAILED:
      return {
        ...state,
        isFetchingFriendRequest: false,
        errorFriendRequest: action.error.message
      }
    default:
      return state
  }
};

