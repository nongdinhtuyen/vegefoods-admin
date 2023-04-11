import { notification } from 'antd';
import { ReactNode } from 'react';

import './styles.scss';
import i18n from 'langs/i18n';

export type INotificationMethodType = 'success' | 'info' | 'warning' | 'error';

type Props = {
  description?: ReactNode | any;
  type?: INotificationMethodType;
};

export const openNotification = ({ description = 'description', type = 'info' }: Props) => {
  notification[type]({
    message: '',
    description,
    className: 'custom_open_notify',
  });
};
