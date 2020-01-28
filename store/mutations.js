import { createSong } from '../assets/js/song'
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list.map(s => createSong(s))
  },
  [types.SET_PLAY_HISTORY](state, list) {
    state.playHistory = list.map(s => createSong(s))
  },
  [types.SET_FAVOR_DISC_LIST](state, list) {
    state.favorDiscList = list
  },
  [types.SET_FAVOR_ALBUM_LIST](state, list) {
    state.favorAlbumList = list
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list
  },
  [types.SET_SHOW_MSG](state, flag) {
    state.showMsg = flag
  },
  [types.SET_MESSAGE](state, msg) {
    state.message = msg
  },
  [types.SET_USER](state, user) {
    state.user = user
  }
}

export default mutations
