//工具类
export function formatDate(date, fmt) {
  date = date == undefined ? new Date() : date;
  date = typeof date == 'number' ? new Date(date) : date;
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var obj =
  {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  };
  var week = ['天', '一', '二', '三', '四', '五', '六'];
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
      var val = obj[i] + '';
      if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
      for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
      return m.length == 1 ? val : val.substring(val.length - m.length);
    });
  }
  return fmt;
}

//格式化
export function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
//手机号验证
export function isPhoneNo(phone) {
  var pattern = /^1[34578]\d{9}$/;
  return pattern.test(phone);
}
//倒计时
export function timeOut() {//倒计时
  let self = this;
  self.fetchCodeMsg = true
  let sec = 60;
  for (let i = 0; i <= 60; i++) {
    window.setTimeout(function () {
      if (sec != 0) {
        self.timerCodeMsg = sec + "s后重新发送";
        sec--;
      } else {
        sec = 60;//如果倒计时结束就让重新获取验证码显示出来
        self.timerCodeMsg = "重新获取验证码";
        self.fetchCodeMsg = false
      }
    }, i * 1000)
  }
}

export function encodeHtml(html) {
  return html && html.replace ?
    (
      html.replace(/&/g, "&amp;") //转换&符号
        .replace(/ /g, "&nbsp;") // 转换空格
        .replace(/\b&nbsp;+/g, " ") // 转换多个空格为单个空格
        .replace(/</g, "&lt;") // 转换小于符号
        .replace(/>/g, "&gt;") // 转换大于符号
        .replace(/\\/g, "&#92;") // 转换斜杠符号
        .replace(/\'/g, "&#39;") // 转换单引号
        .replace(/\"/g, "&quot;") // 转换双引号
        .replace(/\n/g, "<br/>") // 转换换行符号
        .replace(/\r/g, "") //转换回车符号
    )
    : html;
}
//防抖封装
export function debounce(fn, delay) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay)
  }
}