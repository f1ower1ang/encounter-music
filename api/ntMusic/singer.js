import axios from 'axios'

export function ntSingerSong(id) {
  const url = 'http://encounter-music.cn:8080/artists'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntSingerAlbum(id) {
  const url = 'http://encounter-music.cn:8080/artist/album'
  return axios.get(url, {
    params: {
      id,
      limit: 1000
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntAlbumSong(id) {
  const url = 'http://encounter-music.cn:8080/album'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntSingerMv(id, limit, offset) {
  const url = 'http://encounter-music.cn:8080/artist/mv'
  return axios.get(url, {
    params: {
      id,
      limit,
      offset
    }
  }).then(res => Promise.resolve(res.data))
}
