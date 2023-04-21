import BaseRequest from './BaseRequest';

const prefix = 'provider';
export default class ProviderRequest extends BaseRequest {
  getProvider(params) {
    const url = `${prefix}`;
    return this.get(url, params);
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
}
