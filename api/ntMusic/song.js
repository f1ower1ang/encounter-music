import axios from 'axios'

export function ntLyric(id) {
  const url = 'http://encounter-music.cn:8080/lyric'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
