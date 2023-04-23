import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, InputNumber, List, message, Modal, Row, Select, Upload } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import actions from 'redux/actions/product';
import { useAppDispatch, useAppSelector } from 'redux/store';
import styled from 'styled-components';

import _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const UpdateProduct = ({ isOpen, close, getData, item }: any) => {
  const [_images, setImages] = useState({});
  const [_form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [_imageUrl, setImageUrl] = useState<string>();
  const [_loading, setLoading] = useState(false);
  const { productType } = useAppSelector((state) => state.productReducer);

  useEffect(() => {
    if (item.id && isOpen) {
      _form.setFieldsValue({
        ...item,
      });
      setImageUrl(item.img);
      dispatch(
        actions.actionGetProductImageById({
          params: {
            id: item.id,
          },
          callbacks: {
            onSuccess({ data }) {
              setImages(data);
              _form.setFieldsValue({
                imgs: _.map(data, (item) => ({
                  uid: item.id,
                  name: item.img,
                  url: utils.baseUrlImage(item.img),
                })),
              });
            },
          },
        })
      );
    }
  }, [item.id, isOpen]);

  const beforeUpload = (file) => {
    if (utils.isImage(file.name)) {
      return true;
    } else {
      message.error('Không hỗ trợ loại tệp này');
      return false;
    }
  };

  const selectImage = (options: any) => {
    utils.dumpRequest(options, (img) => {
      setLoading(false);
      setImageUrl(_.replace(img, 'img/', ''));
    });
  };

  const handleOk = () => {
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions.actionUpdateProductById({
            params: {
              id: item.id,
              ...values,
              img: _imageUrl,
              imgs: _.map(values.imgs, (item) => item.name),
            },
            callbacks: {
              onSuccess({ data }) {
                openNotification({
                  type: 'success',
                  description: 'Cập nhật sản phẩm thành công',
                });
                close();
                getData();
              },
            },
          })
        );
      })
      .catch(console.log);
  };

  return (
    <Modal className='top-10' width={640} onOk={handleOk} title='Chỉnh sửa sản phẩm' onCancel={close} open={isOpen}>
      <Form className='mt-4' {...layout} labelAlign='left' form={_form} name='control-hooks' style={{ maxWidth: 600 }}>
        <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Danh mục' name='idType' rules={[{ required: true }]}>
          <Select
            options={_.map(productType, (item: any) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>

        <Form.Item label='Giá bán' name='price' rules={[{ required: true }]}>
          <InputNumber
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter='VNĐ'
            parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
            min={0}
            className='w-full'
          />
        </Form.Item>

        <Form.Item label='Đơn vị tính' name='unit' rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Miêu tả' name='description'>
          <Input.TextArea />
        </Form.Item>
        <Form.Item getValueFromEvent={normFile} label='Upload ảnh chính' name='img' valuePropName='file' rules={[{ required: true }]}>
          <Upload
            customRequest={(file) => {
              setLoading(true);
              selectImage(file);
            }}
            beforeUpload={beforeUpload}
            name='main'
            showUploadList={false}
            headers={{
              'Content-Type': 'multipart/form-data',
            }}
            listType='picture-card'
          >
            {_imageUrl ? (
              <img src={utils.baseUrlImage(_imageUrl)} alt='avatar' style={{ width: '100%' }} />
            ) : (
              <div>
                {_loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item getValueFromEvent={normFile} label='Upload ảnh mô tả' name='imgs' valuePropName='fileList'>
          <Upload
            customRequest={selectImage}
            beforeUpload={beforeUpload}
            name='logo'
            headers={{
              'Content-Type': 'multipart/form-data',
            }}
            listType='picture'
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
