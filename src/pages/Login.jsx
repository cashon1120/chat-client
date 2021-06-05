import React from 'react'
import {Form, Input, Button, message} from 'antd';
import {Link} from 'react-router-dom'
import {Consumer} from '../context'
import request from '../utils/axios'

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const Login = (props) => {

  const onFinish = (values, setUserInfo) => {
    request.post('/login', values).then(res => {
      if(res && res.code === 0){
        setUserInfo(res.userInfo)
        window.history.push = props.history.push
        setTimeout(() => {
          props.history.push('/main')
        }, 500);
      }else{
        message.error(res.msg)
      }
    })
  }

  return <Consumer>
    {
      ({setUserInfo}) => <div className="loginWrapper">
      <h2 style={{textAlign: 'center', marginBottom: 25}}>这不是一个聊天室</h2>
      <Form
        {...layout}
        name="basic"
        initialValues={{remember: true}}
        onFinish={(values) => {
          onFinish(values, setUserInfo)
        }}
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
      <div className="registerContainer">没有账号? <Link to="register">注册一个</Link></div>
    </div>
    }
  </Consumer> 
}

export default Login