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
  if (!utils.isImage(e.file.name)) {
    return [];
  }
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

type Props = {
  isOpen: boolean;
  isCreate: boolean;
  close: () => void;
  getData: () => void;
  item?: any;
};

const UpdateProduct = ({ isOpen, close, getData, item, isCreate }: Props) => {
  const [_form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [_imageUrl, setImageUrl] = useState<string>();
  const [_loading, setLoading] = useState(false);
  const { productType } = useAppSelector((state) => state.productReducer);
  const [_listImages, setListImages] = useState<{ uid: string; img: string }[]>([]);

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
              setListImages(
                _.map(data, (item) => ({
                  uid: item.id,
                  img: item.img,
                }))
              );
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

  const selectImageList = (options: any) => {
    utils.dumpRequest(options, (img) => {
      setLoading(false);
      setListImages((data) => [...data, { uid: options.file.uid, img: _.replace(img, 'img/', '') }]);
    });
  };

  const handleRemoveImage = (file) => {
    const newData = _.filter(_listImages, (item: any) => item.uid !== file.uid);
    setListImages(newData);
  };

  const handleOk = () => {
    const action = isCreate ? 'actionCreateProduct' : 'actionUpdateProductById';
    _form
      .validateFields()
      .then((values) => {
        dispatch(
          actions[action]({
            params: {
              id: item.id,
              ...values,
              img: _imageUrl,
              imgs: _.map(_listImages, (item) => item.img),
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

  const handleClose = () => {
    close();
    setListImages([]);
    _form.resetFields();
  };

  return (
    <Modal
      className='top-7'
      width={640}
      onOk={handleOk}
      title={isCreate ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}
      onCancel={handleClose}
      open={isOpen}
    >
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

        <Form.Item label='Số lượng còn lại' name='remain' rules={[{ required: true }]}>
          <InputNumber
            controls={false}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
            customRequest={selectImageList}
            beforeUpload={beforeUpload}
            name='logo'
            headers={{
              'Content-Type': 'multipart/form-data',
            }}
            onRemove={handleRemoveImage}
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
