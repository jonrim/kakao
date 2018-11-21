import L from 'react-loadable';
import Spinner from 'react-loader-spinner';

export function postJSON(body) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  };
}

export function postImage(body) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png'
    },
    body: body,
  };
}

export function postVideo(body) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'video/mp4'
    },
    body: body,
  };
}

export function putJSON(body) {
  return {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  };
}

export function checkStatus(response) {
  return response.json()
  .then(result => {
    if (result.error_code) {
      const error = new Error(result.message);
      error.error_code = result.error_code
      throw error;
    }
    return result;
  });
}

export const createOptions = customOptions => ({
  method: 'GET',
  credentials: 'include',
  ...customOptions
});

export function Loadable(opts) {
  L({
    loading: Spinner,
    ...opts
  });
}