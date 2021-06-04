import React,{Suspense, useState}  from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import ReactDom from 'react-dom'
import {ConfigProvider } from 'antd'; // 引入ConfigProvider全局化配置
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
import {Provider} from './context'
import "./pages/style.css"
import Main from './pages/Main.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

const localUserInfo = JSON.parse(localStorage.getItem('userInfo'))

const App = () => {
  const [userInfo, setUserInfo] = useState(localUserInfo)
  
  const handleSaveUserInfo = (info) => {
    const newInfo = {...localUserInfo, ...info}
    localStorage.setItem('userInfo', JSON.stringify(newInfo))
    setUserInfo(newInfo)
  }
  return <Provider value={{userInfo, setUserInfo: handleSaveUserInfo}}>
  <Suspense fallback={< div > loading ...</div>}>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/main' component={Main} />
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  </Suspense>
</Provider>
}

ReactDom.render(
  <App/>, document.getElementById('root'))
