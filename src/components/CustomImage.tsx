import { Image, Space } from 'antd';
import React from 'react';
import { EyeOutlined } from '@ant-design/icons';

export default function CustomImage(props) {
  return (
    <Image
      preview={false}
      // preview={{
      //   mask: (
      //     <Space>
      //       <EyeOutlined />
      //       Xem trước
      //     </Space>
      //   ),
      // }}
      {...props}
    />
  );
}
