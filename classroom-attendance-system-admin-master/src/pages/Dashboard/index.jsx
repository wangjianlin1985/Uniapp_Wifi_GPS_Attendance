import React, { useEffect, useState } from 'react';
import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, Card, Col, Row, Statistic } from 'antd';

import axios from '../../utils/axios'

import styles from './style.module.css'
import { isTodayClass } from '../../utils/timeUtils';

function Dashboard() {
  const [users,setUsers] = useState([])
  const [courses,setCourses] = useState([])
  useEffect(()=>{
    axios.post('user/all').then(res=>{
      setUsers(res.data.data)
    })
    axios.post('course/all').then(res=>{
      setCourses(res.data.data)
    })
  },[])
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <Card className={styles.card} style={{height:"130px"}}>
          <Row>
            <Col span={8} className={styles.statistic_col}>
              <Statistic title="用户数量" value={users.length}/>
            </Col>
            <Col span={8} className={styles.statistic_col}>
              <Statistic title="课程数量" value={courses.length}/>
            </Col>
            <Col span={8} className={styles.statistic_col}>
              <Statistic title="今日课程数量" value={courses.filter(val=>isTodayClass(val.date)).length}/>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
