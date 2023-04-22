import { EyeOutlined } from '@ant-design/icons';
import { Image, Space } from 'antd';
import type { ImageProps } from 'antd';
import { CompositionImage } from 'antd/es/image';
import React from 'react';

import classNames from 'classnames';

const CustomImage = (props: ImageProps) => {
  return (
    <Image
      preview={{
        mask: (
          <Space>
            <EyeOutlined />
            Xem trước
          </Space>
        ),
      }}
      {...props}
      className={classNames(props.className, 'object-contain')}
    />
  );
};

export default CustomImage;
