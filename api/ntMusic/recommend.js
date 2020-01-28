import axios from 'axios'
export function ntGetSlider() {
  const url = 'http://encounter-music.cn:8080/banner'
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function ntDiscList() {
  const url = 'http://encounter-music.cn:8080/personalized'
  return axios.get(url).then(res => Promise.resolve(res.data))
}

export function ntRecAlbum() {
  const url = 'http://encounter-music.cn:8080/album/newest'
  return axios.get(url).then(res => Promise.resolve(res.data))
}

export function ntRecMV() {
  const url = 'http://encounter-music.cn:8080/personalized/mv'
  return axios.get(url).then(res => Promise.resolve(res.data))
}

export function ntDiscSong(id) {
  const url = 'http://encounter-music.cn:8080/playlist/detail'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
