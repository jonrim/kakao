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

export const requestSignUp = (signUpInfo) => {
  return fetch(`/auth/signup`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(signUpInfo)
  })
  .then(res => res.json())
  .then(checkStatus);
}

export default {
  requestSession,
  requestLogin,
  requestLogout,
  requestSignUp
};

