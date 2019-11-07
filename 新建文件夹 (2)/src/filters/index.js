/**
 * Created by lonelydawn on 2017-11-20.
 */

// 移除 Faculty of & Department of 等无用词
export const clearLabelSuffix = function (value) {
  return value.replace(/\s*Faculty of\s*/g, '').replace(/\s*Department of\s*/g, '').replace(/\s*Department of\s*/g, '')
}

export const thousandium = function (value) {
  const thorough = function (value) {
    return value.length > 3 ? value.slice(0, 3).concat([',', ...thorough(value.slice(3))]) : value
  }
  if (value) {
    let strs = value.toLocaleString().split('.')
    return thorough(strs[0].split('').reverse()).reverse().concat(strs[1] ? ['.', strs[1]] : []).join('')
  } else {
    return value
  }
}

export const pascal = function (value) {
  let excepts = [
    'of',
    'and',
    'in',
    'to'
  ].concat(
    [
      'PUB',
      'IC',
      'GRAS'
    ]
  )
  return value.split(' ').map(item => excepts.indexOf(item) < 0
    ? item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase() : item)
    .join(' ')
}

export const upperCase = function (value) {
  return typeof value === 'string' ? value.toUpperCase() : value
}

export const lowerCase = function (value) {
  return typeof value === 'string' ? value.toLowerCase() : value
}
