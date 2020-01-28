import axios from 'axios'

export function ntGetRank() {
  const url = 'http://encounter-music.cn:8080/toplist/detail'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntGetRankSong(ntId) {
  const url = 'http://encounter-music.cn:8080/top/list'
  return axios.get(url, {
    params: {
      idx: ntId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
