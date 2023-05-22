import axios, { AxiosInstance, ParamsSerializerOptions } from 'axios';
// import locale
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { IStringifyOptions, parse, ParsedQs, stringify } from 'qs';

dayjs.locale('vi'); // use locale

// export const BASEURL = 'http://172.20.10.3:4869/v1/orderfood/admin';
// export const BASEURL_IMG = 'http://172.20.10.3:8089';
export const BASEURL = 'http://192.168.0.106:4869/v1/orderfood/admin';
export const BASEURL_IMG = 'http://192.168.0.106:8089';

window.axios = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    encode: (param: string): ParsedQs => parse(param),
    serialize: (params: Record<string, any>, options?: ParamsSerializerOptions | IStringifyOptions | any): string => stringify(params, options),
    indexes: false, // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
  },
});
