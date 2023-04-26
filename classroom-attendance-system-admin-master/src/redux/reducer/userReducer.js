import { message } from 'antd'

const initialState = {
  isLogin:false,
  userInfo:{
    id:0,
    nickname:"",
    token:"",
  }
}

const userReducer = (state = initialState, action) => {
  let newState = {...state}
  let { payload, type } = action
  if(type === 'user/login'){
    let { data:{data},headers } = payload
    if(payload.data?.code === 200){
      message.success("登录成功")
      newState.isLogin = true
      newState.userInfo = {
        id: data.id,
        nickname: data.nickname,
        token: headers.token
      }
      window.localStorage.setItem("token",headers.token)
      window.localStorage.setItem("uid",data.id)
      return newState
    }else
      return state
  }else if(type === 'user/exit'){
    newState.isLogin = false
    return newState
  }else if(type === 'user/autoLogin'){
    let { data:{data},headers } = payload
    if(payload.data?.code === 200){
      message.success("登录成功")
      newState.isLogin = true
      newState.userInfo = {
        id: data.id,
        nickname: data.nickname,
        token: headers.token
      }
      window.localStorage.setItem("token",headers.token)
      window.localStorage.setItem("uid",data.id)
      return newState
    }else
      return state
  }else{
    return state
  }
}

export default userReducer