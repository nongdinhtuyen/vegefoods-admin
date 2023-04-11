import { openNotification } from 'common/Notify';
import { LOGOUT } from 'redux/actions/user';
import store from 'redux/store';

class BaseRequest {
  async get(url, params = {}) {
    try {
      const response = await window.axios.get(`${url}`, { params });
      return this._responseHandler(response);
    } catch (error) {
      this._errorHandler(error);
    }
  }
  async put(url, data = {}) {
    try {
      const response = await window.axios.put(`${url}`, data);
      return this._responseHandler(response);
    } catch (error) {
      this._errorHandler(error);
    }
  }

  async post(url, data = {}) {
    try {
      const response = await window.axios.post(`${url}`, data);
      return this._responseHandler(response);
    } catch (error) {
      this._errorHandler(error);
    }
  }

  async delete(url, params = {}) {
    try {
      const response = await window.axios.delete(`${url}`, { params });
      return this._responseHandler(response);
    } catch (error) {
      this._errorHandler(error);
    }
  }

  async _responseHandler(response) {
    const { code } = response.data;
    if (code >= 400) {
      openNotification({
        description: 'Request failed',
        type: 'error',
      });
      throw 'Request failed';
    }
    return response.data;
  }

  _errorHandler(err) {
    if (err.response && err.response.status === 401) {
      openNotification({
        description: 'Không có quyền',
        type: 'error',
      });
      store.dispatch({
        type: LOGOUT,
      });
    }
    throw err;
  }
}

export default BaseRequest;
