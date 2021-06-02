import React,{useState} from 'react'
import {message, Button, Popover } from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import MyWebsocket from './ws'

const localUsername = localStorage.getItem('username')
let socket = null
if(localUsername){
  socket = new MyWebsocket(`username=${localUsername}`)
}

// 获取本地消息记录
const getHistoryMsg = () => {
  let list = localStorage.getItem('messagelist')
  if(list){
    list = JSON.parse(list)
  }
  return list || []
}

// 消息展示列表, 会跟后面发送和接收到的消息组合在一起, 现在暂时没有去处理大量消息时的情景
const msgList = getHistoryMsg()

let messageInputDom = null
const Home = (props) => {
  const [onlineList, setOnlineList] = useState([])
  const [newmsg, setNewmsg] = useState(msgList)

  // 提交消息
  const onFinish = () => {
    if(!messageInputDom){
      messageInputDom = document.getElementById('messageInput')
    }
    let msg = messageInputDom.innerHTML
    if(!msg){
      message.error('请输入要发送的消息')
      return
    }
    socket.send({
      type: 'chat',
      params: {
        username: localUsername,
        message: msg
      }
    })
    messageInputDom.innerHTML = ''
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
          // 接收消息
          case 'chat':
            msgList.push(res.result)
            const listStr = JSON.stringify(msgList)
            setNewmsg(JSON.parse(listStr))
            localStorage.setItem('messagelist', listStr)
            const div = document.getElementById('messageContainer')
            div.scrollTop = div.scrollHeight;
            break;

          // 在线信息  
          case 'online':
            setOnlineList(res.list)
            break;

          default:
            break;
        }
      })  
    }
  }, [])

  // 在线用户列表
  const showOnlineList = list => list.map(item => <div key={item}>{item}</div>)
  
  // 键盘事件, 按下shift和enter时换行, 只按下enter时提交
  let pressShif = false
  const handleKeyDown = (e) => {
    if(e.keyCode === 16){
      e.preventDefault()
      pressShif = true
    }
    if(e.keyCode === 13 && !pressShif){
      e.preventDefault()
      onFinish()
    }
  }
  const handleKeyUp = (e) => {
    if(e.keyCode === 16){
      e.preventDefault()
      pressShif = false
    }
  }
  // 键盘事件----------------end

  return <div className="wrapper">
  <ul className="messageList" id="messageContainer">
    {newmsg.map(item => <li key={item.id} className={item.username === localUsername ? 'myMessage' : ''}>
      <div className="userName">{item.username}</div>
      <div>
        <div className="message" dangerouslySetInnerHTML={{__html: item.message}}></div> 
      </div>
    </li>)}
  </ul>
  <div className="formContainer">
    
      <div 
        id="messageInput" 
        className="messageInput"
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        ></div>
      <div className="btnWrapper">
        <div className="onlineInfo">
          <Popover content={showOnlineList(onlineList)} title="在线用户" trigger="hover">
            <div className="status">
              <TeamOutlined /> {onlineList.length}
            </div>
          </Popover>
        </div>
        <Button type="primary" onClick={onFinish}>
          提交
        </Button>
      </div>
  </div>
  
  </div>
}

export default Home