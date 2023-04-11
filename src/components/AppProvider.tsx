import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import viVN from 'antd/lib/locale/vi_VN';
import 'common/extend_dayjs';
import utils from 'common/utils';
import NeedInitComponent from 'components/NeedInitComponent';
import consts from 'constants/consts';
import validateMessages from 'langs/validateMessages';

const LANGUAGES = {
  vi: viVN,
  en: enUS,
};

export default function AppProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
      }}
      locale={LANGUAGES['vi']}
      form={{ validateMessages }}
    >
      <NeedInitComponent>{children}</NeedInitComponent>
    </ConfigProvider>
  );
}
