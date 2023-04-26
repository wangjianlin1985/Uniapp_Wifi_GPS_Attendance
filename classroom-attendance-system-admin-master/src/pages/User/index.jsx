import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Button, Checkbox, Form, Input, message, Modal, Popconfirm, Spin, Table } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import axios from '../../utils/axios'

import styles from './style.module.css'

function User(props) {
  const [users,setUsers] = useState([])
  const [loading,setLoading] = useState(true)
  const [createUserModalShow,setCreateUserModalShow] = useState(false)
  const [editUserModalShow,setEditUserModalShow] = useState(false)
  const [editModalLoading,setEditModalLoading] = useState(true)
  const [createUserForm] = Form.useForm()
  const [editUserForm] = Form.useForm()
  const reloadData = useCallback(()=>{
    setLoading(true)
    axios.post('/user/all').then(res=>{
      setUsers(res.data.data.map(val=>({...val,key:val.id})))
      setLoading(false)
    })
  })
  const onCreateUser = useCallback((value)=>{
    axios.post('/user/create',value).then(()=>{
      setCreateUserModalShow(false)
      reloadData()
    })
  })
  const onOpenEditUserModal = useCallback((id)=>{
    setEditModalLoading(true)
    setEditUserModalShow(true)
    axios.post('/user/info',{id,username:""}).then(res=>{
      editUserForm.setFieldsValue(res.data.data)
      setEditModalLoading(false)
    })
  })
  const onEditUser = useCallback((value)=>{
    value.isAdmin = value.isAdmin === true ? 1 : 0
    axios.post('/user/update',value).then(()=>{
      setEditUserModalShow(false)
      reloadData()
    })
  })
  const deleteUser = useCallback((id)=>{
    axios.post('/user/delete',{id}).then(res=>{
      message.success(res.data.data)
      reloadData()
    })
  })
  const columns = [{
    key: "id",
    title: "用户ID",
    dataIndex: "id",
    width: 80,
    align: "center"
  },{
    key: "username",
    title: "用户名",
    dataIndex: "username",
  },{
    key: "password",
    title: "密码",
    dataIndex: "password",
  },{
    key: "nickname",
    title: "姓名",
    dataIndex: "nickname",
  },{
    key: "nickname",
    title: "管理员",
    dataIndex: "isAdmin",
    render: val => <Checkbox checked={val === 1}/>,
    width: 80,
    align: "center"
  },{
    key: "control",
    title: "操作",
    align: "center",
    dataIndex: "id",
    width: 200,
    render: val => (
      <div className={styles.controlBox}>
        <Button type='primary' onClick={()=>{onOpenEditUserModal(val)}}>编辑</Button>
        {
          val !== props.uid ? (
            <Popconfirm
            title="确定要删除吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={()=>{deleteUser(val)}}
          >
            <Button type='primary' danger>删除</Button>
          </Popconfirm>
          ) : null
        }
      </div>
    )
  }]
  useEffect(()=>{
    reloadData()
  },[])
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={'/'}><HomeOutlined /></Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
          <Button className={styles.headerBtn} onClick={()=>{setCreateUserModalShow(true)}}>新建</Button>
          <Button className={styles.headerBtn} onClick={reloadData}>刷新</Button>
        </div>
        <Table dataSource={users} columns={columns} pagination={{pageSize: 8}} style={{marginTop:"10px"}} loading={loading}></Table>
      </div>
      <Modal title="新建用户" visible={createUserModalShow} okText="新建" cancelText="取消" onOk={()=>{createUserForm.submit()}} onCancel={()=>{setCreateUserModalShow(false)}}>
        <Form
          name="createUser"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          form={createUserForm}
          onFinish={onCreateUser}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{
              required: true,
              message: "请输入用户名"
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: "请输入密码"
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="姓名"
            name="nickname"
            rules={[{
              required: true,
              message: "请输入姓名"
            }]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="编辑" visible={editUserModalShow} okText="保存" cancelText="取消" onOk={()=>{editUserForm.submit()}} onCancel={()=>{setEditUserModalShow(false)}}>
        <Spin spinning={editModalLoading} tip="正在加载用户信息">
          <Form
            name="editUser"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={editUserForm}
            onFinish={onEditUser}
          >
            <Form.Item
              label="用户ID"
              name="id"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="用户名"
              name="username"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{
                required: true,
                message: "请输入密码"
              }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="姓名"
              name="nickname"
              rules={[{
                required: true,
                message: "请输入姓名"
              }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              valuePropName='checked'
              label="管理员"
              name="isAdmin"
            >
              <Checkbox/>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default connect((state)=>({uid:state.userReducer.userInfo.id}))(User)
