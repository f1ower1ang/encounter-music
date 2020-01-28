import axios from 'axios'
export function qqDiscCat() {
  const url = 'http://encounter-music.cn:81/api/disCat'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqRecAlbum() {
  const url = 'http://encounter-music.cn:81/api/recAlbum'
  return axios.get(url).then(res => Promise.resolve(res.data))
}

export function qqRecMV() {
  const url = 'http://encounter-music.cn:81/api/recMv'
  return axios.get(url).then(res => Promise.resolve(res.data))
}

export function qqDiscList(id, size, page) {
  const url = 'http://encounter-music.cn:81/api/discList'
  return axios.get(url, {
    params: {
      categoryId: id,
      pageSize: size,
      page
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqDiscSong(id) {
  const url = 'http://encounter-music.cn:81/api/discSong'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
