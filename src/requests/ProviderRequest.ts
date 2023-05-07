import BaseRequest from './BaseRequest';

const prefix = 'provider';
export default class ProviderRequest extends BaseRequest {
  getProvider(params) {
    const url = `${prefix}/list?current=${params.current}&count=${params.count}`;
    return this.post(url, params.body);
  }
  createProvider(params) {
    const url = `${prefix}`;
    return this.post(url, params);
  }
  updateProvider(params) {
    const url = `${prefix}/${params.id}`;
    return this.put(url, params);
  }
  deleteProvider(params) {
    const url = `${prefix}/${params.id}`;
    return this.delete(url);
  }
  addProductOfProvider(params) {
    const url = `${prefix}/product/${params.id}`;
    return this.post(url, params);
  }
  getProductOfProvider(params) {
    const url = `${prefix}/product/${params.id}`;
    return this.get(url, params);
  }
}
