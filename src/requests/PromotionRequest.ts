import BaseRequest from './BaseRequest';

const prefix = 'promotion';
export default class PromotionRequest extends BaseRequest {
  getPromotion(params) {
    const url = `${prefix}`;
    return this.get(url, params);
  }
  updatePromotion(params) {
    const url = `${prefix}/${params.id}`;
    return this.put(url, params);
  }
  createPromotion(params) {
    const url = `${prefix}`;
    return this.post(url, params);
  }
}
