import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Input, Modal, Popconfirm, Spin, Table } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import axios from '../../utils/axios'

import styles from './style.module.css'
import { Map, APILoader, ToolBarControl, Marker } from '@uiw/react-amap'
import { amapKey } from '../../utils/config'

function Location() {
  const [locations,setLocations] = useState([])
  const [loading,setLoading] = useState(true)
  const [createLocationModalShow,setCreateLocationModalShow] = useState(false)
  const [editLocationModalShow,setEditLocationModalShow] = useState(false)
  const [editModalLoading,setEditModalLoading] = useState(true)
  const [createLocationForm] = Form.useForm()
  const [editLocationForm] = Form.useForm()
  const [editMapDefaultCenter,setEditMapDefaultCenter] = useState([116.397428, 39.90923])
  const [createMapMarkerPos,setCreateMapMarkerPos] = useState([116.397428, 39.90923])
  const onCreateMapClick = (e) => {
    let { lnglat: { lng, lat } } = e
    setCreateMapMarkerPos([lng,lat])
    createLocationForm.setFieldsValue({
      x: lng,
      y:lat
    })
  }
  const onEditMapClick = (e) => {
    let { lnglat: { lng, lat } } = e
    setEditMapDefaultCenter([lng,lat])
    editLocationForm.setFieldsValue({
      x: lng,
      y:lat
    })
  }
  const reloadData = useCallback(()=>{
    setLoading(true)
    axios.post('/location/all').then(res=>{
      setLocations(res.data.data.map(val=>({...val,key:val.id})))
      setLoading(false)
    })
  })
  const onCreateLocation = useCallback((value)=>{
    axios.post('/location/create',value).then(()=>{
      setCreateLocationModalShow(false)
      reloadData()
    })
  })
  const onOpenEditLocationModal = useCallback((id)=>{
    setEditModalLoading(true)
    setEditLocationModalShow(true)
    axios.post('/location/info',{id,username:""}).then(res=>{
      setEditMapDefaultCenter([res.data.data.x,res.data.data.y])
      editLocationForm.setFieldsValue(res.data.data)
      setEditModalLoading(false)
    })
  })
  const onEditLocation = useCallback((value)=>{
    value.isAdmin = value.isAdmin === true ? 1 : 0
    axios.post('/location/update',value).then(()=>{
      setEditLocationModalShow(false)
      reloadData()
    })
  })
  const deleteLocation = useCallback((id)=>{
    axios.post('/location/delete',{id}).then(res=>{
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
    title: "地点",
    dataIndex: "name",
  },{
    key: "x",
    title: "经度",
    dataIndex: "x",
    width: 230
  },{
    key: "y",
    title: "纬度",
    dataIndex: "y",
    width: 230
  },{
    key: "control",
    title: "操作",
    align: "center",
    dataIndex: "id",
    width: 200,
    render: val => (
      <div className={styles.controlBox}>
        <Button type='primary' onClick={()=>{onOpenEditLocationModal(val)}}>编辑</Button>
        <Popconfirm
          title="确定要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={()=>{deleteLocation(val)}}
        >
          <Button type='primary' danger>删除</Button>
        </Popconfirm>
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
        <Breadcrumb.Item>课程位置管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.container}>
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
          <Button className={styles.headerBtn} onClick={()=>{setCreateLocationModalShow(true)}}>新建</Button>
          <Button className={styles.headerBtn} onClick={reloadData}>刷新</Button>
        </div>
        <Table dataSource={locations} columns={columns} pagination={{pageSize: 8}} style={{marginTop:"10px"}} loading={loading}></Table>
      </div>
      <Modal title="新建位置" visible={createLocationModalShow} okText="新建" cancelText="取消" onOk={()=>{createLocationForm.submit()}} onCancel={()=>{setCreateLocationModalShow(false)}}>
        <Form
          name="createLocation"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          form={createLocationForm}
          onFinish={onCreateLocation}
        >
          <Form.Item
            label="地点"
            name="name"
            rules={[{
              required: true,
              message: "请输入地点"
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="经度"
            name="x"
            rules={[{
              required: true,
              message: "请输入经度"
            },{
              type:"number",
              message: "经度只能为数字",
              transform: val => Number.parseFloat(val)
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="纬度"
            name="y"
            rules={[{
              required: true,
              message: "请输入纬度"
            },{
              type:"number",
              message: "纬度只能为数字",
              transform: val => Number.parseFloat(val)
            }]}
          >
            <Input/>
          </Form.Item>
          <div className={styles.map}>
            <APILoader akay={amapKey}>
              <Map onClick={onCreateMapClick} center={createMapMarkerPos}>
                <ToolBarControl offset={[10, 10]} position="RT"/>
                <Marker position={new AMap.LngLat(...createMapMarkerPos)} title="选中的点"/>
              </Map>
            </APILoader>
          </div>
        </Form>
      </Modal>
      <Modal title="编辑" visible={editLocationModalShow} okText="保存" cancelText="取消" onOk={()=>{editLocationForm.submit()}} onCancel={()=>{setEditLocationModalShow(false)}}>
        <Spin spinning={editModalLoading} tip="正在加载位置信息">
          <Form
            name="editLocation"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            form={editLocationForm}
            onFinish={onEditLocation}
          >
            <Form.Item
              label="ID"
              name="id"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="地点"
              name="name"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="经度"
              name="x"
              rules={[{
                required: true,
                message: "请输入经度"
              },{
                type:"number",
                message: "经度只能为数字",
                transform: val => Number.parseFloat(val)
              }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="纬度"
              name="y"
              rules={[{
                required: true,
                message: "请输入纬度"
              },{
                type:"number",
                message: "纬度只能为数字",
                transform: val => Number.parseFloat(val)
              }]}
            >
              <Input/>
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

export default Location
