import { auth } from 'Api';
import * as Consts from 'Constants/user';
import * as ConstsAuth from 'Constants/auth';

const initialState = {
  pendingFriendRequests: [],
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
    case Consts.VIEWUSERPROFILE:
      return {
        ...state,
        profile: action.profileInfo
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
    case Consts.CHANGEINFO_REQUEST:
      return {
        ...state,
        isFetchingChangeInfo: true,
        errorChangeInfo: null,
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
    case Consts.PENDINGFRIENDREQUESTS_REQUEST:
      return {
        ...state,
        isFetchingPendingFriendRequests: true,
        errorPendingFriendRequests: null
      }
    case Consts.MANAGEFRIENDREQUEST_REQUEST:
      return {
        ...state,
        isFetchingManageFriendRequest: true,
        errorManageFriendRequest: null
      }
    case Consts.FRIENDSLIST_SUCCESS:
      return {
        ...state,
        isFetchingFriendList: false,
        friends: action.result
      }
    case Consts.CHANGEINFO_SUCCESS:
      if (action.result.favorite) {
        return {
          ...state,
          isFetchingChangeInfo: false,
          friends: action.result.friends,
          profile: state.profile && {
            ...state.profile,
            favorite: action.result.favorite === 'add'
          }
        }
      }
      if (action.result.newFriendName) {
        return {
          ...state,
          isFetchingChangeInfo: false,
          friends: action.result.friends,
          profile: state.profile && {
            ...state.profile,
            tempName: action.result.newFriendName
          }
        }
      }
      if (action.result.changedMyInfo) {
        return {
          ...state,
          isFetchingChangeInfo: false,
          profile: state.profile && {
            ...state.profile,
            ...action.result.user
          }
        }
      }
      return {
        ...state,
        isFetchingChangeInfo: false,
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
        chatHistory: state.chatroom ? friend.chatHistory : null,
        chatroom: state.chatroom ? {
          ...state.chatroom,
          chatHistory: friend.chatHistory
        } : null
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
    case Consts.PENDINGFRIENDREQUESTS_SUCCESS:
      return {
        ...state,
        isFetchingPendingFriendRequests: false,
        pendingFriendRequests: action.result.map(pendingFriend => JSON.parse(pendingFriend))
      }
    case Consts.MANAGEFRIENDREQUEST_SUCCESS:
      return {
        ...state,
        isFetchingManageFriendRequest: false,
        pendingFriendRequests: action.result.friendRequests.map(pendingFriend => JSON.parse(pendingFriend)),
        friends: action.result.friends
      }
    case Consts.FRIENDSLIST_FAILED:
      return {
        ...state,
        isFetchingFriendList: false,
        errorFriendList: action.error.message
      }
    case Consts.CHANGEINFO_FAILED:
      return {
        ...state,
        isFetchingChangeInfo: false,
        errorChangeInfo: action.error.message
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
    case Consts.PENDINGFRIENDREQUESTS_FAILED:
      return {
        ...state,
        isFetchingPendingFriendRequests: false,
        errorPendingFriendRequests: action.error.message
      }
    case Consts.MANAGEFRIENDREQUEST_FAILED:
      return {
        ...state,
        isFetchingManageFriendRequest: false,
        errorManageFriendRequest: action.error.message
      }
    default:
      return state
  }
};

