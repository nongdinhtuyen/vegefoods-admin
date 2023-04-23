import BaseRequest from './BaseRequest';

const prefix = 'rank';
export default class RankRequest extends BaseRequest {
  getRank() {
    const url = `${prefix}`;
    return this.get(url);
  }
  updateRank(params) {
    const url = `${prefix}/${params.id}?discount=${params.discount}&total=${params.total}`;
    return this.post(url);
  }
}
