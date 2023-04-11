const consts = {
  FORMAT_DATE: 'DD/MM/YYYY HH:mm',
  FORM_LAYOUT: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  SESSION: 'session',

  DEV: 'development',
  PROD: 'production',
  STAGING: 'staging',
};

export default consts;

export const WAIT_TIME_DEBOUNCE = 300;

export const DEFAULT_PAGE_COUNT = 50;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SMALL_PAGE_SIZE = 5;
/**
 * Map user's id to color
 */

export const NOTIFICATION_TYPE: {
  TYPE_ERROR: 'error';
  TYPE_WARNING: 'warning';
  TYPE_SUCCESS: 'success';
  TYPE_INFO: 'info';
} = {
  TYPE_ERROR: 'error',
  TYPE_WARNING: 'warning',
  TYPE_SUCCESS: 'success',
  TYPE_INFO: 'info',
};

export const PREFIX_FRONT_URL = '';
