import React,{useState, useRef} from 'react'
import {Form, Input, Button, Popover } from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import MyWebsocket from './ws'

const layout = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  }
};
const localUsername = localStorage.getItem('username')
let socket = null
if(localUsername){
  socket = new MyWebsocket(`username=${localUsername}`)
}

const getHistoryMsg = () => {
  let list = localStorage.getItem('messagelist')
  if(list){
    list = JSON.parse(list)
  }
  return list || []
}

const msgList = getHistoryMsg()
const Home = (props) => {
  const [onlineList, setOnlineList] = useState([])
  const [newmsg, setNewmsg] = useState(getHistoryMsg())
  const formRef = useRef()
  const onFinish = (values) => {
    formRef.current.setFieldsValue({
      'message': ''
    })
    socket.send({
      type: 'chat',
      params: {
        username: localUsername,
        ...values
      }
    })
  }

  useState(() => {
    if(!localUsername){
      props.history.push('/')
    }else{
      if(socket.close){
        socket.close()
      }

      socket.create()
      socket.onmessage((res) => {
        switch (res.type) {
          case 'chat':
            msgList.push(res.result)
            const listStr = JSON.stringify(msgList)
            setNewmsg(JSON.parse(listStr))
            localStorage.setItem('messagelist', listStr)
            const div = document.getElementById('messageContainer')
            div.scrollTop = div.scrollHeight;
            break;
          case 'online':
            setOnlineList(res.list)
            break;
          default:
            break;
        }
      })  
    }
  }, [])

  const showOnlineList = list => list.map(item => <div key={item}>{item}</div>)

  return <div className="wrapper">
  <ul className="messageList" id="messageContainer">
    {newmsg.map(item => <li key={item.id} className={item.username === localUsername ? 'myMessage' : ''}>
      <div className="userName">{item.username}</div>
      <div>
        <div className="message">{item.message}</div> 
      </div>
    </li>)}
  </ul>
  <div className="formContainer">
    <Form
      {...layout}
      name="nest-messages"
      ref={formRef}
      onFinish={onFinish}
    >
      <Form.Item name="message" label="">
        <Input.TextArea/>
      </Form.Item>
      <div className="btnWrapper">
        <div className="onlineInfo">
          <Popover content={showOnlineList(onlineList)} title="在线用户" trigger="hover">
            <div className="status">
              <TeamOutlined /> {onlineList.length}
            </div>
          </Popover>
        </div>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </div>
    </Form>
  </div>
  
  </div>
}

export default Home