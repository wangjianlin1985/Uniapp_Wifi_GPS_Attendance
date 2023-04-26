<template>
	<view class="container">
		<view class="detail card-shadow" @click="login">
			<u-avatar class="avatar" icon="account-fill" size="50"></u-avatar>
			<view class="items">
				<text class="nickname text-no-wrap">{{isLogin?userInfo.username : '未登录'}}</text>
				<text class="id text-no-wrap" v-if="isLogin">UID:{{userInfo.id}}</text>
			</view>
		</view>
		<view class="card card-shadow">
			<view class="card-item" @click="navigateWithLogin('/pages/userInfo/userInfo')">
				<text class="title">个人信息</text>
				<u-icon name="arrow-right" color="#aaa"/>
			</view>
		</view>
		<view class="card card-shadow" v-if="isLogin">
			<view class="card-item" @click="logout">
				<text class="title">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			login(){
				if(!this.isLogin){
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
			},
			logout(){
				let _this = this
				uni.showModal({
					title:"确定要退出吗？",
					success(res) {
						if(res.confirm){
							_this.$store.commit("user/logout")
							uni.showToast({
								title:"退出成功",
								duration:1000
							})
						}
					}
				})
			},
			navigate(url){
				uni.navigateTo({
					url
				})
			},
			navigateWithLogin(url){
				if(!this.isLogin){
					uni.showToast({
						icon:"none",
						title:"请先登录",
						success() {
							setTimeout(()=>{
								uni.navigateTo({
									url:"/pages/login/login"
								})
							},1500)
						}
					})
				}else{
					this.navigate(url)
				}
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.user.userInfo
			},
			isLogin(){
				return this.$store.state.user.isLogin
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0 30rpx;
	}
	.detail{
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 0 30rpx;
		height: 180rpx;
		border-radius: 20rpx;
	}
	.detail .nickname{
		font-size: 34rpx;
		font-weight: bold;
	}
	.detail .id{
		font-size: 24rpx;
		color: #aaa;
		border-radius: 10rpx;
		border: 1px solid #aaa;
		padding: 1rpx 4rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 6rpx;
	}
	.detail .items{
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
	}
	.card-shadow{
		box-shadow: 0 0 20rpx rgba(160,160,160,0.1);
	}
	.card{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}
	.card .card-item{
		padding: 0 20px;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(160,160,160,0.1);
		font-size: 28rpx;
	}
	.card .card-item:nth-last-of-type(1){
		border-bottom: none;
	}
</style>
