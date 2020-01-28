import { lyric } from '../../api/index/song'

export default class Song {
  constructor({ songId, album, name, singer, interval, imgUrl, url, mvId, type }) {
    this.songId = songId
    this.album = album
    this.name = name
    this.interval = interval
    this.singer = singer
    this.imgUrl = imgUrl
    this.url = url
    this.type = type
    this.mvId = mvId
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      lyric(this.songId, this.type).then((res) => {
        if (res.lyric.trim().length > 0 && !res.lyric.match('纯音乐')) {
          this.lyric = res.lyric
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('此处为没有填词的纯音乐，请欣赏')
        }
      })
    })
  }
}

export function createSong(song) {
  const url = song.type === 'nt' ? `http://encounter-music.cn:81/api/ntUrl?id=${song.songId}` : `http://encounter-music.cn:81/api/qqRedirect?id=${song.songId}`
  return new Song({
    songId: song.songId,
    album: song.album,
    name: song.name,
    interval: song.interval,
    singer: song.singer,
    imgUrl: song.imgUrl,
    url,
    type: song.type,
    mvId: song.mvId
  })
}
