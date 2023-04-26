import axios from 'axios'
import { message } from 'antd'

let instance = axios.create({
  baseURL: '/api'
})

instance.interceptors.request.use(config=>{
  config.headers.token = window.localStorage.getItem('token')
  return config
},err=>{
  message.error("请求失败")
  return Promise.reject(err)
})

instance.interceptors.response.use(res=>{
  if(res.data.code !== 200){
    message.error(res.data.msg)
  }
  return Promise.resolve(res)
},err=>{
  message.error(err.response.data.msg)
  return Promise.reject(err)
})

export default instance