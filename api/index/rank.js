import { qqGetRank, qqGetMusicList } from '../qqMusic/rank'
import { ntGetRank, ntGetRankSong } from '../ntMusic/rank'
import { createSong } from '../../assets/js/song'

export async function getRank() {
  const data1 = await qqGetRank()
  const data2 = await ntGetRank()
  const num = ['云音乐新歌榜', '云音乐热歌榜', '网易原创歌曲榜', '云音乐飙升榜']
  const qqList = []
  data1.data.topList.forEach((item) => {
    if (item.topTitle.indexOf('巅峰榜') > -1 && item.topTitle.indexOf('MV') === -1) {
      qqList.push({
        id: item.id,
        name: item.topTitle,
        listenNum: item.listenCount,
        songList: item.songList.map((s) => {
          return {
            song: s.songname,
            singer: s.singername
          }
        }),
        imgUrl: item.picUrl,
        type: 'qq'
      })
    }
  })
  const ntList = data2.list.slice(0, 4).map((item) => {
    return {
      id: num.indexOf(item.name),
      name: item.name,
      listenNum: item.subscribedCount,
      songList: item.tracks.map((s) => {
        return {
          song: s.first,
          singer: s.second
        }
      }),
      imgUrl: item.coverImgUrl,
      type: 'nt'
    }
  })
  return { qqList, ntList }
}

// eslint-disable-next-line no-unused-vars
function formalizeSong(songs) {
  const song = []
  songs.forEach((item) => {
    song.push({
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
      imgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.album.mid + '.jpg?max_age=2592000'
    })
  })
}

function _pad(num, n = 2) { // 位数不够添0
  let len = num.toString().length
  if (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export async function getRankSong(id, type) {
  const song = []
  let updateTime = 0
  if (type === 'qq') {
    const test = await qqGetMusicList(id)
    updateTime = test.update_time
    test.songlist.forEach((item) => {
      item = item.data
      song.push(createSong({
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
      }))
    })
  } else {
    const data = await ntGetRankSong(id)
    const date = new Date(data.playlist.updateTime)
    updateTime = `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDate())}`
    data.playlist.tracks.forEach((item) => {
      song.push(createSong({
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
      }))
    })
  }
  return { updateTime, song }
}
