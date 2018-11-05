import 'whatwg-fetch';
import {
  postJSON,
  checkStatus,
  createOptions
} from '../../utils';

export const fetchSession = () => {
  return fetch(`/session`, createOptions()).then(checkStatus);
}

export const tryLogin = (credentials) => {
  return fetch(`/login`, createOptions(postJSON(credentials))).then(checkStatus);
}

export const tryLogout = () => {
  return fetch(`/logout`, createOptions()).then(checkStatus);
}

export default {
  fetchSession,
  tryLogin,
  tryLogout
};

