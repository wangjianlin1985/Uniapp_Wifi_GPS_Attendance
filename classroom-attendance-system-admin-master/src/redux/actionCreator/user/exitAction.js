export default function(){
  window.localStorage.removeItem("token")
  window.localStorage.removeItem("uid")
  return {
    type: 'user/exit'
  }
}