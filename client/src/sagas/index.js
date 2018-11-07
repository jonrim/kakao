import watchAuth from './auth';
import watchUser from './user';
import { all } from 'redux-saga/effects';

export default function* mainSaga() {
  yield all([
    watchAuth(),
    watchUser()
  ])
}