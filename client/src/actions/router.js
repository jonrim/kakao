import { push } from 'connected-react-router';

export const locationChange = path => {
  return (dispatch) => {
    dispatch(push(path));
  }
};