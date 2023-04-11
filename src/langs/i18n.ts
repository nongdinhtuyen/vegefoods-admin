import en from './en';
import vi from './vi';
import enUS from 'antd/lib/locale/en_US';
import viVN from 'antd/lib/locale/vi_VN';
import consts from 'constants/consts';
import dayjs from 'dayjs';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import _ from 'lodash';

const LANGUAGES = {
  vi: viVN,
  en: enUS,
};
export const defaultLanguage = () => {
  const localLanguage = localStorage.getItem(consts.LANG);
  if (_.isString(localLanguage)) {
    if (_.includes(_.keys(LANGUAGES), localLanguage.toLowerCase())) {
      return localLanguage;
    }
  }
  localStorage.setItem(consts.LANG, consts.VI);
  return consts.VI;
};

export const resources = {
  en,
  vi,
};

dayjs.locale(defaultLanguage());

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: defaultLanguage(),
  // debug: true,

  // have a common namespace used around the full app

  interpolation: {
    escapeValue: false,
  },
  backend: {
    allowMultiLoading: false,
  },
  ns: ['default'],
  defaultNS: 'default',
});

export default i18n;
