import { qqSingerCat, qqSingerList, qqSingerSong, qqSingerDetail, qqSingerAlbum, qqAlbumSong, qqSingerMv } from '../qqMusic/singer'
import { ntSingerSong, ntSingerAlbum, ntAlbumSong, ntSingerMv } from '../ntMusic/singer'
import { createSong } from '../../assets/js/song'

export async function singerCat() {
  const { tags } = await qqSingerCat()
  return [{
    title: 'index',
    list: tags.index
  }, {
    title: 'area',
    list: tags.area
  }, {
    title: 'sex',
    list: tags.sex
  }, {
    title: 'genre',
    list: tags.genre
  }]
}

export async function singerList(query, page) {
  const { singerList } = await qqSingerList(query, page)
  const total = singerList.data.total
  const singerlist = singerList.data.singerlist.map((singer) => {
    return {
      singer: singer.singer_name,
      id: singer.singer_mid,
      imgUrl: singer.singer_pic
    }
  })
  return { total, singerlist }
}

export async function singerDetail(id, type) {
  let singer = {}
  if (type === 'qq') {
    const { singer: singer1 } = await qqSingerDetail(id)
    const data = singer1.data
    singer = {
      name: data.singer_info.name,
      brief: data.singer_brief,
      totalSong: data.total_song,
      totalMv: data.total_mv,
      totalAlbum: data.total_album,
      imgUrl: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.webp`
    }
  } else if (type === 'nt') {
    const { artist } = await ntSingerSong(id)
    singer = {
      name: artist.name,
      brief: artist.briefDesc,
      totalSong: Math.min(50, artist.musicSize),
      totalMv: artist.mvSize,
      totalAlbum: artist.albumSize,
      imgUrl: artist.img1v1Url
    }
  }
  return { singer }
}

export async function singerSong(id, pageSize, page, type) {
  let song = []
  if (type === 'qq') {
    const { data } = await qqSingerSong(id, pageSize, page)
    song = data.list.map((s) => {
      const item = s.musicData
      return createSong({
        songId: item.songmid,
        album: {
          name: item.albumname.trim().length > 0 ? item.albumname : '-',
          id: item.albummid || 0
        },
        name: item.songname,
        singer: item.singer.map((s) => {
          return {
            name: s.name,
            id: s.mid
          }
        }).slice(0, 10),
        interval: item.interval,
        imgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.albummid + '.jpg?max_age=2592000',
        mvId: item.vid || 0,
        type: 'qq'
      })
    })
  } else if (type === 'nt') {
    const { hotSongs } = await ntSingerSong(id)
    song = hotSongs.map((item) => {
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
        url: `http://encounter-music.cn:81/api/ntUrl?id=${item.id}`,
        mvId: item.mv,
        type: 'nt'
      })
    }).slice((page - 1) * pageSize, page * pageSize)
  }
  return { song }
}

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export async function singerAlbum(id, type) {
  if (type === 'qq') {
    const { singerAlbum } = await qqSingerAlbum(id)
    return singerAlbum.data.list.map((album) => {
      return {
        id: album.album_mid,
        name: album.album_name.trim().length > 0 ? album.album_name : '-',
        time: album.pub_time,
        creator: album.singers.map((s) => {
          return s.singer_name
        }).join('/'),
        imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${album.album_mid}.jpg?max_age=2592000`,
        type: 'qq'
      }
    })
  } else if (type === 'nt') {
    const { hotAlbums } = await ntSingerAlbum(id)
    return hotAlbums.map((album) => {
      const date = new Date(album.publishTime)
      const updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDay())}`
      return {
        id: album.id,
        name: album.name.trim().length > 0 ? album.name : '-',
        time: updateTime,
        creator: album.artists.map((s) => {
          return s.name
        }).join('/'),
        imgUrl: album.picUrl,
        type: 'nt'
      }
    })
  }
}

export async function albumSong(id, type) {
  let albumInfo = {}
  if (type === 'qq') {
    const { data } = await qqAlbumSong(id)
    albumInfo = {
      name: data.name,
      singer: data.singername,
      tag: data.genre,
      imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg?max_age=2592000`,
      time: data.aDate,
      songs: data.list.map((item) => {
        return createSong({
          songId: item.songmid,
          album: {
            name: item.albumname.trim().length > 0 ? item.albumname : '-',
            id: item.albummid || 0
          },
          name: item.songname,
          singer: item.singer.map((s) => {
            return {
              name: s.name,
              id: s.mid
            }
          }).slice(0, 10),
          interval: item.interval,
          imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg?max_age=2592000`,
          url: `http://encounter-music.cn:99/tencent/url?id=${item.songmid}&isRedirect=1`,
          mvId: item.vid || 0,
          type: 'qq'
        })
      }),
      num: data.total
    }
  } else if (type === 'nt') {
    const { songs, album } = await ntAlbumSong(id)
    const date = new Date(album.publishTime)
    const updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDay())}`
    albumInfo = {
      name: album.name,
      singer: album.artist.name,
      tag: '',
      imgUrl: album.picUrl,
      time: updateTime,
      songs: songs.map((item) => {
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
      }),
      num: album.size
    }
  }
  return { albumInfo }
}

export async function singerMv(id, type, size, page = 0) {
  const list = []
  if (type === 'qq') {
    const { data } = await qqSingerMv(id, size, page)
    data.list.forEach((item) => {
      list.push({
        name: item.title,
        singer: [
          {
            name: item.singer_name,
            id: item.singer_mid
          }],
        publishTime: item.date,
        id: item.vid,
        imgUrl: item.pic,
        type: 'qq'
      })
    })
  } else {
    const { mvs } = await ntSingerMv(id, size, page)
    mvs.forEach((item) => {
      list.push({
        name: item.name,
        singer: [
          {
            name: item.artist.name,
            id: item.artist.id
          }],
        publishTime: item.publishTime,
        id: item.id,
        imgUrl: item.imgurl,
        type: 'nt'
      })
    })
  }
  return list
}
