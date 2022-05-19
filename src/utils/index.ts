
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export const parseTime = (time?: Date | string | number, cFormat?: string): string => {
  if (!time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
      date = new Date(time)
    } else {
      date = new Date(time as string)
    }
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  type formats = 'y' | 'm' | 'd' | 'h' | 'i' | 's' | 'a'
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: string, key: formats): string => {
    let value: number = formatObj[key as formats]
    let retstr = '' + value
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      retstr = '0' + value
    }
    return retstr || '0'
  })
  return time_str
}

/**
 * Parse the time Duration (sec) to string
 * @param {(number)} duration
 * @param {(number)} level
 * @returns {string}
 */
export function parseTimeDuration(duration?: number, level?: number): string | null {
  if (!duration) {
    return null
  }
  let ll = level || 2
  const sec = duration % 60
  let min = Math.floor(duration / 60)
  let hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)
  hour = hour % 24
  min = min % 60
  let time_str = ''
  if (day > 0 && ll > 0) {
    time_str += day + '天'
    ll = ll - 1
  }
  if (hour > 0 && ll > 0) {
    time_str += hour + '小时'
    ll = ll - 1
  }
  if (min > 0 && ll > 0) {
    time_str += min + '分钟'
    ll = ll - 1
  }
  if (sec > 0 && ll > 0) {
    time_str += sec + '秒'
  }
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time: number, option: string): string {
  if (('' + time).length === 10) {
    time = parseInt('' + time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now.valueOf() - d.valueOf()) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function humanByteSize(bytes: number) {
  if (bytes === 0) return '0 B'
  var k = 1024
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}