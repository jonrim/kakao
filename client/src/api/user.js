// make sure to encrypt this in future to prevent man in the middle attacks
import {
  postJSON,
  postText,
  putJSON,
  checkStatus,
  createOptions
} from 'Utils';

export const requestChangeInfo = (userInfo) => {
  return fetch(`/users/changeInfo`, createOptions(putJSON(userInfo))).then(checkStatus);
}

export const requestSendEmail = (formInfo) => {
  return fetch(`/users/formInfo`, createOptions(postJSON(formInfo))).then(checkStatus);
}

export const requestFriendsList = (userInfo) => {
  return fetch(`/users/friendsList`, createOptions(postJSON(userInfo))).then(checkStatus);
}

export const requestSendMessage = (messageInfo) => {
  return fetch(`/users/messageSend`, createOptions(putJSON(messageInfo))).then(checkStatus);
}

export const requestReceiveMessages = (messageInfo) => {
  return fetch(`/users/messageReceive`, createOptions(putJSON(messageInfo))).then(checkStatus);
}

export const requestReadMessages = (messageInfo) => {
  return fetch(`/users/messageRead`, createOptions(putJSON(messageInfo))).then(checkStatus);
}

export const requestFindUser = (userInfo) => {
  return fetch(`/users/findUser`, createOptions(postJSON(userInfo))).then(checkStatus);
}

export const requestFriendRequest = (userInfo) => {
  return fetch(`/users/friendRequest`, createOptions(putJSON(userInfo))).then(checkStatus);
}

export default {
  requestChangeInfo,
  requestSendEmail,
  requestFriendsList,
  requestSendMessage,
  requestReceiveMessages,
  requestReadMessages,
  requestFindUser,
  requestFriendRequest,
};