import BaseRequest from './BaseRequest';

const prefix = 'receipt';
export default class ReceiptRequest extends BaseRequest {
  getReceipt(params) {
    const url = `${prefix}`;
    return this.get(url, params);
  }

  receiptFinancial(params) {
    const url = `${prefix}/financial`;
    return this.post(url, params);
  }

  receiptOrder(params) {
    const url = `${prefix}/order`;
    return this.post(url, params);
  }

  receiptWarehouse(params) {
    const url = `${prefix}/warehouse`;
    return this.post(url, params);
  }

  updateReceipt(params) {
    const url = `${prefix}/order/${params.id}`;
    return this.post(url, params.body);
  }
}
