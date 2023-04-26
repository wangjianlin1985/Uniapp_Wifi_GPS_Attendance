<template>
	<view>
		<u-navbar title="注册" autoBack fixed placeholder></u-navbar>
		<view class="container">
			<view class="form_container">
				<u-form
					labelPosition="left"
					labelWidth="60"
					ref="register_form"
					:rules="rules"
					:model="model"
				>
					<u-form-item label="用户名" required prop="register.username">
						<u-input v-model="model.register.username"></u-input>
					</u-form-item>
					<u-form-item label="密码" required prop="register.password">
						<u-input v-model="model.register.password"></u-input>
					</u-form-item>
					<u-form-item label="姓名" required prop="register.nickname">
						<u-input v-model="model.register.nickname"></u-input>
					</u-form-item>
					<u-form-item>
						<u-button type="primary" @click="register" formType="submit">注册</u-button>
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
					'register.nickname':[{
						min: 2,
						max: 6,
						message: '长度在2-6个字符之间'
					},{
						required: true,
						message: '请输入姓名'
					}]
				},
				model:{
					register:{
						username:"",
						password:"",
						nickname:"",
					}
				},
			}
		},
		methods: {
			async register(){
				let res = await this.$refs.register_form.validate()
				if(res){
					console.log("注册中")
					uni.request({
						url: this.$HOST + 'user/create',
						method: 'POST',
						data: this.model.register,
						success(result){
							if(result.data.code === 200){
								uni.showToast({
									title:"注册成功",
									success() {
										setTimeout(()=>{
											uni.redirectTo({
												url:"/pages/login/login"
											})
										},1500)
									}
								})
							}else{
								uni.showToast({
									title:result.data.msg,
									icon: "error"
								})
							}
						},
						fail() {
							uni.showToast({
								title:"注册失败",
								icon:"error"
							})
						}
					})
				}
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
</style>
