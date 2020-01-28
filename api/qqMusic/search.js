import axios from 'axios'

export function qqSearch(key, page, type) {
  const url = 'http://encounter-music.cn:81/api/search'
  return axios.get(url, {
    params: {
      keywords: key,
      pageSize: 20,
      page,
      type
    }
  }).then(res => Promise.resolve(res.data))
}

export function qqSearchMV(key, page) {
  const url = 'http://encounter-music.cn:81/api/search/mv'
  return axios.get(url, {
    params: {
      keyword: key,
      page
    }
  }).then(res => Promise.resolve(res.data))
}
