import axios from 'axios'

export async function qqSingerCat() {
  const sort = {
    area: -100,
    genre: -100,
    sex: -100,
    index: -100
  }
  const { singerList } = await qqSingerList(sort, 0)
  return Promise.resolve({ tags: singerList.data.tags })
}

export function qqSingerList(sort, page) {
  const url = 'http://encounter-music.cn:81/api/singerList'
  return axios.get(url, {
    params: {
      area: sort.area,
      genre: sort.genre,
      sex: sort.sex,
      index: sort.index,
      page
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqSingerSong(id, pageSize, page) {
  const url = 'http://encounter-music.cn:81/api/singerSong'
  return axios.get(url, {
    params: {
      id,
      page,
      pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqSingerDetail(id) {
  const url = 'http://encounter-music.cn:81/api/singerDetail'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqSingerAlbum(id) {
  const url = 'http://encounter-music.cn:81/api/singerAlbum'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqAlbumSong(id) {
  const url = 'http://encounter-music.cn:81/api/albumSong'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function qqSingerMv(id, pageSize, page) {
  const url = 'http://encounter-music.cn:81/api/singerMv'
  return axios.get(url, {
    params: {
      id,
      pageSize,
      page
    }
  }).then(res => Promise.resolve(res.data))
}
