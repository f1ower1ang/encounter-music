import { ntGetSlider, ntDiscList, ntDiscSong, ntRecAlbum, ntRecMV } from '../ntMusic/recommend'
import { qqDiscCat, qqDiscList, qqDiscSong, qqRecAlbum, qqRecMV } from '../qqMusic/recommend'
import { createSong } from '../../assets/js/song'

export async function getSlider() {
  let sliders = []
  const condition = [1, 10, 100, 1000, 1004]
  const { banners, code } = await ntGetSlider()
  sliders = banners.slice().filter((s) => {
    return condition.indexOf(s.targetType) > -1
  }).map((slider) => {
    return {
      targetType: slider.targetType,
      imgUrl: slider.imageUrl + '?param=523y191',
      id: slider.targetId
    }
  })
  return { sliders, code }
}

export async function getDicCat() {
  const { data, code } = await qqDiscCat()
  const dicCat = []
  data.categories.slice(1).forEach((item) => {
    dicCat.push({
      title: item.categoryGroupName,
      items: item.items.map((i) => {
        return {
          name: i.categoryName,
          id: i.categoryId
        }
      })
    })
  })
  return { dicCat, code }
}

export async function getHotCat() {
  const { data, code } = await qqDiscCat()
  let dicCat = []
  const hotCat = []
  const cats = ['励志', '快乐', '学习', '民谣', '网络歌曲', 'KTV热歌', '治愈', '轻音乐', '经典', '睡前', '情歌', '安静', '运动', '英语', '影视']
  data.categories.slice(1).forEach((item) => {
    dicCat = dicCat.concat(item.items.map((i) => {
      return {
        name: i.categoryName,
        id: i.categoryId
      }
    }))
  })
  dicCat.forEach((item) => {
    if (cats.findIndex(cat => cat === item.name) !== -1) {
      hotCat.push(item)
    }
  })
  return { hotCat, code }
}

export async function getRecDisc() {
  const { result } = await ntDiscList()
  const discList = []
  result.slice(0, 12).forEach((list) => {
    discList.push({
      name: list.name,
      creator: list.copywriter,
      discId: list.id,
      imgUrl: list.picUrl,
      listenNum: list.playCount,
      type: 'nt'
    })
  })
  return discList
}

export async function getRecMV() {
  const { data } = await qqRecMV()
  const { result } = await ntRecMV()
  const ntMV = []; const qqMV = []; const mv = []
  data.mvlist.slice(0, 8).forEach((item) => {
    qqMV.push({
      name: item.mvtitle,
      playNum: item.listennum,
      id: item.vid,
      imgUrl: item.picurl,
      type: 'qq'
    })
  })
  result.slice(0, 4).forEach((item) => {
    ntMV.push({
      name: item.name,
      playNum: item.playCount,
      id: item.id,
      imgUrl: item.picUrl,
      type: 'nt'
    })
  })

  for (let i = 0; i < qqMV.length; i++) {
    if (qqMV[i]) {
      mv.push(qqMV[i])
    }
    if (ntMV[i]) {
      mv.push(ntMV[i])
    }
  }
  return mv
}

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export async function getRecAlbum() {
  const qqAlbum = []; const ntAlbum = []; const album = []
  // eslint-disable-next-line camelcase
  const { new_album } = await qqRecAlbum()
  const { albums } = await ntRecAlbum()
  new_album.data.albums.slice(0, 6).forEach((album) => {
    qqAlbum.push({
      id: album.mid,
      name: album.name.trim().length > 0 ? album.name : '-',
      time: album.release_time,
      creator: album.singers.map((s) => {
        return s.name
      }).join('/'),
      imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${album.mid}.jpg?max_age=2592000`,
      type: 'qq'
    })
  })
  albums.slice(0, 6).forEach((album) => {
    const date = new Date(album.publishTime)
    const updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDay())}`
    ntAlbum.push({
      id: album.id,
      name: album.name.trim().length > 0 ? album.name : '-',
      time: updateTime,
      creator: album.artists.map((s) => {
        return s.name
      }).join('/'),
      imgUrl: album.picUrl,
      type: 'nt'
    })
  })

  for (let i = 0; i < ntAlbum.length; i++) {
    if (ntAlbum[i]) {
      album.push(ntAlbum[i])
    }
    if (qqAlbum[i]) {
      album.push(qqAlbum[i])
    }
  }
  return album
}

export async function getDicList(id, size, page) {
  const { data } = await qqDiscList(id, size, page)
  const code = 200
  const discList = {
    sum: 0,
    lists: []
  }
  discList.sum = data.sum
  data.list.forEach((item) => {
    discList.lists.push({
      name: item.dissname,
      creator: item.creator.name,
      discId: item.dissid,
      imgUrl: item.imgurl,
      listenNum: item.listennum,
      type: 'qq'
    })
  })
  return { discList, code }
}

export async function getDiscSong(id, type) {
  if (type === 'qq') {
    const { cdlist } = await qqDiscSong(id)
    const data = cdlist
    const code = 200
    const discSong = {
      name: data[0].dissname,
      creator: data[0].nickname,
      imgUrl: data[0].logo,
      count: data[0].total_song_num,
      desc: data[0].desc,
      tag: data[0].tags.map((item) => {
        return {
          name: item.name
        }
      }),
      songs: data[0].songlist.map((item) => {
        return createSong({
          songId: item.mid,
          album: {
            name: item.album.name.trim().length > 0 ? item.album.name : '-',
            id: item.album.mid || 0
          },
          name: item.name,
          singer: item.singer.map((s) => {
            return {
              name: s.name,
              id: s.mid
            }
          }).slice(0, 10),
          interval: item.interval,
          imgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.album.mid + '.jpg?max_age=2592000',
          mvId: item.mv.vid || 0,
          type: 'qq'
        })
      })
    }
    return { discSong, code }
  } else if (type === 'nt') {
    const { playlist, code } = await ntDiscSong(id)
    const discSong = {
      name: playlist.name,
      creator: playlist.creator.nickname,
      imgUrl: playlist.coverImgUrl,
      count: playlist.trackCount,
      desc: playlist.description,
      tag: playlist.tags.map((name) => {
        return {
          name
        }
      }),
      songs: playlist.tracks.map((item) => {
        return createSong({
          songId: item.id,
          album: {
            name: item.al.name.trim().length > 0 ? item.al.name : '-',
            id: item.al.id || 0
          },
          name: item.name,
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
        })
      })
    }
    return { discSong, code }
  }
}
