import React from 'react'
import {Form, Input, Button, message} from 'antd';
import {Link} from 'react-router-dom'
import request from '../utils/axios'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const Register = (props) => {
  const onFinish = (values) => {
    if(values.password !== values.repassword){
      message.error('两次密码输入不一致, 请核对')
      return
    }
    request.post('/register', values).then(res => {
      if(res && res.code === 0){
        message.success('注册成功, 请登录')
        props.history.push('/')
      }else{
        message.error(res.msg)
      }
    })
  }

  return <div className="loginWrapper">
    <h2 style={{textAlign: 'center', marginBottom: 25}}>欢迎注册这个聊天室</h2>
    <Form
      {...layout}
      name="basic"
      initialValues={{remember: true}}
      onFinish={onFinish}
    >
      <Form.Item
        label="账号"
        name="userName"
        rules={[{
          required: true,
          message: '请输入账号!'
        }
      ]}>
        <Input/>
      </Form.Item>

      <Form.Item
        label="昵称"
        name="nickName"
        rules={[{
          required: true,
          message: '请输入昵称!'
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

      <Form.Item
        label="确认密码"
        name="repassword"
        rules={[{
          required: true,
          message: '请再输入一次密码!'
        }
      ]}>
        <Input.Password/>
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{width: '100%'}}>
          注册
      </Button>
    </Form>
    <div className="registerContainer">已有账号? <Link to="/">登录</Link></div>
  </div>
}

export default Register