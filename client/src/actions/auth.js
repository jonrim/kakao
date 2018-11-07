import * as Consts from 'Constants/auth';

export const requestLogin = loginInfo => ({type: Consts.LOGIN_REQUEST, loginInfo});
export const loginSuccess = result => ({type: Consts.LOGIN_SUCCESS, result});
export const loginFailed = error => ({type: Consts.LOGIN_FAILED, error});

export const requestSignUp = signUpInfo => ({type: Consts.SIGN_UP_REQUEST, signUpInfo});
export const signUpSuccess = result => ({type: Consts.SIGN_UP_SUCCESS, result});
export const signUpFailed = error => ({type: Consts.SIGN_UP_FAILED, error});

export const requestSession = () => ({type: Consts.SESSION_REQUEST });
export const sessionSuccess = result => ({type: Consts.SESSION_SUCCESS, result});
export const sessionFailed = error => ({type: Consts.SESSION_FAILED, error});

export const requestLogout = () => ({ type: Consts.LOGOUT_REQUEST });
export const logoutSuccess = () => ({ type: Consts.LOGOUT_SUCCESS} );
export const logoutFailed = error => ({ type: Consts.LOGOUT_FAILED, error });