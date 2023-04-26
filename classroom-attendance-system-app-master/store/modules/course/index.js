export default {
	namespaced:true,
	state:{
		selectedCourses:[],
		todayAllSignedCourses: [], // 今日所有已签到课程
	},
	mutations:{
		changeSelectedCourses(state,payload){
			state.selectedCourses = payload
		},
		changeTodayAllSignedCourses(state,payload){
			state.todayAllSignedCourses = payload
		}
	},
	getters:{
		todayAllSignedCoursesCount(state){
			return state.todayAllSignedCourses.length
		}
	}
}