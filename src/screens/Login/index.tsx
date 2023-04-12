import actions from '../../redux/actions/account';
import { Button, Divider, Form, Input } from 'antd';
import Background from 'public/background_login.jpg';
import { HiOutlineMail } from 'react-icons/hi';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const layout = {
  wrapperCol: {
    span: 24,
  },
};

const LoginWrapper = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  background-position: center;
  display: flex;
  align-items: center;
  background-image: url('/background_login.jpg');
`;

export default function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (value) => {
    dispatch(
      actions.actionLogin({
        params: {
          ...value,
        },
        callbacks: {
          onSuccess({ data }) {
            // fetchInfo(data.id);
          },
        },
      })
    );
  };

  const fetchInfo = (id) => {
    dispatch(
      actions.actionGetUserInfo({
        params: id,
        callbacks: {
          onSuccess(data) {
            navigate('/');
          },
        },
      })
    );
  };

  return (
    <LoginWrapper>
      <div className='w-modal m-auto p-12 rounded-3xl bg-[#ffffffe0] text-center'>
        <div className='text-3xl mb-12 text-zinc-800 font-bold'>Đăng nhập</div>
        <Form
          size='large'
          {...layout}
          name='basic'
          onFinish={onFinish}
          className='m-auto'
          layout='vertical'
          initialValues={{
            pass: '123456',
            username: 'lanln',
          }}
        >
          <Form.Item
            name='username'
            rules={[
              {
                required: true,
                message: 'Tài khoản không được bỏ trống',
              },
            ]}
          >
            <Input placeholder='Tài khoản' />
          </Form.Item>

          <Form.Item
            name='pass'
            rules={[
              {
                required: true,
                message: 'Mât khẩu không được bỏ trống',
              },
            ]}
          >
            <Input.Password placeholder='Mật khẩu' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' className='w-full' htmlType='submit' size='large'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LoginWrapper>
  );
}
