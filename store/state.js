import { playMode } from '../assets/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  favoriteList: [],
  playHistory: [],
  favorDiscList: [],
  favorAlbumList: [],
  searchHistory: [],
  showMsg: false,
  message: '',
  user: null
}

export default state
