import React from 'react'
import {Form, Input, Button, message} from 'antd';
import request from './utils/axios'

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const Login = (props) => {
  const onFinish = (values) => {
    request.post('/login', values).then(res => {
      if(res && res.code === 0){
        localStorage.setItem('username', values.username)
        props.history.push('/home')
      }else{
        message.error(res.msg)
      }
    })
  }

  return <div className="loginWrapper" style={{borderRadius: 5, background: '#f8f8f8', padding: 25, margin: 'auto', boxShadow: '0 0 15px rgba(0,0,0, .1)', marginTop:30, border: '1px solid #e1e1e1'}}>
    <h2 style={{textAlign: 'center', marginBottom: 15}}>这不是一个聊天室</h2>
    <Form
      {...layout}
      name="basic"
      initialValues={{remember: true}}
      onFinish={onFinish}
    >
      <Form.Item
        label="账号"
        name="username"
        rules={[{
          required: true,
          message: '请输入账号!'
        }
      ]}>
        <Input/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{
          required: true,
          message: '请输入密码!'
        }
      ]}>
        <Input.Password/>
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{width: '100%'}}>
          登录
      </Button>
  </Form>
  </div>
}

export default Login