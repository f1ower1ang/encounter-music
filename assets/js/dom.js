export function hasClass(el, className) { // 判断当前元素是否包含某类名
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')

  return reg.test(el.className)
}

export function addClass(el, className) { // 给元素添加类名
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')

  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) { // 获取元素自定义属性值
  const prefix = 'data-'

  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } return el.getAttribute(name)
}

function vendor() {
  const elementStyle = document.createElement('div').style,
    transfroms = {
      'webkit': 'webkitTransform',
      'Moz': 'MozTransform',
      'O': 'OTransform',
      'ms': 'msTransform',
      'standard': 'standard'
    }

  for (const key in transfroms) {
    if (elementStyle[transfroms[key]] !== undefined) {
      return key
    }
  }
  return false
}

export function prefixStyle(style) { // 更加浏览器兼容性添加属性名前缀
  if (!vendor()) {
    return false
  }
  if (vendor() === 'standard') {
    return style
  }
  return vendor() + style.charAt(0).toUpperCase() + style.substr(1)
}
