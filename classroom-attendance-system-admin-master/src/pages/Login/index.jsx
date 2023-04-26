import React, { useCallback, useEffect, useState } from 'react'
import { Layout, Card, Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import loginAction from '../../redux/actionCreator/user/loginAction'

import styles from './style.module.css'
import { useNavigate } from 'react-router-dom'
import autoLoginAction from '../../redux/actionCreator/user/autoLoginAction'

const { Header, Content } = Layout

function index(props){
  const [userName,setUserName] = useState("")
  const [passWord,setPassWord] = useState("")
  const onUserNameChange = useCallback((e)=>{
    setUserName(e.target.value)
  })
  const onPassWordChange = useCallback((e)=>{
    setPassWord(e.target.value)
  })
  const login = useCallback(()=>{
    props.login(userName,passWord)
  })
  const navigate = useNavigate()
  useEffect(()=>{
    if(props.isLogin){
      navigate("/")
    }
    let token = window.localStorage.getItem("token")
    let uid = window.localStorage.getItem("uid")
    if(token !== null && uid !== null){
      // 存在token，自动登录
      props.autoLogin(token,uid)
    }
  },[props.isLogin])
  return (
    <Layout style={{height:"100vh"}}>
      <Header style={{backgroundColor:"#fff"}}>
        <div className='logo'>课程考勤管理系统</div>
      </Header>
      <Content style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Card style={{ width: 350 }} title="登录">
          <Form
            name="normal_login"
            className={styles['login-form']}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined className={styles['site-form-item-icon']} />} placeholder="用户名" value={userName} onChange={onUserNameChange}/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input
                prefix={<LockOutlined className={styles['site-form-item-icon']} />}
                type="password"
                placeholder="密码"
                value={passWord}
                onChange={onPassWordChange}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles['login-form-button']} onClick={login}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default connect((state)=>({isLogin:state.userReducer.isLogin}),(dispatch)=>({
  login: (...args) => dispatch(loginAction(...args)),
  autoLogin: (...args) => dispatch(autoLoginAction(...args))
}))(index)