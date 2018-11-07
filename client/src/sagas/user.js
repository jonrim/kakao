import { takeLatest, put, call, all } from 'redux-saga/effects';

import * as Api from 'Api/user';
import * as Actions from 'Actions/user';
import * as Consts from 'Constants/user';

function* requestChangeInfo(action) {
  try {
    const result = yield call(Api.requestChangeInfo, action.userInfo);
    yield put(Actions.changeInfoSuccess(result));
  } catch (error) {
    yield put(Actions.changeInfoFailed(error));
  }
}

function* requestSendEmail(action) {
	try {
    const result = yield call(Api.requestSendEmail, action.formInfo);
    yield put(Actions.sendEmailSuccess(result));
  } catch (error) {
    yield put(Actions.sendEmailFailed(error));
  }
}

export default function* watchUser() {
  yield all([
    takeLatest(Consts.CHANGEINFO_REQUEST, requestChangeInfo),
    takeLatest(Consts.SENDEMAIL_REQUEST, requestSendEmail)
  ]);
}