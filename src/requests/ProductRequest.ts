import BaseRequest from './BaseRequest';

const prefix = 'product';
export default class ProductRequest extends BaseRequest {
  getProduct(params) {
    const url = `${prefix}?current=${params.current}&count=${params.count}`;
    return this.post(url, params.body);
  }

  getProductType(params) {
    const url = `${prefix}/product-type`;
    return this.get(url, params);
  }

  updateProductType(params) {
    const url = `${prefix}/product-type/${params.id}?name=${params.name}`;
    return this.put(url);
  }
}
