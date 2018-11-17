import 'whatwg-fetch';
import {
  postJSON,
  checkStatus,
  createOptions
} from 'Utils';

export const requestSession = () => {
  return fetch(`/auth/session`, createOptions()).then(checkStatus);
}

export const requestLogin = (credentials) => {
  return fetch(`/auth/login`, createOptions(postJSON(credentials))).then(checkStatus);
}

export const requestLogout = () => {
  return fetch(`/auth/logout`, createOptions()).then(checkStatus);
}

export const requestSignup = (credentials) => {
  return fetch(`/auth/signup`, createOptions(postJSON(credentials))).then(checkStatus);
}

export default {
  requestSession,
  requestLogin,
  requestLogout,
  requestSignup
};

