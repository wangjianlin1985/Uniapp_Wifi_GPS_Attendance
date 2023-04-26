import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Button, Checkbox, Form, Input, Modal, Popconfirm, Select, Spin, Table, TimePicker } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import moment from 'moment'

const { Option } = Select

import axios from '../../utils/axios'

import styles from './style.module.css'
import { conditionIdToName, dateIdToName } from '../../utils/utils'

function Course() {
  const [courses,setCourses] = useState([])
  const [loading,setLoading] = useState(true)
  const [createCourseModalShow,setCreateCourseModalShow] = useState(false)
  const [createCourseModalLoading,setCreateCourseModalLoading] = useState(true)
  const [locations,setLocations] = useState([])
  const [editCourseModalShow,setEditCourseModalShow] = useState(false)
  const [editModalLoading,setEditModalLoading] = useState(true)
  const [createCourseForm] = Form.useForm()
  const [editCourseForm] = Form.useForm()
  const reloadData = useCallback(()=>{
    setLoading(true)
    axios.post('/course/allL').then(res=>{
      setCourses(res.data.data.map(val=>({...val,key:val.id})))
      setLoading(false)
    })
  })
  const onCreateCourse = useCallback((value)=>{
    value.begintime = value.begintime.format("HH:mm:ss")
    value.endtime = value.endtime.format("HH:mm:ss")
    value.date = Number.parseInt(value.date)
    value.condition = Number.parseInt(value.condition)
    value.location = Number.parseInt(value.location)
    value.wifi = value.wifi === undefined ? 'unknown ssid' : value.wifi
    axios.post('/course/create',value).then(()=>{
      setCreateCourseModalShow(false)
      reloadData()
    })
  })
  const onOpenEditCourseModal = useCallback((id)=>{
    setEditModalLoading(true)
    setEditCourseModalShow(true)
    axios.post('/course/info',{id}).then(res=>{
      let { data: { data }} = res
      data.condition = `${data.condition}`
      data.date = `${data.date}`
      data.begintime = moment(data.begintime,"HH:mm:ss")
      data.endtime = moment(data.endtime,"HH:mm:ss")
      editCourseForm.setFieldsValue(data)
      setEditModalLoading(false)
      reloadData()
    })
  })
  const onEditCourse = useCallback((value)=>{
    value.date = Number.parseInt(value.date)
    value.begintime = value.begintime.format("HH:mm:ss")
    value.endtime = value.endtime.format("HH:mm:ss")
    value.condition = Number.parseInt(value.condition)
    axios.post('/course/update',value).then(()=>{
      setEditCourseModalShow(false)
      reloadData()
    })
  })
  const deleteCourse = useCallback((id)=>{
    axios.post('/course/delete',{id}).then(()=>{
      reloadData()
    })
  })
  const columns = [{
    key: "id",
    title: "ID",
    dataIndex: "id",
    width: 70,
    align: "center"
  },{
    key: "name",
    title: "课程名",
    dataIndex: "name",
    align: "center",
  },{
    key: "date",
    title: "上课日",
    dataIndex: "date",
    width: 80,
    alitn: "center",
    render: val => (
      <div>
        { dateIdToName(val) }
      </div>
    )
  },{
    key: "begintime",
    title: "上课时间",
    dataIndex: "begintime",
    align: "center"
  },{
    key: "endtime",
    title: "下课时间",
    dataIndex: "endtime",
    align: "center",
  },{
    key: "location",
    title: "上课地点",
    dataIndex: "location",
    align: "center"
  },{
    key: "wifi",
    title: "签到WIFI",
    dataIndex: "wifi",
    align: "center"
  },{
    key: "condition",
    title: "签到规则",
    dataIndex: "condition",
    width: 130,
    align: "center",
    render: val => (
      <div>
        { conditionIdToName(val) }
      </div>
    )
  },{
    key: "control",
    title: "操作",
    align: "center",
    dataIndex: "id",
    width: 200,
    render: val => (
      <div className={styles.controlBox}>
        <Button type='primary' onClick={()=>{onOpenEditCourseModal(val)}}>编辑</Button>
        <Popconfirm
          title="确定要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={()=>{deleteCourse(val)}}
        >
          <Button type='primary' danger>删除</Button>
        </Popconfirm>
      </div>
    )
  }]
  useEffect(()=>{
    setCreateCourseModalLoading(true)
    axios.post('/location/all').then(res=>{
      setLocations(res.data.data)
      setCreateCourseModalLoading(false)
    })
    reloadData()
  },[])
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={'/'}><HomeOutlined /></Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>课程管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
          <Button className={styles.headerBtn} onClick={()=>{setCreateCourseModalShow(true)}}>新建</Button>
          <Button className={styles.headerBtn} onClick={reloadData}>刷新</Button>
        </div>
        <Table dataSource={courses} columns={columns} pagination={{pageSize: 8}} style={{marginTop:"10px"}} loading={loading}></Table>
      </div>
      <Modal title="新建课程" visible={createCourseModalShow} okText="新建" cancelText="取消" onOk={()=>{createCourseForm.submit()}} onCancel={()=>{setCreateCourseModalShow(false)}}>
        <Spin spinning={createCourseModalLoading} tip="正在加载上课地点">
          <Form
            name="createCourse"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={createCourseForm}
            onFinish={onCreateCourse}
          >
            <Form.Item
              label="课程名"
              name="name"
              rules={[{
                required: true,
                message: "请输入课程名"
              }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="上课日"
              name="date"
              rules={[{
                required: true,
                message: "请选择上课日"
              }]}
            >
              <Select style={{width:150}}>
                <Option value="0">星期一</Option>
                <Option value="1">星期二</Option>
                <Option value="2">星期三</Option>
                <Option value="3">星期四</Option>
                <Option value="4">星期五</Option>
                <Option value="5">星期六</Option>
                <Option value="6">星期日</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="上课时间"
              name="begintime"
              rules={[{
                required: true,
                message: "请选择上课时间"
              }]}
            >
              <TimePicker placeholder='上课时间' style={{width:150}}/>
            </Form.Item>
            <Form.Item
              label="下课时间"
              name="endtime"
              rules={[{
                required: true,
                message: "请选择下课时间"
              }]}
            >
              <TimePicker placeholder='下课时间' style={{width:150}}/>
            </Form.Item>
            <Form.Item
              label="上课地点"
              name="location"
              rules={[{
                required: true,
                message: "请选择上课地点"
              }]}
            >
              <Select style={{width:150}}>
                {
                  locations.map(val=>(
                    <Option value={val.id} key={val.id}>{val.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="签到WIFI ssid"
              name="wifi"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="签到规则"
              name="condition"
            >
              <Select defaultValue={'0'} style={{width:150}}>
                <Option value="0">无限制</Option>
                <Option value="1">定位签到</Option>
                <Option value="2">Wifi签到</Option>
                <Option value="3">定位 + Wifi签到</Option>
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal title="编辑" visible={editCourseModalShow} okText="保存" cancelText="取消" onOk={()=>{editCourseForm.submit()}} onCancel={()=>{setEditCourseModalShow(false)}}>
        <Spin spinning={editModalLoading} tip="正在加载用户信息">
          <Form
            name="editCourse"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={editCourseForm}
            onFinish={onEditCourse}
          >
            <Form.Item
              label="课程ID"
              name="id"
              rules={[{
                required: true,
                message: "请输入课程ID"
              }]}
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="课程名"
              name="name"
              rules={[{
                required: true,
                message: "请输入课程名"
              }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="上课日"
              name="date"
              rules={[{
                required: true,
                message: "请选择上课日"
              }]}
            >
              <Select style={{width:150}}>
                <Option value="0">星期一</Option>
                <Option value="1">星期二</Option>
                <Option value="2">星期三</Option>
                <Option value="3">星期四</Option>
                <Option value="4">星期五</Option>
                <Option value="5">星期六</Option>
                <Option value="6">星期日</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="上课时间"
              name="begintime"
              rules={[{
                required: true,
                message: "请选择上课时间"
              }]}
            >
              <TimePicker placeholder='上课时间' style={{width:150}}/>
            </Form.Item>
            <Form.Item
              label="下课时间"
              name="endtime"
              rules={[{
                required: true,
                message: "请选择下课时间"
              }]}
            >
              <TimePicker placeholder='下课时间' style={{width:150}}/>
            </Form.Item>
            <Form.Item
              label="上课地点"
              name="location"
              rules={[{
                required: true,
                message: "请选择上课地点"
              }]}
            >
              <Select style={{width:150}}>
                {
                  locations.map(val=>(
                    <Option value={val.id} key={val.id}>{val.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="签到WIFI ssid"
              name="wifi"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="签到规则"
              name="condition"
            >
              <Select defaultValue={'0'} style={{width:150}}>
                <Option value="0">无限制</Option>
                <Option value="1">定位签到</Option>
                <Option value="2">Wifi签到</Option>
                <Option value="3">定位 + Wifi签到</Option>
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default Course
