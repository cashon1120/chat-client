import {wsUrl} from './conf'
class MyWebsocket {
  constructor(url){
    this.socketUrl = `ws:${wsUrl}?${url}`
    this.onmessageList = []
    this.serverTimer = null
    this.heartTimer = null
  }

  create(){
    this.socket = new WebSocket(this.socketUrl)
    this.socket.onmessage = res => {
      const data = JSON.parse(res.data)
      if(data.type === 'heart'){
        clearTimeout(this.serverTimer)
      }else{
        this.pushMessage(data)
      }
    }
    this.heartCheck()
  }

  heartCheck(){
    this.serverTimer && clearTimeout(this.serverTimer)
    this.heartTimer && clearInterval(this.heartTimer)
    this.heartTimer = setInterval(() => {
      this.serverTimer = setTimeout(() => {
        this.close()
        this.create()
      }, 5000);
      this.send({
        type: 'heart'
      })
    }, 60000);
  }

  send(msg){
    if(!this.socket) return
    this.socket.send(JSON.stringify(msg))
  }

  onmessage(fn){
    this.onmessageList.push(fn)
  }

  pushMessage = (res) => {
    this.onmessageList.forEach(fn => {
      fn(res)
    })
  }

  close = () => {
    if(!this.socket) return
    this.socket.close()
  }

}

export default MyWebsocket