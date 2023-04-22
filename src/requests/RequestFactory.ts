import AccountRequest from './AccountRequest';
import ProductRequest from './ProductRequest';
import ProviderRequest from './ProviderRequest';
import RankRequest from './RankRequest';
import ReceiptRequest from './ReceiptRequest';
import WarehouseRequest from './WarehouseRequest';

const requestMap = {
  AccountRequest,
  ReceiptRequest,
  ProductRequest,
  ProviderRequest,
  RankRequest,
  WarehouseRequest,
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
