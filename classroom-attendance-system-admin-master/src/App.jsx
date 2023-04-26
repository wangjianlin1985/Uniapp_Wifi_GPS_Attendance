import Layout from './pages/Layout'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PermissionRouteElement from './components/PermissionRouteElement'
import User from './pages/User'
import NotFound from './pages/NotFound'
import Location from './pages/Location'
import Course from './pages/Course'
import Selection from './pages/Selection'
import Signin from './pages/Signin'

import { APILoader } from '@uiw/react-amap'
import { amapKey } from './utils/config'

function App() {
  return (
    <>
      <APILoader akay={amapKey}/>
      <BrowserRouter>
        <Routes>
          <Route path={'/login'} element={<Login/>}></Route>
          <Route path={'/'} element={<Layout/>}>
            <Route index element={<PermissionRouteElement element={<Dashboard/>}/>}/>
            <Route path='/user' element={<PermissionRouteElement element={<User/>}/>}/>
            <Route path='/location' element={<PermissionRouteElement element={<Location/>}/>}/>
            <Route path='/course' element={<PermissionRouteElement element={<Course/>}/>}/>
            <Route path='/select' element={<PermissionRouteElement element={<Selection/>}/>}/>
            <Route path='/signin' element={<PermissionRouteElement element={<Signin/>}/>}/>
          </Route>
          <Route path='/404' element={<NotFound/>}/>
          <Route path='*' element={<Navigate to={'/404'} replace/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App