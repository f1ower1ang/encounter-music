import { ntHotKey, ntSuggest, ntSearch, ntSearchMV } from '../ntMusic/search'
import { qqSearch, qqSearchMV } from '../qqMusic/search'
import { createSong } from '../../assets/js/song'

export async function hotKey() {
  const { result } = await ntHotKey()
  return result.hots.map(k => k.first)
}

export async function suggest(key) {
  const { result } = await ntSuggest(key)
  const ret = []
  if (result.songs) {
    ret.push({
      title: '歌曲',
      path: '/search',
      type: 'song',
      list: result.songs.map((item) => {
        return {
          name: item.name + ' - ' + item.artists.map(s => s.name).join('/')
        }
      })
    })
  }
  if (result.albums) {
    ret.push({
      title: '专辑',
      path: '/singer/detail/album',
      type: 'album',
      list: result.albums.map((item) => {
        return {
          name: item.name,
          id: item.id,
          type: 'nt'
        }
      })
    })
  }
  if (result.playlists) {
    ret.push({
      title: '歌单',
      path: '/discSong',
      type: 'disc',
      list: result.playlists.map((item) => {
        return {
          name: item.name,
          id: item.id,
          type: 'nt',
          imgUrl: item.coverImgUrl
        }
      })
    })
  }
  if (result.artists) {
    ret.push({
      title: '歌手',
      path: '/singer/detail',
      type: 'singer',
      list: result.artists.map((item) => {
        return {
          name: item.name,
          id: item.id,
          type: 'nt',
          imgUrl: item.img1v1Url
        }
      })
    })
  }
  return { ret }
}

export async function searchSong(key, page) {
  const nt = await ntSearch(key, page - 1)
  const qq = await qqSearch(key, page, 'song')
  let qqSong = []
  let ntSong = []
  let qqNum = 0
  let ntNum = 0
  if (qq.code === 0) {
    const data2 = qq.data
    qqNum = data2.song.totalnum
    if (data2.song.list) {
      qqSong = data2.song.list.map((item) => {
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
  }
  if (nt.code === 200) {
    const data1 = nt.result
    ntNum = data1.songCount
    if (data1.songs) {
      ntSong = data1.songs.map((item) => {
        return createSong({
          songId: item.id,
          album: {
            name: item.album.name.trim().length > 0 ? item.album.name : '-',
            id: item.album.id || 0
          },
          name: item.name,
          singer: item.artists.map((s) => {
            return {
              name: s.name,
              id: s.id
            }
          }).slice(0, 10),
          interval: Math.floor(item.duration / 1000),
          imgUrl: `http://encounter-music.cn:81/api/ntImg?id=${item.id}`,
          mvId: item.mvid,
          type: 'nt'
        })
      })
    }
  }
  const count = (ntNum + qqNum) > 0 ? (ntNum + qqNum) : -1
  const song = []
  for (let i = 0; i < Math.max(qqSong.length, ntSong.length); i++) {
    if (qqSong[i]) {
      song.push(qqSong[i])
    }
    if (ntSong[i]) {
      song.push(ntSong[i])
    }
  }
  return { song, count }
}

// export async function searchSinger(key, page) {
//   // let singer = []
//   const singer = []
//   let count = 0
//   if (page === 0) {
//     const qq = await qqSearch(key, page, 'singer')
//     if (qq.code === 0 && qq.data.zhida && qq.data.zhida.zhida_singer) {
//       const s = qq.data.zhida.zhida_singer
//       singer.push({
//         singer: s.singerName,
//         id: s.singerMID,
//         imgUrl: s.singerPic,
//         type: 'qq'
//       })
//       count++
//     }
//   }
//   // const nt = await ntSearch(key, page, 100, 40)
//   // if (nt.code === 200) {
//   //   const result = nt.result
//   //   count += result.artistCount
//   //   if (result.artists) {
//   //     singer = singer.concat(result.artists.map((item) => {
//   //       const imgUrl = item.img1v1Url.match('5639395138885805.jpg') ? 'http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=130y130' : item.img1v1Url
//   //       return {
//   //         singer: item.name,
//   //         id: item.id,
//   //         imgUrl,
//   //         type: 'nt'
//   //       }
//   //     }))
//   //   }
//   // }
//   count = count > 0 ? count : -1
//   return { singer, count }
// }

export async function searchSinger(key, page) {
  let singer = []
  let count = 0
  if (page === 0) {
    const qq = await qqSearch(key, page, 'singer')
    if (qq.code === 0 && qq.data.zhida && qq.data.zhida.zhida_singer) {
      const s = qq.data.zhida.zhida_singer
      singer.push({
        singer: s.singerName,
        id: s.singerMID,
        imgUrl: s.singerPic,
        type: 'qq'
      })
      count++
    }
  }
  const nt = await ntSearch(key, page, 100, 40)
  if (nt.code === 200) {
    const result = nt.result
    count += result.artistCount
    if (result.artists) {
      singer = singer.concat(result.artists.map((item) => {
        const imgUrl = item.img1v1Url.match('5639395138885805.jpg') ? 'http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=130y130' : item.img1v1Url
        return {
          singer: item.name,
          id: item.id,
          imgUrl,
          type: 'nt'
        }
      }))
    }
  }
  count = count > 0 ? count : -1
  return { singer, count }
}

// export async function searchDisc(key, page) {
//   const qq = await qqSearch(key, page, 'playlist')
//   // const nt = await ntSearch(key, page, 1000)
//   let qqDisc = []
//   let qqNum = 0
//   // let ntNum = 0
//   // let ntDisc = []
//   if (qq.code === 0) {
//     const data = qq.data
//     qqNum = data.display_num
//     if (data.list) {
//       qqDisc = data.list.map((item) => {
//         return {
//           name: item.dissname,
//           creator: item.creator.name,
//           discId: item.dissid,
//           imgUrl: item.imgurl,
//           listenNum: item.listennum,
//           type: 'qq'
//         }
//       })
//     }
//   }
//   // if (nt.code === 200) {
//   //   const result = nt.result
//   //   ntNum = result.playlistCount
//   //   if (result.playlists) {
//   //     ntDisc = result.playlists.map((item) => {
//   //       return {
//   //         name: item.name,
//   //         creator: item.creator.nickname,
//   //         discId: item.id,
//   //         imgUrl: item.coverImgUrl,
//   //         listenNum: item.playCount,
//   //         type: 'nt'
//   //       }
//   //     })
//   //   }
//   // }
//   const disc = qqDisc
//   // for (let i = 0; i < Math.max(qqDisc.length, ntDisc.length); i++) {
//   //   if (qqDisc[i]) {
//   //     disc.push(qqDisc[i])
//   //   }
//   //   if (ntDisc[i]) {
//   //     disc.push(ntDisc[i])
//   //   }
//   // }
//   // const count = (qqNum + ntNum) > 0 ? (qqNum + ntNum) : -1
//   const count = qqNum > 0 ? qqNum : -1
//   return { disc, count }
// }

export async function searchDisc(key, page) {
  const qq = await qqSearch(key, page, 'playlist')
  const nt = await ntSearch(key, page, 1000)
  let qqDisc = []
  let qqNum = 0
  let ntNum = 0
  let ntDisc = []
  if (qq.code === 0) {
    const data = qq.data
    qqNum = data.display_num
    if (data.list) {
      qqDisc = data.list.map((item) => {
        return {
          name: item.dissname,
          creator: item.creator.name,
          discId: item.dissid,
          imgUrl: item.imgurl,
          listenNum: item.listennum,
          type: 'qq'
        }
      })
    }
  }
  if (nt.code === 200) {
    const result = nt.result
    ntNum = result.playlistCount
    if (result.playlists) {
      ntDisc = result.playlists.map((item) => {
        return {
          name: item.name,
          creator: item.creator.nickname,
          discId: item.id,
          imgUrl: item.coverImgUrl,
          listenNum: item.playCount,
          type: 'nt'
        }
      })
    }
  }
  const disc = []
  for (let i = 0; i < Math.max(qqDisc.length, ntDisc.length); i++) {
    if (qqDisc[i]) {
      disc.push(qqDisc[i])
    }
    if (ntDisc[i]) {
      disc.push(ntDisc[i])
    }
  }
  const count = (qqNum + ntNum) > 0 ? (qqNum + ntNum) : -1
  return { disc, count }
}

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

// export async function searchAlbum(key, page) {
//   const qq = await qqSearch(key, page + 1, 'album')
//   // const nt = await ntSearch(key, page + 1, 10)
//   let qqAlbum = []
//   let qqNum = 0
//   if (qq.code === 0) {
//     const data = qq.data
//     qqNum = data.album.totalnum
//     if (data.album.list) {
//       qqAlbum = data.album.list.map((album) => {
//         return {
//           id: album.albumMID,
//           name: album.albumName.trim().length > 0 ? album.albumName : '-',
//           time: album.publicTime,
//           creator: album.singer_list.map((s) => {
//             return s.name
//           }).join('/'),
//           imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${album.albumMID}.jpg?max_age=2592000`,
//           type: 'qq'
//         }
//       })
//     }
//   }
//   // let ntAlbum = []
//   // let ntNum = 0
//   // if (nt.code === 200) {
//   //   const result = nt.result
//   //   ntNum = result.albumCount
//   //   if (result.albums) {
//   //     ntAlbum = result.albums.map((album) => {
//   //       const date = new Date(album.publishTime)
//   //       const updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDay())}`
//   //       return {
//   //         id: album.id,
//   //         name: album.name.trim().length > 0 ? album.name : '-',
//   //         time: updateTime,
//   //         creator: album.artist.name,
//   //         imgUrl: album.picUrl,
//   //         type: 'nt'
//   //       }
//   //     })
//   //   }
//   // }
//   const album = qqAlbum
//   // for (let i = 0; i < Math.max(qqAlbum.length, ntAlbum.length); i++) {
//   //   if (qqAlbum[i]) {
//   //     album.push(qqAlbum[i])
//   //   }
//   //   if (ntAlbum[i]) {
//   //     album.push(ntAlbum[i])
//   //   }
//   // }
//   // const count = (qqNum + ntNum) > 0 ? qqNum + ntNum : -1
//   const count = qqNum > 0 ? qqNum : -1
//   return { album, count }
// }

export async function searchAlbum(key, page) {
  const qq = await qqSearch(key, page + 1, 'album')
  const nt = await ntSearch(key, page + 1, 10)
  let qqAlbum = []
  let qqNum = 0
  if (qq.code === 0) {
    const data = qq.data
    qqNum = data.album.totalnum
    if (data.album.list) {
      qqAlbum = data.album.list.map((album) => {
        return {
          id: album.albumMID,
          name: album.albumName.trim().length > 0 ? album.albumName : '-',
          time: album.publicTime,
          creator: album.singer_list.map((s) => {
            return s.name
          }).join('/'),
          imgUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${album.albumMID}.jpg?max_age=2592000`,
          type: 'qq'
        }
      })
    }
  }
  let ntAlbum = []
  let ntNum = 0
  if (nt.code === 200) {
    const result = nt.result
    ntNum = result.albumCount
    if (result.albums) {
      ntAlbum = result.albums.map((album) => {
        const date = new Date(album.publishTime)
        const updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDay())}`
        return {
          id: album.id,
          name: album.name.trim().length > 0 ? album.name : '-',
          time: updateTime,
          creator: album.artist.name,
          imgUrl: album.picUrl,
          type: 'nt'
        }
      })
    }
  }
  const album = []
  for (let i = 0; i < Math.max(qqAlbum.length, ntAlbum.length); i++) {
    if (qqAlbum[i]) {
      album.push(qqAlbum[i])
    }
    if (ntAlbum[i]) {
      album.push(ntAlbum[i])
    }
  }
  const count = (qqNum + ntNum) > 0 ? qqNum + ntNum : -1
  return { album, count }
}

export async function searchMV(key, page) {
  const qqMV = []
  const ntMV = []
  const mv = []
  const { data } = await qqSearchMV(key, page + 1)
  const { result } = await ntSearchMV(key, page)
  const total = data.mv.totalnum + result.mvCount
  if (data.mv.list.length > 0) {
    data.mv.list.forEach((item) => {
      qqMV.push({
        name: item.mv_name,
        id: item.v_id,
        playNum: item.play_count,
        imgUrl: item.mv_pic_url,
        type: 'qq',
        singer: item.singer_list.map((s) => {
          return {
            name: s.name,
            id: s.mid
          }
        })
      })
    })
  }
  if (page <= result.mvCount / 12) {
    result.mvs.forEach((item) => {
      ntMV.push({
        name: item.name,
        id: item.id,
        playNum: item.playCount,
        imgUrl: item.cover,
        type: 'nt',
        singer: item.artists.map((s) => {
          return {
            name: s.name,
            id: s.mid
          }
        })
      })
    })
  }
  const len = Math.max(ntMV.length, qqMV.length)
  for (let i = 0; i < len; i++) {
    if (ntMV[i]) {
      mv.push(ntMV[i])
    }
    if (qqMV[i]) {
      mv.push(qqMV[i])
    }
  }
  return { total, mv }
}
