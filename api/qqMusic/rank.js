import axios from 'axios'

export function qqGetRank() {
  const url = 'http://encounter-music.cn:81/api/rankList'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqGetMusicList(id) {
  const url = 'http://encounter-music.cn:81/api/rankSong'

  return axios.get(url, {
    params: {
      id
    }
  }).then(res => Promise.resolve(res.data))
}
