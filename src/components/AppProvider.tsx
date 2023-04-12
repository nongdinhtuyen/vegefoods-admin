import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import 'common/extend_dayjs';
import NeedInitComponent from 'components/NeedInitComponent';
import validateMessages from 'langs/validateMessages';

export default function AppProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          colorPrimary: '#82ae46',
        },
      }}
      locale={viVN}
      form={{ validateMessages }}
    >
      <NeedInitComponent>{children}</NeedInitComponent>
    </ConfigProvider>
  );
}
