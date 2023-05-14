import BaseRequest from './BaseRequest';

const prefix = 'account';
export default class AccountRequest extends BaseRequest {
  login(params) {
    const url = `${prefix}/login`;
    return this.post(url, params);
  }
  getAccount(params) {
    const url = `${prefix}`;
    return this.get(url, params);
  }
  getAuth(params) {
    const url = `${prefix}/auth`;
    return this.get(url);
  }
  createAdmin(params) {
    const url = `${prefix}`;
    return this.post(url, params);
  }
  updateAdminInfo(params) {
    const url = `${prefix}/${params.id}`;
    return this.put(url, params);
  }
  updateAdminStatus(params) {
    const url = `${prefix}/${params.id}/status?status=${params.status}`;
    return this.put(url);
  }
  getAdminById(params) {
    const url = `${prefix}/${params.id}`;
    return this.get(url);
  }
  addRoleForAdmin(params) {
    const url = `${prefix}/${params.id}/role`;
    return this.post(url, params);
  }
  changePass(params) {
    const url = `${prefix}/${params.id}/change-pass`;
    return this.post(url, params);
  }
}
