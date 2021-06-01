const wsUrl = 'localhost:3000/'
class websocket {
  constructor(url){
    this.onmessageList = []
    this.socket = new WebSocket(`ws:${wsUrl}?${url}`)
    this.socket.onmessage = this.pushMessage
  }
  send(msg){
    console.log(JSON.stringify(msg))
    this.socket.send(JSON.stringify(msg))
  }
  onmessage(fn){
    this.onmessageList.push(fn)
  }
  pushMessage = (res) => {
    this.onmessageList.forEach(fn => {
      fn(JSON.parse(res.data))
    })
  }

  close = () => {
    this.socket.close()
  }
}

export default websocket