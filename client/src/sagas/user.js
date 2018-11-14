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

function* requestFriendsList(action) {
  try {
    const result = yield call(Api.requestFriendsList, action.userInfo);
    yield put(Actions.friendsListSuccess(result));
  } catch (error) {
    yield put(Actions.friendsListFailed(error));
  }
}

function* requestSendMessage(action) {
  try {
    const result = yield call(Api.requestSendMessage, action.messageInfo);
    yield put(Actions.sendMessageSuccess(result));
  } catch (error) {
    yield put(Actions.sendMessageFailed(error));
  }
}

function* requestReceiveMessages(action) {
  try {
    const result = yield call(Api.requestReceiveMessages, action.messageInfo);
    yield put(Actions.receiveMessagesSuccess(result));
  } catch (error) {
    yield put(Actions.receiveMessagesFailed(error));
  }
}

function* requestReadMessages(action) {
  try {
    const result = yield call(Api.requestReadMessages, action.messageInfo);
    yield put(Actions.readMessagesSuccess(result));
  } catch (error) {
    yield put(Actions.readMessagesFailed(error));
  }
}

export default function* watchUser() {
  yield all([
    takeLatest(Consts.CHANGEINFO_REQUEST, requestChangeInfo),
    takeLatest(Consts.SENDEMAIL_REQUEST, requestSendEmail),
    takeLatest(Consts.FRIENDSLIST_REQUEST, requestFriendsList),
    takeLatest(Consts.SENDMESSAGE_REQUEST, requestSendMessage),
    takeLatest(Consts.RECEIVEMESSAGES_REQUEST, requestReceiveMessages),
    takeLatest(Consts.READMESSAGES_REQUEST, requestReadMessages),
  ]);
}