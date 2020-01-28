import axios from 'axios'
import { ntLyric } from '../ntMusic/song'
import { qqLyric } from '../qqMusic/song'

export async function lyric(id, type) {
  let lyric = ''
  if (type === 'qq') {
    lyric = await qqLyric(id)
  } else {
    const { lrc } = await ntLyric(id)
    lyric = lrc.lyric
  }
  return { lyric }
}

export async function songDetail(id) {
  const url = 'http://encounter-music.cn:8080/song/detail'
  const data = await axios.get(url, {
    params: {
      ids: id
    }
  })
  const item = data.data.songs[0]
  return {
    name: item.name,
    songId: item.id,
    album: {
      name: item.al.name.trim().length > 0 ? item.al.name : '-',
      id: item.al.id || 0
    },
    singer: item.ar.map((s) => {
      return {
        name: s.name,
        id: s.id
      }
    }).slice(0, 10),
    interval: Math.floor(item.dt / 1000),
    imgUrl: item.al.picUrl,
    mvId: item.mv,
    type: 'nt'
  }
}
