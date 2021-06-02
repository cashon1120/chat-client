let wsUrl = '';
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  wsUrl = '120.48.9.247:3005/';
} else {
  wsUrl = '192.168.50.12:3005/';
}
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
        console.log('清除关闭')
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
      }, 5000);
      this.send({
        type: 'heart'
      })
    }, 6000);
  }

  send(msg){
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