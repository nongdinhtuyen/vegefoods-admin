import dayjs from 'dayjs';
import humanizeDuration from 'humanize-duration';

import _ from 'lodash';

import i18n from 'langs/i18n';

// let timeoutID;
const formatHumanizer = (
  time: number,
  options?: any // time ms
) =>
  humanizeDuration.humanizer({
    language: i18n.language,
    round: true,
    conjunction: ` ${i18n.t('common.and')} `,
    serialComma: false,
    units: ['d', 'h', 'm', 's'],
    ...options,
  })(time);

const getSession = (): string | undefined | any => localStorage.getItem('session');
const getSessionJSON = () => JSON.parse(getSession() || '{}');

const formatTimeFromUnix = (unixTime, format = 'DD/MM/YYYY', def = '--') => {
  if (unixTime === 0) {
    return def;
  }

  return dayjs.unix(parseInt(`${unixTime}`.substr(0, 10))).format(format);
};

export default {
  formatTimeFromUnix,
  getSession,
  getSessionJSON,
  formatHumanizer,
};
