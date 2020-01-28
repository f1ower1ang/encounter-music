import axios from 'axios'
import { qqMvInfo } from '../qqMusic/mv'
import { ntMvInfo } from '../ntMusic/mv'

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export async function mvInfo(id, type) {
  let info = {}
  const list = []
  const brs = []
  if (type === 'qq') {
    const { mvinfo, other } = await qqMvInfo(id)
    const { data } = await axios.get(`http://encounter-music.cn:81/api/qqMvUrl?id=${id}&redirect=0`)
    const mv = mvinfo.data[id]
    const date = new Date(mv.pubdate)
    const publishTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDate())}`
    info = {
      name: mv.name,
      id: mv.vid,
      imgUrl: mv.cover_pic,
      interval: mv.duration,
      playNum: mv.playcnt,
      publishTime,
      singer: mv.singers.map((s) => {
        return {
          id: s.mid,
          name: s.name
        }
      }),
      type: 'qq'
    }
    const li = data.mp4.slice(1)
    li.forEach((item, index) => {
      if (item.freeflow_url.length > 0) {
        switch (index) {
          case 0:
            brs.push('240')
            break
          case 1:
            brs.push('480')
            break
          case 2:
            brs.push('720')
            break
          case 3:
            brs.push('1080')
        }
      }
    })
    other.data.list.forEach((item) => {
      list.push({
        name: item.name,
        id: item.vid,
        imgUrl: item.cover_pic,
        type: 'qq'
      })
    })
  } else {
    const { data } = await ntMvInfo(id)
    info = {
      name: data.name,
      id: data.id,
      imgUrl: data.cover,
      interval: Math.floor(data.duration / 1000),
      playNum: data.playCount,
      publishTime: data.publishTime,
      singer: data.artists,
      type: 'nt'
    }
    for (const k in data.brs) {
      brs.push(k)
    }
    data.mvs.forEach((item) => {
      list.push({
        name: item.name,
        id: item.id,
        imgUrl: item.cover,
        type: 'nt'
      })
    })
  }
  return { info, list, brs }
}
