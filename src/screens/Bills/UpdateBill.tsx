import { Modal, Table } from 'antd';
import { openNotification } from 'common/Notify';
import utils from 'common/utils';
import CustomImage from 'components/CustomImage';
import { EditableCell, EditableRow } from 'components/EditContextCustom';
import consts, { DEFAULT_LARGE_PAGE_SIZE, DEFAULT_PAGE_SIZE, DEFAULT_SMALL_PAGE_SIZE } from 'consts';
import Icon from 'icon-icomoon';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import actions from 'redux/actions/receipt';
import { useAppDispatch } from 'redux/store';
import styled from 'styled-components';
import { useImmer } from 'use-immer';

import _ from 'lodash';

interface DataType {
  key: React.Key;
  id: React.Key;
  name: string;
  img: string;
  quantity: number;
}

export default function UpdateBill({ isOpen, close, id, updateItem, getData }) {
  const dispatch = useAppDispatch();
  const [_dataSource, setDataSource] = useState<DataType[]>([]);
  const [_error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const newData = _.map(updateItem, (item) => ({
        id: item.idProduct,
        key: item.idProduct,
        quantity: item.quantity,
        name: item.productList.name,
        img: item.productList.img,
      }));
      setDataSource(newData);
    }
  }, [isOpen]);

  const handleSave = (row: DataType) => {
    const newData = [..._dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const oldItem: any = _.find(updateItem, (item: any) => row.key === item.idProduct);
    const item = newData[index];
    if (row.quantity > oldItem.productList.remain) {
      setError(true);
      openNotification({
        type: 'error',
        description: `Số lượng ${item.name} nhập lớn hơn số lượng sản phẩm khả dụng`,
      });
    } else {
      setError(false);
      newData.splice(index, 1, {
        ...item,
        ...{ ...row },
      });
      setDataSource(newData);
    }
  };

  const handleDelete = (key: React.Key) => {
    const newData = _dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      align: 'center',
    },
    {
      width: '10%',
      align: 'center',
      title: 'Hình ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <CustomImage width={60} src={utils.baseUrlImage(img)} />,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '10%',
      align: 'center',
    },
    {
      align: 'center',
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '10%',
      editable: true,
      render: utils.formatCurrency,
    },
    {
      align: 'center',
      width: '10%',
      title: 'Hành động',
      dataIndex: 'id',
      render: (id) => <Icon title='Xóa sản phẩm' size={20} className='cursor-pointer' onClick={() => handleDelete(id)} icon={'delete'} />,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleOk = () => {
    if (!_error) {
      dispatch(
        actions.actionUpdateReceipt({
          params: {
            id,
            body: {
              infoCart: _.reduce(
                _dataSource,
                (obj, item) => {
                  obj[item.id] = item.quantity;
                  return obj;
                },
                {}
              ),
            },
          },
          callbacks: {
            onSuccess(data) {
              close();
              getData();
              openNotification({
                description: 'Sửa đơn hàng thành công',
                type: 'success',
              });
            },
          },
        })
      );
    }
  };

  const handleCancel = () => {
    close();
    setDataSource([]);
  };

  return (
    <Modal width={880} title={'Sửa hóa đơn'} open={isOpen} onOk={handleOk} onCancel={handleCancel} className='top-10'>
      <Table
        bordered
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowKey={'id'}
        className='editable-row'
        dataSource={_dataSource}
        columns={columns}
        pagination={{
          pageSize: DEFAULT_SMALL_PAGE_SIZE,
          hideOnSinglePage: true,
        }}
      />
    </Modal>
  );
}
