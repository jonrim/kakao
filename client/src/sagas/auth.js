import { delay } from 'redux-saga';
import { takeLatest, put, call, all } from 'redux-saga/effects';

import * as Api from 'Api/auth';
import * as Actions from 'Actions/auth';
import * as Consts from 'Constants/auth';
import { locationChange } from 'Actions/router';

function* requestLogin(action) {
  try {
    const result = yield call(Api.requestLogin, action.loginInfo);
    if (result.errorStatus) throw result;
    else {
      yield put(Actions.loginSuccess(result));
      // yield put(locationChange('/'));
    }
  } catch (error) {
    // yield call(delay, 2500);
    yield put(Actions.loginFailed(error));
  }
}

function* requestSignup(action) {
  try {
    const result = yield call(Api.requestSignup, action.signupInfo);
    if (result.errorStatus) throw result;
    else {
      yield put(Actions.signupSuccess(result));
      // yield put(locationChange('/'));
    }
  } catch (error) {
    // yield call(delay, 2500);
    yield put(Actions.signupFailed(error));
  }
}

function* requestSession(action) {
  try {
    const result = yield call(Api.requestSession);
    if (result.errorStatus) throw result;
    else {
      yield put(Actions.sessionSuccess(result));
    }
  } catch (error) {
    yield put(Actions.sessionFailed(error));
    // yield put(locationChange('/'));
  }
}

function* requestLogout(action) {
  try {
    const result = yield call(Api.requestLogout);
    if (result.errorStatus) throw result;
    else {
      yield put(Actions.logoutSuccess(result));
      // yield put(locationChange('/'));
    }
  } catch (error) {
    yield put(Actions.logoutFailed(result));
  }
}

export default function* watchAuth() {
  yield all([
    takeLatest(Consts.LOGIN_REQUEST, requestLogin),
    takeLatest(Consts.SIGNUP_REQUEST, requestSignup),
    takeLatest(Consts.SESSION_REQUEST, requestSession),
    takeLatest(Consts.LOGOUT_REQUEST, requestLogout)
  ]);
}