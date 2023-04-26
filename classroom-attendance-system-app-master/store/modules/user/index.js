export default {
	namespaced:true,
	state:{
		userInfo:{
			id: 0,
			username: "",
			nickname: "",
			token: "",
		},
		isLogin:false
	},
	mutations:{
		changeInfo(state,payload){
			state.userInfo = {...payload}
		},
		changeLoginState(state,payload){
			state.isLogin = payload
		},
		logout(state){
			state.isLogin = false
			state.userInfo.token = ""
			uni.clearStorageSync("username")
			uni.clearStorageSync("password")
		}
	},
	actions:{
		autoLogin: ({commit,state},host) => {
			if(state.isLogin === false){
				let username = uni.getStorageSync("username")
				let password = uni.getStorageSync("password")
				if(username != "" && password != ""){
					uni.request({
						url: host + "user/login",
						method:"POST",
						data:{username,password},
						success(res){
							if(res.data.code === 200){
								commit('changeInfo',{
									id:res.data.data.id,
									username:res.data.data.username,
									nickname:res.data.data.nickname,
									token:res.header.token
								})
								commit('changeLoginState',true)
								uni.showToast({
									title:"登录成功",
									duration:1000
								})
							}else{
								uni.showToast({
									title:res.data.msg,
									icon:"error"
								})
							}
						},
						fail() {
							uni.showToast({
								title:"登录失败",
								icon:"error"
							})
						}
					})
				}
			}
		}
	}
}