import { createAction } from '@reduxjs/toolkit';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const GET_USER_INFO = 'GET_USER_INFO';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_ADMIN_STATUS = 'UPDATE_ADMIN_STATUS';
export const GET_ACCOUNT = 'GET_ACCOUNT';
export const UPDATE_ADMIN_INFO = 'UPDATE_ADMIN_INFO';
export const GET_AUTH = 'GET_AUTH';
export const CREATE_ADMIN = 'CREATE_ADMIN';

export default {
  actionLogin: createAction<ActionPayloadStandard>(LOGIN),
  actionRegister: createAction<ActionPayloadStandard>(REGISTER),
  actionGetUserInfo: createAction<ActionPayloadStandard>(GET_USER_INFO),
  actionLogout: createAction<ActionPayloadStandard>(LOGOUT),
  actionUpdateProfile: createAction<ActionPayloadStandard>(UPDATE_PROFILE),
  actionGetAccount: createAction<ActionPayloadStandard>(GET_ACCOUNT),
  actionUpdateAdminStatus: createAction<ActionPayloadStandard>(UPDATE_ADMIN_STATUS),
  actionUpdateAdminInfo: createAction<ActionPayloadStandard>(UPDATE_ADMIN_INFO),
  actionGetAuth: createAction<ActionPayloadStandard>(GET_AUTH),
  actionCreateAdmin: createAction<ActionPayloadStandard>(CREATE_ADMIN),
};
