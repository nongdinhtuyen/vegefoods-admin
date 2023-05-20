import { openNotification } from 'common/Notify';
import { LOGOUT } from 'redux/actions/account';
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
    const { status, data } = response;
    if (data.code >= 400) {
      this._errorHandler(data);
    }
    if (status >= 400) {
      openNotification({
        description: 'Request failed',
        type: 'error',
      });
      return;
    }
    return response.data;
  }

  _errorHandler(err) {
    if (err && err.code === 404 && err.msg === 'WrongPassOrAccount') {
      openNotification({
        description: 'Sai tài khoản hoặc mật khẩu',
        type: 'error',
      });
    } else {
      openNotification({
        description: 'Bạn không có quyền truy cập',
        type: 'error',
      });
      store.dispatch({
        type: LOGOUT,
      });
      window.navigate('/login');
    }
    throw err;
  }
}

export default BaseRequest;
