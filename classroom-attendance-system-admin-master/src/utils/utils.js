export function changePageTitle(title,separator = true){
  document.title = `课程考勤管理系统${separator ? ' - ' : ' '}${title}`
}

// 将星期id转换为汉字
export function dateIdToName(id){
  switch(id){
    case 0:
      return '星期一'
    case 1:
      return '星期二'
    case 2:
      return '星期三'
    case 3:
      return '星期四'
    case 4:
      return '星期五'
    case 5:
      return '星期六'
    case 6:
      return '星期日'
    default:
      return null
  }
}

// 将签到规则ID转化为汉字
export function conditionIdToName(id){
  switch(id){
    case 0:
      return '无限制'
    case 1:
      return '定位签到'
    case 2:
      return 'Wifi签到'
    case 3:
      return '定位 + Wifi签到'
    default:
      return null
  }
}