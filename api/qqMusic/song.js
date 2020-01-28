import axios from 'axios'

export function qqLyric(id) {
  const url = 'http://encounter-music.cn:81/api/lyric'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
