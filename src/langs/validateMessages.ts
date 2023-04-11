import type { ValidateMessages } from 'rc-field-form/lib/interface';

import i18n from './i18n';

const { t }: any = i18n;

const formValidate: ValidateMessages = {
  required: t('validate.field_can_not_be_empty', { field: '${label}' }),
};
export default formValidate;
