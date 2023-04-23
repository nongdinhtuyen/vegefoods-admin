import BaseRequest from './BaseRequest';

const prefix = 'product';
export default class ProductRequest extends BaseRequest {
  getProduct(params) {
    const url = `${prefix}/list?current=${params.current}&count=${params.count}`;
    return this.post(url, params.body);
  }
  createProduct(params) {
    const url = `${prefix}`;
    delete params.id;
    return this.post(url, params);
  }
  createProductType(params) {
    const url = `${prefix}/product-type`;
    delete params.id;
    return this.post(url, params);
  }

  getProductType(params) {
    const url = `${prefix}/product-type`;
    return this.get(url, params);
  }

  updateProductType(params) {
    const url = `${prefix}/product-type/${params.id}?name=${params.name}`;
    return this.put(url);
  }

  getProductById(params) {
    const url = `${prefix}/${params.id}`;
    return this.get(url);
  }

  updateProductById(params) {
    const url = `${prefix}/${params.id}`;
    return this.put(url, params);
  }

  getProductImageById(params) {
    const url = `${prefix}/${params.id}/image`;
    return this.get(url);
  }
}
