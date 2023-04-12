import dayjs from 'dayjs';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { openNotification } from './Notify';
import axios, { ParamsSerializerOptions } from 'axios';
import { parse, stringify, ParsedQs, IStringifyOptions } from 'qs';
import humanizeDuration from 'humanize-duration';
import consts from 'consts';

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
  return `http://127.0.0.1:8089/raw/${img}`
  // return `http://192.168.68.106:8089/raw/${img}`
}

export default {
  baseUrlImage,
  formatTimeFromUnix,
  formatCurrency,
  showNotification,
  getSession,
  getSessionJSON,
  isNumeric,
  trimDot,
  getDp,
  formatCurrencyWithDecimal,
  formatCurrencyWithDecimalFloor,
};
