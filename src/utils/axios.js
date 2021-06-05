import axios from 'axios'
import {message} from 'antd'

const request = axios.create()
request.defaults.baseURL = '/api'

request.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
});

request.interceptors.response.use((response) => {

  return new Promise((resolve) => {
    if (response.status === 200) {
      if(response.data.code === -1){
        message.error(response.data.msg)
        window.location.href = '/'
        return
      }
      if (response.data.code === 0) {
        resolve(response.data)
        return
      }else{
        message.error(response.data.msg)
      }
    } else {
      message.error('出错啦!')
    }
  })
}, (error) => {
  console.log(error)
})

export default request