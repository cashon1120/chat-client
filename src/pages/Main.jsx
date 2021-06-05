import React,{useState} from 'react'
import {message, Button, Popover } from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import {Consumer} from '../context'
import UserInfo from '../components/userInfo/Index'
import Emoji from '../components/emoji/Index'
import MyWebsocket from '../ws'
import {getLocalUserInfo} from '../utils/common'
import {staticURL} from '../conf'

// 获取本地消息记录
const getHistoryMsg = () => {
  let list = []
  const localUserInfo = getLocalUserInfo()
  if(localUserInfo){
    const {userName} = localUserInfo
    let localList = localStorage.getItem(`${userName}_messagelist`)
    if(localList){
      list = JSON.parse(localList)
    }
  }
  return list
}

// 消息展示列表, 会跟后面发送和接收到的消息组合在一起, 现在暂时没有去处理大量消息时的情景
let msgList = []
let messageInputDom = null
let socket = null

const Main = (props) => {

  const [onlineList, setOnlineList] = useState([])
  const [newmsg, setNewmsg] = useState(getHistoryMsg())

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
    const localUserInfo = getLocalUserInfo()
    socket.send({
      type: 'chat',
      params: {
        userName: localUserInfo.userName,
        type: 'text',
        message: msg
      }
    })
    messageInputDom.innerHTML = ''
  }

  const findUserAvatar = (userName) => {
    const localUserList = localStorage.getItem('userList') ? JSON.parse(localStorage.getItem('userList')) : {}
    return localUserList[userName] ? localUserList[userName].avatar : ''
  }

  const saveUserList = (list) => {
    const localUserList = localStorage.getItem('userList') ? JSON.parse(localStorage.getItem('userList')) : {}
    list.forEach(item => {
      localUserList[item.userName] = item
    })
    localStorage.setItem('userList', JSON.stringify(localUserList))
  }

  useState(() => {
    msgList = getHistoryMsg()
    const localUserInfo = getLocalUserInfo()
    const localuserName = localUserInfo.userName
    if(!localuserName){
      props.history.push('/')
    }else{
      if(socket){
        socket.close()
      }
      socket = new MyWebsocket(`userName=${localuserName}`)
      socket.create()
      socket.onmessage((res) => {
        switch (res.type) {
          // 接收消息
          case 'chat':
            msgList.push(res.result)
            const listStr = JSON.stringify(msgList)
            setNewmsg(JSON.parse(listStr))
            const {userName} = JSON.parse(localStorage.getItem('userInfo'))
            localStorage.setItem(`${userName}_messagelist`, listStr)
            const div = document.getElementById('messageContainer')
            div.scrollTop = div.scrollHeight;
            break;

          // 在线信息  
          case 'online':
            saveUserList(res.list)
            setOnlineList(res.list)
            break;

          default:
            break;
        }
      })  
    }

   
    setTimeout(() => {
      const div = document.getElementById('messageContainer')
      if(div){
        div.scrollTop = div.scrollHeight;
      }
    }, 500);
  }, [])

  // 在线用户列表
  const showOnlineList = list => list.map(item => <div key={item.userName}>{item.nickName}</div>)
  
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


  // 发送表情
  const sendEmoji = (id) => {
    const localUserInfo = getLocalUserInfo()
    socket.send({
      type: 'chat',
      params: {
        userName: localUserInfo.userName,
        type: 'emoji',
        emojid: id
      }
    })
  }

  return <Consumer>{
      ({userInfo}) => <div className="wrapper">
      <ul className="messageList" id="messageContainer">
        {newmsg.map(item => <li key={item.id} className={item.userName === userInfo.userName ? 'myMessage' : ''}>
          <div className="userAvatar">{<img 
            src={findUserAvatar(item.userName) ? staticURL + findUserAvatar(item.userName) : '/avatar.jpg'} alt={item.nickName}
          />}</div>
          <div>
            {item.type === 'text' ? <div className="message" dangerouslySetInnerHTML={{__html: item.message}}></div> : null}
            {item.type === 'emoji' ? <div className="message message-emoji"><img src={`/assets/emoji/streamline-${item.emojid}--office-zoo--140x140.png`} alt=""/></div> : null}
          </div>
        </li>)}
      </ul>

      <div className="formContainer">
        <div className="tools">
          <div><Emoji sendEmoji={sendEmoji}/></div>
        </div>

        <div 
          id="messageInput" 
          className="messageInput"
          contentEditable={true}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          ></div>
        <div className="btnWrapper">
          <div className="bottomBtns">
            <div title="修改资料">
              <UserInfo saveUserList={saveUserList}/>
            </div>
          </div>
          <Popover content={showOnlineList(onlineList)} title="在线用户" trigger="hover">
            <div className="status">
              <TeamOutlined /> {onlineList.length}
            </div>
          </Popover>
          <Button type="primary" onClick={onFinish}>
            提交
          </Button>
        </div>
      </div>
    </div>
    }
  </Consumer>
}

export default Main