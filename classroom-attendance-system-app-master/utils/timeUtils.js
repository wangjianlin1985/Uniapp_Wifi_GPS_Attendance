export function getDate(dateidx){
	switch(dateidx){
		case 0:
			return "星期一"
		case 1:
			return "星期二"
		case 2:
			return "星期三"
		case 3:
			return "星期四"
		case 4:
			return "星期五"
		case 5:
			return "星期六"
		case 6:
			return "星期日"
		default:
			throw new SyntaxError()
	}
}

// 输入一个HH:mm:ss的时间，返回HH:mm
export function getHourMinute(time){
	if(/^[0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/.test(time)){
		return time.replace(/:[0-6][0-9]$/,"")
	}else
		throw new SyntaxError()
}

export function GetMonday(date) {
	let dd = new Date(date)
	let week = dd.getDay();
	let minus = week ? week - 1 : 6;
	dd.setDate(dd.getDate() - minus);
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
	let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
	return y + "-" + m + "-" + d;
}

export function GetSunday(date) {
	let dd = new Date(date)
	let week = dd.getDay();
	let minus = week ? week - 1 : 6;
	dd.setDate(dd.getDate() - minus);
	dd.setDate(dd.getDate()+6)
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
	let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
	return y + "-" + m + "-" + d;
}

/*
 * 判断现在是否在本周的上课时间
 * date: 星期 0-6
 * begin: 开始时间
 * end: 结束时间
 */
export function isInClassTime(date,begin,end){
	let monday = GetMonday(new Date())
	let targetBeginTime = new Date(monday)
	targetBeginTime.setDate(targetBeginTime.getDate() + date)
	targetBeginTime.setHours(begin.match(/^[0-2][0-9]/)[0])
	targetBeginTime.setMinutes(begin.match(/(?<=:)[0-6][0-9](?=:)/)[0])
	let targetEndTime = new Date(monday)
	targetEndTime.setDate(targetEndTime.getDate() + date)
	targetEndTime.setHours(end.match(/^[0-2][0-9]/)[0])
	targetEndTime.setMinutes(end.match(/(?<=:)[0-6][0-9](?=:)/)[0])
	let now = new Date()
	if(now >= targetBeginTime && now <= targetEndTime)
		return true
	else
		return false
}

// 判断课程是否是今天的
export function isTodayClass(date){
	let monday = GetMonday(new Date())
	let targetDay = new Date(monday)
	targetDay.setDate(targetDay.getDate() + date)
	let nextDay = new Date(targetDay)
	nextDay.setDate(nextDay.getDate() + 1)
	let now = new Date()
	if(now >= targetDay && now < nextDay)
		return true
	else
		return false
}