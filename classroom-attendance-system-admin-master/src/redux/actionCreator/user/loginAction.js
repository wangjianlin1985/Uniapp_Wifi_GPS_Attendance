import axios from '../../../utils/axios'

export default function(username,password){
  return axios.post('/user/login',{
    username,
    password
  }).then(res=>{
    return {
      type: 'user/login',
      payload: res
    }
  })
}