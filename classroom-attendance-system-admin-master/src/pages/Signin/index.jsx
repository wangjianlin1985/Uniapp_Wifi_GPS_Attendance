import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Spin, Table, TimePicker } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import moment from 'moment'

const { Option } = Select

import axios from '../../utils/axios'

import styles from './style.module.css'
import { Map, APILoader, ToolBarControl, Marker } from '@uiw/react-amap'
import { amapKey } from '../../utils/config'

function Signin() {
  const [selections,setSelections] = useState([])
  const [loading,setLoading] = useState(true)
  const [createSelectionModalShow,setCreateSelectionModalShow] = useState(false)
  const [editSelectionModalShow,setEditSelectionModalShow] = useState(false)
  const [editModalLoading,setEditModalLoading] = useState(true)
  const [createSelectionForm] = Form.useForm()
  const [editSelectionForm] = Form.useForm()
  const [users,setUsers] = useState([])
  const [courses,setCourses] = useState([])
  const [loadingInitialData,setLoadingInitialData] = useState(true)
  const [editMapDefaultCenter,setEditMapDefaultCenter] = useState([116.397428, 39.90923])
  const [createMapMarkerPos,setCreateMapMarkerPos] = useState([116.397428, 39.90923])
  const onCreateMapClick = (e) => {
    let { lnglat: { lng, lat } } = e
    setCreateMapMarkerPos([lng,lat])
    createSelectionForm.setFieldsValue({
      location_x: lng,
      location_y:lat
    })
  }
  const onEditMapClick = (e) => {
    let { lnglat: { lng, lat } } = e
    setEditMapDefaultCenter([lng,lat])
    editSelectionForm.setFieldsValue({
      location_x: lng,
      location_y:lat
    })
  }
  const getInitialData = async () => {
    let { data: { data: userRes }} = await axios.post('user/all')
    let { data: { data: courseRes }} = await axios.post('course/all')
    setUsers(userRes)
    setCourses(courseRes)
    setLoadingInitialData(false)
  }
  const reloadData = useCallback(()=>{
    setLoading(true)
    axios.post('/signin/allN').then(res=>{
      setSelections(res.data.data.map(val=>({...val,key:val.id})))
      setLoading(false)
    })
  })
  const onCreateSelection = useCallback((value)=>{
    value.time = value.signin_date.format("YYYY-MM-DD") + ' ' + value.signin_time.format("HH:mm:ss")
    delete value.signin_date
    delete value.signin_time
    axios.post('/signin/create',value).then(()=>{
      setCreateSelectionModalShow(false)
      reloadData()
    })
  })
  const onOpenEditSelectionModal = useCallback((id)=>{
    setEditModalLoading(true)
    setEditSelectionModalShow(true)
    axios.post('/signin/info',{id}).then(res=>{
      let { data:{ data: signinInfo }} = res
      signinInfo.signin_date = moment(signinInfo.time,"YYYY/MM/DD")
      signinInfo.signin_time = moment(signinInfo.time,"HH:mm:ss")
      delete signinInfo.time
      setEditMapDefaultCenter([signinInfo.location_x,signinInfo.location_y])
      editSelectionForm.setFieldsValue(signinInfo)
      setEditModalLoading(false)
    })
  })
  const onEditSelection = useCallback((value)=>{
    value.time = value.signin_date.format("YYYY-MM-DD") + " " + value.signin_time.format("HH:mm:ss")
    delete value.signin_date
    delete value.signin_time
    axios.post('/signin/update',value).then(()=>{
      setEditSelectionModalShow(false)
      reloadData()
    })
  })
  const deleteSelection = useCallback((id)=>{
    axios.post('/signin/delete',{id}).then(()=>{
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
    key: "user_id",
    title: "用户",
    dataIndex: "user_id",
  },{
    key: "course_id",
    title: "课程",
    dataIndex: "course_id",
  },{
    key: "time",
    title: "签到时间",
    dataIndex: "time",
    sorter: (a,b) => moment(b.time).isBefore(a.time),
    showSorterTooltip: false,
    sortOrder:"descend"
  },{
    key: "location_x",
    title: "签到经度",
    dataIndex: "location_x"
  },{
    key: "location_y",
    title: "签到纬度",
    dataIndex: "location_y"
  },{
    key: "control",
    title: "操作",
    align: "center",
    dataIndex: "id",
    width: 200,
    render: val => (
      <div className={styles.controlBox}>
        <Button type='primary' onClick={()=>{onOpenEditSelectionModal(val)}}>编辑</Button>
        <Popconfirm
          title="确定要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={()=>{deleteSelection(val)}}
        >
          <Button type='primary' danger>删除</Button>
        </Popconfirm>
      </div>
    )
  }]
  useEffect(()=>{
    getInitialData()
    reloadData()
  },[])
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={'/'}><HomeOutlined /></Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>签到管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
          <Button className={styles.headerBtn} onClick={()=>{setCreateSelectionModalShow(true)}}>新建</Button>
          <Button className={styles.headerBtn} onClick={reloadData}>刷新</Button>
        </div>
        <Table dataSource={selections} columns={columns} pagination={{pageSize: 8}} style={{marginTop:"10px"}} loading={loading}></Table>
      </div>
      <Modal title="新建签到" visible={createSelectionModalShow} okText="新建" cancelText="取消" onOk={()=>{createSelectionForm.submit()}} onCancel={()=>{setCreateSelectionModalShow(false)}}>
        <Spin spinning={loadingInitialData} tip="正在初始化">
        <Form
            name="createSelection"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={createSelectionForm}
            onFinish={onCreateSelection}
          >
            <Form.Item
              label="用户"
              name="user_id"
              rules={[{
                required: true,
                message: "请选择用户"
              }]}
            >
              <Select>
                {
                  users.map(val => (
                    <Option key={val.id} value={val.id}>{val.nickname}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="课程"
              name="course_id"
              rules={[{
                required: true,
                message: "请选择课程"
              }]}
            >
              <Select>
                {
                  courses.map(val => (
                    <Option key={val.id} value={val.id}>{val.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="签到日期"
              name="signin_date"
              rules={[{
                required: true,
                message: "请选择签到日期"
              }]}
            >
              <DatePicker format={"YYYY/MM/DD"} placeholder="选择日期"/>
            </Form.Item>
            <Form.Item
              label="签到时间"
              name="signin_time"
              rules={[{
                required: true,
                message: "请选择签到时间"
              }]}
            >
              <TimePicker placeholder='选择时间'/>
            </Form.Item>
            <Form.Item
              label="签到经度"
              name="location_x"
              rules={[{
                required: true,
                message: "请在地图选点"
              }]}
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="签到纬度"
              name="location_y"
              rules={[{
                required: true,
                message: "请在地图选点"
              }]}
            >
              <Input disabled/>
            </Form.Item>
            <div className={styles.map}>
            <APILoader akay={amapKey}>
              <Map onClick={onCreateMapClick}>
                <ToolBarControl offset={[10, 10]} position="RT"/>
                <Marker position={new AMap.LngLat(...createMapMarkerPos)} title="选中的点"/>
              </Map>
            </APILoader>
          </div>
          </Form>
        </Spin>
      </Modal>
      <Modal title="编辑" visible={editSelectionModalShow} okText="保存" cancelText="取消" onOk={()=>{editSelectionForm.submit()}} onCancel={()=>{setEditSelectionModalShow(false)}}>
        <Spin spinning={editModalLoading} tip="正在加载位置信息">
          <Form
            name="editSelection"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={editSelectionForm}
            onFinish={onEditSelection}
          >
            <Form.Item
              label="ID"
              name="id"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="用户"
              name="user_id"
            >
              <Select disabled>
                {
                  users.map(val => (
                    <Option key={val.id} value={val.id}>{val.nickname}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="课程"
              name="course_id"
              rules={[{
                required: true,
                message: "请选择课程"
              }]}
            >
              <Select>
                {
                  courses.map(val => (
                    <Option key={val.id} value={val.id}>{val.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="签到日期"
              name="signin_date"
              rules={[{
                required: true,
                message: "请选择签到日期"
              }]}
            >
              <DatePicker format={"YYYY/MM/DD"} placeholder="选择日期"/>
            </Form.Item>
            <Form.Item
              label="签到时间"
              name="signin_time"
              rules={[{
                required: true,
                message: "请选择签到时间"
              }]}
            >
              <TimePicker placeholder='选择时间'/>
            </Form.Item>
            <Form.Item
              label="签到经度"
              name="location_x"
              rules={[{
                required: true,
                message: "请在地图选点"
              }]}
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="签到纬度"
              name="location_y"
              rules={[{
                required: true,
                message: "请在地图选点"
              }]}
            >
              <Input disabled/>
            </Form.Item>
            <div className={styles.map}>
            <APILoader akay={amapKey}>
              <Map onClick={onEditMapClick} center={editMapDefaultCenter}>
                <ToolBarControl offset={[10, 10]} position="RT"/>
                <Marker position={new AMap.LngLat(...editMapDefaultCenter)} title="选中的点"/>
              </Map>
            </APILoader>
          </div>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default Signin
