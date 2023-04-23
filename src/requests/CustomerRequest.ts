import BaseRequest from './BaseRequest';

const prefix = 'customer';
export default class CustomerRequest extends BaseRequest {
  getCustomer(params) {
    const url = `${prefix}`;
    return this.get(url, params);
  }

  getCustomerStatics() {
    const url = `${prefix}/statics`;
    return this.get(url);
  }

  getCustomerAddress(params) {
    const url = `${prefix}/${params.id}`;
    return this.get(url);
  }

  updateCustomerStatus(params) {
    const url = `${prefix}/${params.id}?active=${params.active}`;
    return this.post(url);
  }
}
