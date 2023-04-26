<template>
	<view>
		<u-navbar title="登录" autoBack fixed placeholder></u-navbar>
		<view class="container">
			<view class="form_container">
				<u-form
					labelPosition="left"
					labelWidth="60"
					ref="login_form"
					:rules="rules"
					:model="model"
				>
					<u-form-item label="用户名" required prop="login.username">
						<u-input v-model="model.login.username"></u-input>
					</u-form-item>
					<u-form-item label="密码" required prop="login.password">
						<u-input v-model="model.login.password"></u-input>
					</u-form-item>
					<u-form-item>
						<u-button class="btn" type="primary" @click="login" formType="submit">登录</u-button>
						<u-button class="btn" @click="register">注册</u-button>
					</u-form-item>
				</u-form>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules:{
					'login.username':[{
						min: 4,
						max: 15,
						message: '长度在4-15个字符之间'
					},{
						required: true,
						message: '请输入用户名'
					}],
					'login.password':[{
						min: 4,
						max: 15,
						message: '长度在4-15个字符之间'
					},{
						required: true,
						message: '请输入密码'
					}],
					'register.username':[{
						min: 4,
						max: 15,
						message: '长度在4-15个字符之间'
					},{
						required: true,
						message: '请输入用户名'
					}],
					'register.password':[{
						min: 4,
						max: 15,
						message: '长度在4-15个字符之间'
					},{
						required: true,
						message: '请输入密码'
					},],
					'register.stuid':[{
						min: 4,
						max: 15,
						message: '长度在4-15个字符之间'
					},{
						required: true,
						message: '请输入密码'
					},{
						validate: (rules,value,callback)=>{
							return this.$u.test.isNumber(value)
						},
						message: '学号只能为数字'
					}]
				},
				model:{
					login:{
						username:"",
						password:""
					}
				},
			}
		},
		methods: {
			async login(){
				let res = await this.$refs.login_form.validate()
				let _this = this
				if(res){
					uni.showLoading({
						title:"登录中"
					})
					uni.request({
						url: this.$HOST + "user/login",
						method:"POST",
						data:this.model.login,
						success(res){
							if(res.data.code === 200){
								uni.setStorageSync("username",_this.model.login.username)
								uni.setStorageSync("password",_this.model.login.password)
								_this.$store.commit('user/changeInfo',{
									id:res.data.data.id,
									username:res.data.data.username,
									nickname:res.data.data.nickname,
									token:res.header.token
								})
								_this.$store.commit('user/changeLoginState',true)
								uni.showToast({
									title:"登录成功",
									duration:1000,
									success() {
										setTimeout(()=>{
											uni.switchTab({
												url:"../index/index"
											})
										},1000)
									}
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
			},
			register(){
				uni.navigateTo({
					url:'/pages/register/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		padding: 20rpx 30rpx;
		position: relative;
		box-sizing: border-box;
	}
	.subsection_container{
		padding: 0 120rpx;
		margin: 100rpx 0 50rpx 0;
	}
	.form_container{
		padding: 70rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.btn:nth-of-type(1){
		margin-right: 10rpx;
	}
	.btn:nth-last-of-type(1){
		margin-left: 10rpx;
	}
</style>
