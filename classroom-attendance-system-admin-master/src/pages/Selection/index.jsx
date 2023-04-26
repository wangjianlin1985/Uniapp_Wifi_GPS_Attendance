import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Input, Modal, Popconfirm, Select, Spin, Table } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Option } = Select

import axios from '../../utils/axios'

import styles from './style.module.css'

function Selection() {
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
  const getInitialData = async () => {
    let { data: { data: userRes }} = await axios.post('user/all')
    let { data: { data: courseRes }} = await axios.post('course/all')
    setUsers(userRes)
    setCourses(courseRes)
    setLoadingInitialData(false)
  }
  const reloadData = useCallback(()=>{
    setLoading(true)
    axios.post('/selection/allN').then(res=>{
      setSelections(res.data.data.map(val=>({...val,key:val.id})))
      setLoading(false)
    })
  })
  const onCreateSelection = useCallback((value)=>{
    axios.post('/selection/create',value).then(()=>{
      setCreateSelectionModalShow(false)
      reloadData()
    })
  })
  const onOpenEditSelectionModal = useCallback((id)=>{
    setEditModalLoading(true)
    setEditSelectionModalShow(true)
    axios.post('/selection/infoI',{id}).then(res=>{
      editSelectionForm.setFieldsValue(res.data.data)
      setEditModalLoading(false)
    })
  })
  const onEditSelection = useCallback((value)=>{
    axios.post('/selection/update',value).then(()=>{
      setEditSelectionModalShow(false)
      reloadData()
    })
  })
  const deleteSelection = useCallback((id)=>{
    axios.post('/selection/delete',{id}).then(()=>{
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
        <Breadcrumb.Item>选课管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
          <Button className={styles.headerBtn} onClick={()=>{setCreateSelectionModalShow(true)}}>新建</Button>
          <Button className={styles.headerBtn} onClick={reloadData}>刷新</Button>
        </div>
        <Table dataSource={selections} columns={columns} pagination={{pageSize: 8}} style={{marginTop:"10px"}} loading={loading}></Table>
      </div>
      <Modal title="新建位置" visible={createSelectionModalShow} okText="新建" cancelText="取消" onOk={()=>{createSelectionForm.submit()}} onCancel={()=>{setCreateSelectionModalShow(false)}}>
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
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default Selection
