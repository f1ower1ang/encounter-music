import axios from 'axios'

export function qqMvInfo(id) {
  const url = 'http://encounter-music.cn:81/api/mvInfo'
  return axios.get(url, {
    params: {
      id
    }
  }).then(res => Promise.resolve(res.data))
}
