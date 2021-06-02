import React,{Suspense}  from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import ReactDom from 'react-dom'
import "./style.css"

import Main from './Main.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'

const App = () => {
  return <Suspense fallback={< div > loading ...</div>}>
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/main' component={Main} />
      </Switch>
    </BrowserRouter>
  </Suspense>
}

ReactDom.render(
  <App/>, document.getElementById('root'))
