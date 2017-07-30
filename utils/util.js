function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + 'T' + [hour, minute, second].map(formatNumber).join(':') + 'Z'
}

function getDateTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  
  return [year, month, day].map(formatNumber).join('-');
}

function getTime(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

function getWeek(date) {
  var week = date.getDay();
  var str = '';
  switch(week) {
    case 0:
      str = '周日';
      break;
    case 1:
      str = '周一';
      break;
    case 2:
      str = '周二';
      break;
    case 3:
      str = '周三';
      break;
    case 4:
      str = '周四';
      break;
    case 5:
      str = '周五';
      break;
    case 6:
      str = '周六';
      break;
  }
  return str;
}

function timeDiff (t1, t2) {
  var t1_long = t1.getTime();
  var t2_long = t2.getTime();
  // 相差的秒数
  var total = (t2_long - t1_long) / 1000;
  var day = parseInt(total / (24*60*60)); // 计算整天数
  var afterDay = total % (24 * 60 * 60);
  var hour = parseInt(afterDay / (60*60)); // 计算小时数
  var afterHour = afterDay % (60*60);
  var minute = parseInt(afterHour / 60); // 计算分钟数
  var second = parseInt(afterHour % 60); // 得到秒数
  
  // return [day , formatNumber(hour), formatNumber(minute), formatNumber(second)]
  return [hour, minute, second].map(formatNumber).join(':')
}

function getDiffMinute(t1_long, t2_long) {
  return parseInt((t2_long - t1_long) / (1000 * 60)); 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getDate: getDate,
  getWeek: getWeek,
  getDateTime: getDateTime,
  getTime: getTime,
  timeDiff: timeDiff,
  getDiffMinute: getDiffMinute,
  formatNumber: formatNumber,
}
