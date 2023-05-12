const consts = {
  FORMAT_DATE: 'DD/MM/YYYY HH:mm',
  FORM_LAYOUT: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  SESSION: 'sessionAdmin',

  DEV: 'development',
  PROD: 'production',
  STAGING: 'staging',

  TYPE_PAYMENT_ONLINE: 0,
  TYPE_PAYMENT_COD: 1,

  PRODUCT_STATUS: {
    WAITING_FOR_APPROVAL: 0,
    APPROVED: 1,
    WAITING_FOR_DELIVERY: 2,
    DELIVERING: 3,
    DELIVERY_SUCCESSFUL: 4,
    WAITING_FOR_APPROVAL_TO_CANCEL: 5,
    CANCELED: 6,
  },

  PRODUCT_STATUS_STRING: {
    0: 'Chờ phê duyệt',
    1: 'Đã phê duyệt',
    2: 'Chờ vận chuyển',
    3: 'Đang giao hàng',
    4: 'Giao hàng thành công',
    5: 'Chờ duyệt hủy',
    6: 'Đã hủy',
  },

  PRODUCT_STATUS_STRING_ONLINE: {
    0: 'Chờ thanh toán',
    1: 'Đã thanh toán',
    2: 'Chờ vận chuyển',
    3: 'Đang giao hàng',
    4: 'Giao hàng thành công',
    5: 'Chờ duyệt hủy',
    6: 'Đã hủy',
  },

  WAREHOUSE_STATUS: {
    0: 'Chưa thanh toán',
    1: 'Đã thanh toán',
  },

  gender: {
    0: 'Nam',
    1: 'Nữ',
    2: 'Khác',
  },

  role: {
    0: 'Super Admin',
    1: 'Bộ phận Tiếp nhận đơn hàng',
    2: 'Bộ phận Tài chính kế toán',
    3: 'Bộ phận xuất nhập kho',
  },
};

export default consts;

export const WAIT_TIME_DEBOUNCE = 300;

export const DEFAULT_PAGE_COUNT = 50;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_LARGE_PAGE_SIZE = 20;
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
