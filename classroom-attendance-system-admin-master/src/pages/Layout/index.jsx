import React, { useCallback, useMemo } from 'react';
import { Dropdown, Layout as ALayout, Menu, Modal, message } from 'antd';
import Sidebar from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';
import styles from './style.module.css'
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'

import exitAction from '../../redux/actionCreator/user/exitAction';

const { Header, Content } = ALayout
const { confirm } = Modal

function Layout(props) {
  // 退出模态框
  const onExitMenuClick = useCallback(()=>{
    confirm({
      title: '是否要退出？',
      onOk() {
        props.exit()
        message.success("已退出登录")
      },
      cancelText: "否",
      okText: "是"
    })
  })
  const menu = useMemo(()=>(
    <Menu>
      <Menu.Item key="1" onClick={onExitMenuClick}>
        <LogoutOutlined/>
        <span className={styles.sideMenuTitle}>退出</span>
      </Menu.Item>
    </Menu>
  ))
  //
  return (
    <ALayout style={{height:'100vh'}}>
      <Sidebar/>
      <ALayout style={{minHeight:'100%'}}>
        <Header style={{backgroundColor:"#fff",justifyContent:'space-between',display:'flex'}}>
          <div className={styles.headerSide}></div>
          <Dropdown overlay={menu}>
            <div className={styles.userTag}>
              <span>{ props.nickname }</span>
              <DownOutlined/>
            </div>
          </Dropdown>
        </Header>
        <Content style={{padding:'20px 30px'}}>
          <Outlet/>
        </Content>
      </ALayout>
    </ALayout>
  );
}

export default connect((state)=>({
  isLogin: state.userReducer.isLogin,
  nickname: state.userReducer.userInfo.nickname
}),(dispatch)=>({
  exit: () => dispatch(exitAction())
}))(Layout);
