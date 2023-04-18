import AccountRequest from './AccountRequest';
import ProductRequest from './ProductRequest';
import ReceiptRequest from './ReceiptRequest';

const requestMap = {
  AccountRequest,
  ReceiptRequest,
  ProductRequest,
};

const instances = {};

export default class RequestFactory {
  static getRequest(classname: string) {
    const RequestClass = requestMap[classname];
    if (!RequestClass) {
      throw new Error(`Invalid request class name: ${classname}`);
    }

    let requestInstance = instances[classname];
    if (!requestInstance) {
      requestInstance = new RequestClass();
      instances[classname] = requestInstance;
    }
    return requestInstance;
  }
}
