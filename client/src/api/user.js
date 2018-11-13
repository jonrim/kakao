// make sure to encrypt this in future to prevent man in the middle attacks
import {
  postJSON,
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
  return fetch(`/users/message`, createOptions(putJSON(messageInfo))).then(checkStatus);
}

export default {
  requestChangeInfo,
  requestSendEmail,
  requestFriendsList,
  requestSendMessage,
};