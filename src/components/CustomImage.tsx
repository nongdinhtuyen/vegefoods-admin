import { EyeOutlined } from '@ant-design/icons';
import { Image, Space } from 'antd';
import React from 'react';

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
