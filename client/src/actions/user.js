import * as Consts from 'Constants/user';

export const requestChangeInfo = userInfo => ({type: Consts.CHANGEINFO_REQUEST, userInfo});
export const changeInfoSuccess = result => ({type: Consts.CHANGEINFO_SUCCESS, result});
export const changeInfoFailed = error => ({type: Consts.CHANGEINFO_FAILED, error});

export const requestSendEmail = formInfo => ({type: Consts.SENDEMAIL_REQUEST, formInfo});
export const sendEmailSuccess = result => ({type: Consts.SENDEMAIL_SUCCESS, result});
export const sendEmailFailed = error => ({type: Consts.SENDEMAIL_FAILED, error});

export const requestFriendsList = userInfo => ({type: Consts.FRIENDSLIST_REQUEST, userInfo});
export const friendsListSuccess = result => ({type: Consts.FRIENDSLIST_SUCCESS, result});
export const friendsListFailed = error => ({type: Consts.FRIENDSLIST_FAILED, error});

export const requestSendMessage = messageInfo => ({type: Consts.SENDMESSAGE_REQUEST, messageInfo});
export const sendMessageSuccess = result => ({type: Consts.SENDMESSAGE_SUCCESS, result});
export const sendMessageFailed = error => ({type: Consts.SENDMESSAGE_FAILED, error});