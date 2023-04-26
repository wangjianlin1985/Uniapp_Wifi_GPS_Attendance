import axios from '../../../utils/axios'

export default function(token,uid){
  return axios.post('/user/autoLogin',{id:uid,username:""},{
    headers:{
      token
    }
  }).then(res=>{
    return {
      type: 'user/autoLogin',
      payload: res
    }
  })
}