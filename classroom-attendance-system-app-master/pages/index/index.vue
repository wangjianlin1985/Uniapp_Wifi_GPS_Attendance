<template>
	<view class="container">
		<view class="pos_fixed">
			<view class="overview">
				<view class="item">
					<view class="title">今日课程</view>
					<view class="value">
						<text>{{todayCourses.length >= 0 ? todayCourses.length : 0}}</text>
						<text>节</text>
					</view>
				</view>
				<view class="item">
					<view class="title">已签到课程</view>
					<view class="value">
						<text>{{signedCount}}</text>
						<text>节</text>
					</view>
				</view>
			</view>
			<view class="content" style="background-color: #f7f7fa;">
				<u-tabs :list="tabs" @click="changeTab">
					<view slot="right" style="padding-left: 4px;" @click="handleReloadTap">
						<u-icon name="reload" size="21" bold></u-icon>
					</view>
				</u-tabs>
			</view>
		</view>
		<view class="fixed"/>
		<view class="content">
			<view class="classes">
				<template v-if="isLogin && courses.length > 0">
					<view class="class-card" v-for="(item,index) in courses" :key="index" @click="navigate('/pages/course/course?cid='+item.cid)">
						<u-avatar icon="calendar-fill" shape="square" size="160rpx" fontSize="60rpx"></u-avatar>
						<view class="detail">
							<view class="name text-no-wrap">{{item.cname}}</view>
							<view class="state"
								:style="{
									color:isInClassTime(item.cdate,item.begintime,item.endtime)?$u.color['success']:'',
									borderColor:isInClassTime(item.cdate,item.begintime,item.endtime)?$u.color['success']:''
								}"
							>{{isInClassTime(item.cdate,item.begintime,item.endtime) ? '上课中' : '已下课'}}</view>
							<view class="desc text-no-wrap">{{getDate(item.cdate)}} {{getHourMinute(item.begintime)}} - {{getHourMinute(item.endtime)}}</view>
							<view class="desc text-no-wrap">{{item.lname}}</view>
						</view>
						<u-icon name="arrow-right" color="#aaa"></u-icon>
					</view>
				</template>
				<view class="class-card flex-center" style="justify-content: center;" v-if="isLogin && courses.length === 0 && !loadingCourses">
					<u-empty mode="list" text="当前没有课程" width="100%"></u-empty>
				</view>
				<view class="class-card flex-center" style="justify-content: center;" v-if="!isLogin">
					<u-empty mode="permission" text="您还没有登录">
						<u-button type="primary" customStyle="margin-top:40rpx;" @click="navigate('/pages/login/login')">立即登录</u-button>
					</u-empty>
				</view>
				<view class="class-card flex-center" v-if="loadingCourses && courses.length === 0">
					<u-skeleton avatar avatarSize="80" avatarShape="square" rows="3" rowsWidth="70%" :title="false"></u-skeleton>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getDate, getHourMinute, isInClassTime, isTodayClass } from "../../utils/timeUtils.js"
	export default {
		data(){
			return {
				tabs:[{
					name:'全部课程'
				},{
					name:'今日课程'
				},{
					name:'上课中'
				}],
				currTab: 0,
				courses: [],
				loadingCourses: false, // 是否正在加载课程
			}
		},
		methods:{
			navigate(url){
				uni.navigateTo({
					url
				})
			},
			changeTab(item){
				this.currTab = item.index
			},
			getDate,
			getHourMinute,
			isInClassTime,
			isTodayClass,
			getTodayAllSignedCourses(){
				let _this = this
				if(this.isLogin){
					uni.request({
						url:this.$HOST + 'signin/getTodayAllSigned',
						method:"POST",
						data:{"user_id":this.userInfo.id},
						header:{token:this.userInfo.token},
						success(res) {
							let {data} = res
							if(data.code === 200){
								_this.$store.commit("course/changeTodayAllSignedCourses",data.data)
							}else{
								uni.showToast({
									title:data.msg,
									icon:"error"
								})
							}
						},
						fail() {
							uni.showToast({
								title:"获取失败",
								icon:"error"
							})
						}
					})
				}
			},
			getLatestCourses(){
				let _this = this
				if(this.isLogin){
					this.loadingCourses = true
					uni.request({
						url:this.$HOST + 'selection/courses',
						method:"POST",
						data:{"user_id":this.userInfo.id},
						header:{token:this.userInfo.token},
						success(res) {
							let {data} = res
							if(data.code === 200){
								_this.$store.commit("course/changeSelectedCourses",data.data)
								_this.courses = _this.allCourses
							}else{
								uni.showToast({
									title:data.msg,
									icon:"error"
								})
							}
						},
						fail() {
							uni.showToast({
								title:"获取课程失败",
								icon:"error"
							})
						},
						complete() {
							_this.loadingCourses = false
						}
					})
				}
			},
			handleReloadTap(){
				if(this.isLogin){
					uni.showLoading({
						title:"加载中"
					})
					this.getLatestCourses()
					this.getTodayAllSignedCourses()
					setTimeout(()=>{
						uni.hideLoading()
					},2000)
				}else{
					uni.showToast({
						title:"请登录",
						duration:1000,
						icon:"error"
					})
				}
			}
		},
		computed:{
			isLogin(){
				return this.$store.state.user.isLogin
			},
			allCourses(){
				// 所有课程
				return this.$store.state.course.selectedCourses
			},
			userInfo(){
				return this.$store.state.user.userInfo
			},
			inTimeCourses(){
				// 上课中课程
				return this.$store.state.course.selectedCourses.filter(val=>isInClassTime(val.cdate,val.begintime,val.endtime))
			},
			todayCourses(){
				// 今日课程
				return this.$store.state.course.selectedCourses.filter(val=>isTodayClass(val.cdate))
			},
			signedCount(){
				return this.$store.getters['course/todayAllSignedCoursesCount']
			}
		},
		watch:{
			currTab:{
				handler(val){
					if(val === 0)
						this.courses = this.allCourses
					else if(val === 1)
						this.courses = this.todayCourses
					else if(val === 2)
						this.courses = this.inTimeCourses
					else
						this.courses = this.allCourses
				},
				immediate:true
			}
		},
		onShow(){
			this.getLatestCourses()
			this.getTodayAllSignedCourses()
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.fixed{
		height: calc(44px + 220rpx);
	}
	.pos_fixed{
		position: fixed;
		z-index: 999;
	}
	.overview{
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		background-color: #409eff;
		width: 750rpx;
		height: 220rpx;
		color: #ffffef;
		font-size: 28rpx;
		box-shadow: 0 10rpx 10rpx rgba(160,160,160,0.2)
	}
	.overview .item{
		width: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.overview .item .title{
		font-size: 28rpx;
	}
	.overview .item .value{
		margin-top: 26rpx;
		font-size: 28rpx;
	}
	.overview .item .value text:nth-of-type(1){
		font-size: 1.7em;
		font-weight: bold;
	}
	.overview .item .value text:nth-of-type(2){
		color: #efefef;
		margin-left: 6rpx;
	}
	.container .content{
		padding: 0 30rpx;
		width: 750rpx;
		box-sizing: border-box;
	}
	.container .content .classes{
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.class-card{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		margin-bottom: 30rpx;
	}
	.class-card:nth-last-of-type(1){
		margin-bottom: 0;
	}
	.class-card .detail{
		flex-grow: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.class-card .detail .name{
		font-weight: bold;
		font-size: 30rpx;
	}
	.class-card .detail .desc{
		font-size: 26rpx;
		color: #a0a0a0;
	}
	.class-card .detail .state{
		font-size: 24rpx;
		margin: 6rpx 0;
		color: #a0a0a0;
		border: 1px solid #a0a0a0;
		border-radius: 10rpx;
		padding: 2rpx 10rpx;
	}
</style>