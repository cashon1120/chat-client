import React,{Suspense}  from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import ReactDom from 'react-dom'
import "./style.css"

import Home from './Index.jsx'
import Login from './Login.jsx'

const App = () => {
  return <Suspense fallback={< div > loading ...</div>}>
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login}/>
        <Route path='/home' component={Home}/>
      </Switch>
    </BrowserRouter>
  </Suspense>
}

ReactDom.render(
  <App/>, document.getElementById('root'))
