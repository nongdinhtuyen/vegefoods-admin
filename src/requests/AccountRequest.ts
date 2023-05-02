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
}
