import axios from 'axios'

export function ntHotKey() {
  const url = 'http://encounter-music.cn:8080/search/hot'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntSuggest(key) {
  const url = 'http://encounter-music.cn:8080/search/suggest'
  return axios.get(url, {
    params: {
      keywords: key
    }
  }).then(res => Promise.resolve(res.data))
}

export function ntSearch(key, page, type = 1, size = 20) {
  const url = 'http://encounter-music.cn:8080/search'
  return axios.get(url, {
    params: {
      keywords: key,
      type,
      limit: size,
      offset: page
    }
  }).then(res => Promise.resolve(res.data))
}

export function ntSearchMV(key, page) {
  const url = 'http://encounter-music.cn:8080/search'
  return axios.get(url, {
    params: {
      keywords: key,
      type: 1004,
      limit: 12,
      offset: page
    }
  }).then(res => Promise.resolve(res.data))
}
