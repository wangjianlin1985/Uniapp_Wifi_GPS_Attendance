<template>
	<view class="page">
		<map class="map"
			:longitude="course.lx"
			:latitude="course.ly"
			:circles="circles"
			scale="17"
		></map>
		<view class="container">
			<view v-if="!loading">
				<view class="title">
					<view class="value">{{course.cname}}</view>
					<view class="desc">
						<view class="state"
							:style="{
								color:isInClassTime(course.cdate,course.begintime,course.endtime)?$u.color['success']:'',
								borderColor:isInClassTime(course.cdate,course.begintime,course.endtime)?$u.color['success']:''
							}"
						>{{isInClassTime(course.cdate,course.begintime,course.endtime) ? '上课中' : '已下课'}}</view>
						<view class="time">{{getDate(course.cdate)}} {{getHourMinute(course.begintime)}} - {{getHourMinute(course.endtime)}}</view>
					</view>
				</view>
				<view class="content">
					<view class="item">
						<view class="title">上课地点</view>
						<view class="value">{{course.lname}}</view>
					</view>
					<view class="item">
						<view class="title">考勤形式</view>
						<view class="value">
							<view class="options">
								<view class="value">
									<u-icon
										style="margin-right: 5rpx;"
										:name="
											course.condition === 0 ? 'close-circle' :
											course.condition === 1 ? 'checkmark-circle' :
											course.condition === 2 ? 'close-circle' :
											course.condition === 3 ? 'checkmark-circle' : 'close-circle'"
										:color="
											course.condition === 0 ? $u.color['error'] :
											course.condition === 1 ? $u.color['success'] :
											course.condition === 2 ? $u.color['error'] :
											course.condition === 3 ? $u.color['success'] : $u.color['error']"
									></u-icon>
									<text>{{
										course.condition === 0 ? '未开启' : 
										course.condition === 1 ? '已开启' :
										course.condition === 2 ? '未开启' :
										course.condition === 3 ? '已开启' : '未开启'
									}}</text>
									<text>位置签到</text>
								</view>
								<view class="value"
									v-if="course.condition === 1 || course.condition === 3"
									:style="{
										color:isInCircle === true ? $u.color['success'] : $u.color['error'],
										marginLeft:'1.3em'
									}"
								>
									<text>{{isInCircle === true ? '你在签到' : '你不在签到'}}</text>
									<text>范围内</text>
								</view>
								<view class="value">
									<u-icon
										style="margin-right: 5rpx;"
										:name="
											course.condition === 0 ? 'close-circle' :
											course.condition === 1 ? 'close-circle' :
											course.condition === 2 ? 'checkmark-circle' :
											course.condition === 3 ? 'checkmark-circle' : 'close-circle'"
										:color="
											course.condition === 0 ? $u.color['error'] :
											course.condition === 1 ? $u.color['error'] :
											course.condition === 2 ? $u.color['success'] :
											course.condition === 3 ? $u.color['success'] : $u.color['error']"
									></u-icon>
									<text>{{
										course.condition === 0 ? '未开启' : 
										course.condition === 1 ? '未开启' :
										course.condition === 2 ? '已开启' :
										course.condition === 3 ? '已开启' : '未开启'
									}}</text>
									<text>WIFI签到</text>
								</view>
								<view class="value"
									v-if="course.condition === 2 || course.condition === 3"
									:style="{
										color:isWifiMatch ? $u.color['success'] : $u.color['error'],
										marginLeft:'1.3em'
									}"
								>
									<text>WiFi</text>
									<text>{{isWifiMatch ? '匹配' : '不匹配'}}</text>
									<text>：{{course.wifi}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="item" style="padding-right: 2em;">
						<u-button style="margin-right: 10rpx;" @click="recheckState">刷新状态</u-button>
						<u-button type="primary" style="margin-left: 10rpx;"
							:disabled="!isInClassTime(course.cdate,course.begintime,course.endtime) || isTodaySigned"
							@click="signin"
						>{{!isInClassTime(course.cdate,course.begintime,course.endtime) ? '不在上课时间' : 
							isTodaySigned ? '已签到' : '立即签到'
						}}</u-button>
					</view>
				</view>
			</view>
			<u-skeleton v-else rows="5" rowsHeight="20" titleHeight="25"></u-skeleton>
		</view>
	</view>
</template>

<script>
	import { getDate, getHourMinute, isInClassTime, isTodayClass } from "@/utils/timeUtils.js"
	import { getMapDistance } from "@/utils/mapUtils.js"
	var sand = uni.requireNativePlugin("sand-plugin-wifi")
	var page
	export default {
		data() {
			return {
				cid:0, // 从上一个页面传入的课程id
				loading: false,
				course:{
					uid:0,
					cid:0,
					cname:"",
					cdate:0,
					begintime:"00:00:00",
					endtime:"23:59:59",
					wifi:"",
					condition:0,
					lid:0,
					lname:"",
					lx:"",
					ly:""
				},
				circles:[],
				range: 2000, // 签到范围半径（米）
				isInCircle: false, // 是否在签到范围
				isWifiMatch: false, // Wifi是否匹配
				isTodaySigned: false, // 今日是否签到过
				location:{ // 当前GPS定位
					x:"",
					y:""
				}
			};
		},
		async onLoad(options){
			
			
			this.cid = options.cid
			try{
				await this.getCourseDetail()
			}catch(e){
				return
			}
			this.checkIsTodaySigned()
		},
		computed:{
			userInfo(){
				return this.$store.state.user.userInfo
			},
			isLogin(){
				return this.$store.state.user.isLogin
			}
		},
		methods:{
			getDate,
			getHourMinute,
			isInClassTime,
			isTodayClass,
			getMapDistance,
			// 签到
			signin(){
				let isPass = false; // 是否通过签到条件
				if(this.isTodaySigned){
					uni.showToast({
						title:"你已经签到过了",
						icon:"none",
						complete() {
							return
						}
					})
				}
				if(this.course.condition === 1){
					if(this.isInCircle)
						isPass = true
				}else if(this.course.condition === 2){
					if(this.isWifiMatch)
						isPass = true
				}else if(this.course.condition === 3){
					if(this.isInCircle && this.isWifiMatch)
						isPass = true
				}
				if(isPass){
					let data = {
						"user_id":this.userInfo.id,
						"course_id":this.cid,
						"location_x":this.location.x,
						"location_y":this.location.y
					}
					console.log(data)
					let _this = this
					if(this.isLogin){
						uni.showLoading({
							title:"签到中"
						})
						uni.request({
							url:this.$HOST + 'signin/sign',
							method:"POST",
							data,
							header:{token:this.userInfo.token},
							success(res) {
								let {data} = res
								if(data.code === 200){
									uni.showToast({
										title:"签到成功"
									})
									_this.checkIsTodaySigned()
								}else{
									uni.showToast({
										title:data.msg,
										icon:"error"
									})
								}
							},
							fail() {
								uni.showToast({
									title:"签到失败",
									icon:"error"
								})
							}
						})
					}
				}else{
					uni.showToast({
						title:"不符合签到条件",
						icon:"none"
					})
				}
			},
			// 检查当前环境是否满足 定位 / WIFI 签到
			recheckState(){
				/*
				uni.showLoading({
					title:"检测中"
				})*/
				
				if(this.course.condition === 1 || this.course.condition === 3){
					this.checkLocation()
				}
				if(this.course.condition === 2 || this.course.condition === 3){
					this.checkWifi()
				}
			},
			// 检查今天这门课程是否签到过了
			checkIsTodaySigned(){
				let _this = this
				let data = {
					user_id:this.userInfo.id,
					course_id:this.cid
				}
				if(this.isLogin){
					uni.request({
						url:this.$HOST + 'signin/isTodaySigned',
						method:"POST",
						data,
						header:{token:this.userInfo.token},
						success(res) {
							let {data} = res
							if(data.code === 200){
								if(data.data === true){
									_this.isTodaySigned = true
								}
							}else{
								uni.showToast({
									title:data.msg,
									icon:"error"
								})
							}
						},
						fail() {
							uni.showToast({
								title:"检查失败",
								icon:"error"
							})
						}
					})
				}
			},
			// 检查WIFI是否符合签到条件
			async checkWifi(){
				console.log('11112')
				let res = null;
				try{
					res = await this.getWifiInfo()
				}catch(e){
					console.log(e);
					uni.showToast({
						title:"WIFI检测失败",
						icon:"none",
						complete() {
							return
						}
					})
				}
				 
				
				if(res.ssid === this.course.wifi){
					this.isWifiMatch = true
				}else{
					this.isWifiMatch = false
				}
			},
			getWifiInfo(){
				return new Promise((resolve,reject)=>[
					sand.getWIFIInfo({},(ret)=>{
						if(ret.status == 2500){
							resolve(ret)
						}else{
							reject()
						}
					})
				])
			},
			// 检查是否在签到范围
			checkLocation(){
				let _this = this
				uni.getLocation({
					type:"gcj02",
					isHighAccuracy:true,
					highAccuracyExpireTime:6000,
					success(res) {
						console.log("获取到经纬度信息：", res)
						let distance = getMapDistance(res.longitude,res.latitude,_this.course.lx,_this.course.ly)
						_this.location.x = res.longitude
						_this.location.y = res.latitude
						if(_this.circles.length > 1){
							_this.circles.pop()
						}
						_this.circles.push({
							latitude:res.latitude,
							longitude:res.longitude,
							radius:8,
							color:'#f9ae3ddd',
							fillColor:'#f9ae3d44',
							strokeWidth:8
						})
						if(distance <= _this.range/1000){
							_this.isInCircle = true
						}else{
							_this.isInCircle = false
						}
						uni.showToast({
							title:"刷新成功"
						})
					},
					fail(err) {
						 
						console.log(err);
						uni.showToast({
							title:"定位失败，请检查定位权限",
							icon:"none"
						}) 
					   
					}
				})
			},
			async getCourseDetail(){
				uni.showLoading({
					title:"加载中"
				})
				let _this = this
				uni.request({
					url:this.$HOST + 'selection/course',
					method:"POST",
					data:{
						"uid":this.userInfo.id,
						"cid":this.cid
					},
					header:{token:this.userInfo.token},
					success(res) {
						let {data:{data}} = res
						if(res.data.code === 200){
							_this.course = data
							_this.circles.push({
								latitude:data.ly,
								longitude:data.lx,
								radius:_this.range,
								color:'#409effdd',
								fillColor:'#409eff44',
								strokeWidth: 8
							})
							uni.hideLoading()
							_this.loading = false
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"error"
							})
						}
					},
					fail() {
						uni.showToast({
							title:"获取课程失败",
							icon:"error"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: #f0f3f8;
	}
	.map{
		width: 100%;
		height: 750rpx;
	}
	.container{
		background-color: #fff;
		flex-grow: 1;
		width: 100%;
		border-top-left-radius: 50rpx;
		border-top-right-radius: 50rpx;
		z-index: 10;
		box-shadow: 0 -10rpx 20rpx rgba(160,160,160,0.5);
		padding: 50rpx 50rpx 0 50rpx;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		overflow-x: hidden;
		.title{
			margin-bottom: 30rpx;
			.value{
				font-size: 32rpx;
				font-weight: bold;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			.desc{
				display: flex;
				align-items: center;
				margin-top: 15rpx;
				.state{
					font-size: 24rpx;
					color: #a0a0a0;
					border: 1px solid #a0a0a0;
					border-radius: 10rpx;
					padding: 2rpx 14rpx;
					text-align: center;
				}
				.time{
					font-size: 26rpx;
					color: #a0a0a0;
					margin-left: 20rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		.content{
			display: flex;
			flex-direction: column;
			.item{
				display: flex;
				align-items: flex-start;
				font-size: 28rpx;
				padding: 20rpx 0 20rpx 2em;
				.title{
					margin: 0;
					flex-basis: 25%;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
				.value{
					flex: 1;
					color: #777;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
				.options{
					display: flex;
					flex-direction: column;
					> .value{
						padding-bottom: 10rpx;
						&:nth-last-of-type(1){
							padding-bottom: 0;
						}
					}
				}
			}
		}
	}
</style>
