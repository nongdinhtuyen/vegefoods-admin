import { createAction } from '@reduxjs/toolkit';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const GET_USER_INFO = 'GET_USER_INFO';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export default {
  actionLogin: createAction<ActionPayloadStandard>(LOGIN),
  actionRegister: createAction<ActionPayloadStandard>(REGISTER),
  actionGetUserInfo: createAction<ActionPayloadStandard>(GET_USER_INFO),
  actionLogout: createAction<ActionPayloadStandard>(LOGOUT),
  actionUpdateProfile: createAction<ActionPayloadStandard>(UPDATE_PROFILE),
};
