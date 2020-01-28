function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
export function shuffle(arr) {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandom(0, i)
    const a = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = a
  }
  return _arr
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
