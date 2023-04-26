import React, { useCallback, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, BookOutlined, CalendarOutlined} from '@ant-design/icons'
import styles from './style.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { changePageTitle } from '../../utils/utils';

const { Sider } = Layout
const { SubMenu } = Menu

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const onSelect = useCallback(({key})=>{
    navigate(key)
  })
  const pagesTitle = {
    '/':'主页',
    '/user':'用户管理',
    '/course':'课程管理',
    '/location':'课程位置管理',
    '/select':'选课管理',
    '/signin':'签到管理',
  }
  useEffect(()=>{
    changePageTitle(pagesTitle[location.pathname.match(/^\/\w*/)])
  })
  return (
    <Sider theme='light'>
      <div className="logo">课程考勤管理系统</div>
      <Menu selectedKeys={[location.pathname]} defaultOpenKeys={['sub1','sub2','sub3']} mode="inline" onSelect={onSelect}>
        <Menu.Item key="/" icon={<HomeOutlined/>}>{pagesTitle['/']}</Menu.Item>
        <SubMenu title="用户" key="sub1" icon={<UserOutlined />}>
          <Menu.Item key="/user">{pagesTitle['/user']}</Menu.Item>
        </SubMenu>
        <SubMenu title="课程" key="sub2" icon={<BookOutlined/>}>
          <Menu.Item key="/course">{pagesTitle['/course']}</Menu.Item>
          <Menu.Item key="/location">{pagesTitle['/location']}</Menu.Item>
        </SubMenu>
        <SubMenu title="教务" key="sub3" icon={<CalendarOutlined/>}>
          <Menu.Item key="/select">{pagesTitle['/select']}</Menu.Item>
          <Menu.Item key="/signin">{pagesTitle['/signin']}</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}

export default Sidebar;
