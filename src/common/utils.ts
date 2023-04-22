import { openNotification } from './Notify';
import axios, { ParamsSerializerOptions } from 'axios';
import BigNumber from 'bignumber.js';
import consts from 'consts';
import dayjs from 'dayjs';
import humanizeDuration from 'humanize-duration';
import { IStringifyOptions, parse, ParsedQs, stringify } from 'qs';

import _ from 'lodash';

// let timeoutID;

const getSession = (): string | undefined | any => localStorage.getItem(consts.SESSION);
const getSessionJSON = () => JSON.parse(getSession() || '{}');

const formatTimeFromUnix = (unixTime, format = 'DD/MM/YYYY', def = '--') => {
  if (unixTime === 0) {
    return def;
  }

  return dayjs.unix(parseInt(`${unixTime}`.substr(0, 10))).format(format);
};

const formatCurrencyWithDecimal = (currency, symbol = '--', precision = 8, decimal = 18) =>
  _.isNaN(currency) ? symbol : trimRightZeroAndDot(new BigNumber(currency).div(10 ** decimal).toFormat(precision));

const formatCurrency = (currency, decimal = 8) => {
  if (!isNumeric(decimal)) {
    decimal = 8;
  }

  return trimRightZeroAndDot(new BigNumber(currency).toFormat(decimal));
};
const trimRightZero = (num) => (`${num}`.split('.').length === 2 ? _.trimEnd(num, '0') : `${num}`);
const trimDot = (num) => _.trimEnd(`${num}`, '.');
const trimRightZeroAndDot = (num) => trimDot(trimRightZero(num));
function isNumeric(value) {
  return /^\d+$/.test(value);
}
const formatCurrencyWithDecimalFloor = (currency, symbol = '--', precision = 8, decimal = 18) =>
  _.isNaN(currency) ? symbol : trimRightZeroAndDot(new BigNumber(currency).div(10 ** decimal).toFormat(precision, BigNumber.ROUND_FLOOR));

const showNotification = openNotification;

const getDp = (num) => {
  const cloneNum = new BigNumber(num).toFixed();
  if (`${cloneNum}`.includes('.')) {
    return `${cloneNum}`.split('.')[1].length;
  }
  return 0;
};

const baseUrlImage = (img) => {
  // return `http://127.0.0.1:8089/raw/${img}`;
  return `http://192.168.0.103:8089/raw/${img}`
};

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

const imageSizeRequired = (file, value) => {
  const isLt = new BigNumber(file.size).div(1024).div(1024).isLessThan(value);
  return isLt;
};


const validateEmail = (email: string = ''): any => {
  return String(email)
    .toLowerCase()
    .match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );
};

const isImage = (filename) => {
  const ext = getExtension(filename);
  if (!ext) return false;
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
    case 'svg':
    case 'jpeg':
      return true;
  }
  return false;
};

const dumpRequest = ({ file, onSuccess }, callback) => {
  const formData = new FormData();
  formData.append('myFile', file);
  const customAxios = axios.create({
    // baseURL: 'https://upload.mediacloud.mobilelab.vn',
    baseURL: 'http://192.168.0.103:8089',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    paramsSerializer: {
      encode: (param: string): ParsedQs => parse(param),
      serialize: (params: Record<string, any>, options?: ParamsSerializerOptions | IStringifyOptions | any): string => stringify(params, options),
      indexes: false, // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
    },
  });

  customAxios.post('upload', formData).then((resp) => {
    if (_.isFunction(callback)) {
      callback(resp.data);
    }
  });
  onSuccess('ok');
};

export default {
  baseUrlImage,
  formatTimeFromUnix,
  formatCurrency,
  showNotification,
  getSession,
  getSessionJSON,
  isNumeric,
  trimDot,
  isImage,
  imageSizeRequired,
  dumpRequest,
  getDp,
  formatCurrencyWithDecimal,
  formatCurrencyWithDecimalFloor,
  validateEmail
};
