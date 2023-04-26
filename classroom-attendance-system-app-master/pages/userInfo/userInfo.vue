<template>
	<view>
		<u-navbar title="个人信息" placeholder fixed autoBack></u-navbar>
		<view class="container">
			<view class="card card-shadow">
				<view class="card-item">
					<text>UID</text>
					<text class="desc">{{userInfo.id}}</text>
				</view>
				<view class="card-item">
					<text>用户名</text>
					<text class="desc">{{userInfo.username}}</text>
				</view>
				<view class="card-item">
					<text>昵称</text>
					<text class="desc">{{userInfo.nickname}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
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

<style scoped>
	.container{
		padding: 0 30rpx;
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
	.card .card-item .desc{
		color: #aaa;
		font-size: 26rpx;
	}
</style>
