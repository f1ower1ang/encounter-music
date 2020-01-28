import axios from '../assets/js/axios'
import { playMode } from '../assets/js/config'
import { shuffle } from '../assets/js/utils'
import * as types from './mutation-types'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.songId === song.songId
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  let curIndex = index
  if (state.mode === playMode.sequence) {
    commit(types.SET_PLAYLIST, list)
  } else {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    curIndex = findIndex(randomList, list[index])
  }
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, curIndex)
  commit(types.SET_FULLSCREEN, false)
}

export const insertSong = function ({ commit, state }, song) {
  if (state.currentIndex === -1) {
    commit(types.SET_SEQUENCE_LIST, [song])
    commit(types.SET_PLAYLIST, [song])
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULLSCREEN, false)
    commit(types.SET_PLAYING, true)
    return
  }
  const playList = state.playList.slice()
  let currentIndex = state.currentIndex
  const sequenceList = state.sequenceList.slice()

  const currentSong = playList[currentIndex]

  const pIndex = findIndex(playList, song)
  currentIndex++
  if (pIndex > -1) {
    if (pIndex < currentIndex) {
      currentIndex--
    }
    playList.splice(pIndex, 1)
  }
  playList.splice(currentIndex, 0, song)

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  const sIndex = findIndex(sequenceList, song)
  if (sIndex > -1) {
    if (sIndex < currentSIndex) {
      currentSIndex--
    }
    sequenceList.splice(sIndex, 1)
  }
  sequenceList.splice(currentSIndex, 0, song)

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, false)
  commit(types.SET_PLAYING, true)
}

export const allPlay = function ({ commit, state }, { list }) {
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_FULLSCREEN, false)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  if (state.mode === playMode.sequence) {
    commit(types.SET_PLAYLIST, list)
  } else {
    commit(types.SET_PLAYLIST, shuffle(list))
  }
  commit(types.SET_PLAYING, true)
}

export const deleteSong = function ({ commit, state }, song) {
  const playlist = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const pIndex = playlist.findIndex((item) => {
    return item.songId === song.songId
  })
  playlist.splice(pIndex, 1)

  const sIndex = sequenceList.findIndex((item) => {
    return item.songId === song.songId
  })
  sequenceList.splice(sIndex, 1)

  if (pIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)

  const playState = playlist.length > 0
  commit(types.SET_PLAYING, playState)
}

export function nextPlay({ commit, state }, song) {
  if (state.currentIndex === -1) {
    commit(types.SET_SEQUENCE_LIST, [song])
    commit(types.SET_PLAYLIST, [song])
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULLSCREEN, false)
    commit(types.SET_PLAYING, true)
    return
  }

  const playList = state.playList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playList, song)

  if (currentIndex === pIndex) {
    return
  }

  if (pIndex > -1) {
    playList.splice(pIndex, 1)
    if (pIndex < currentIndex) {
      currentIndex--
      commit(types.SET_CURRENT_INDEX, currentIndex)
    }
  }
  const sequenceList = state.sequenceList.slice()
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  const currentSong = playList[currentIndex]

  currentIndex++

  playList.splice(currentIndex, 0, song)

  const currentSIndex = findIndex(sequenceList, currentSong) + 1

  sequenceList.splice(currentSIndex, 0, song)

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
}

export const addToQueue = function ({ commit, state }, song) {
  if (state.currentIndex === -1) {
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_PLAYLIST, [song])
    commit(types.SET_SEQUENCE_LIST, [song])
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, false)
  }
  const playlist = state.playList.slice()
  const pIndex = findIndex(playlist, song)
  if (pIndex > -1) {
    playlist.splice(pIndex, 1)
  }
  playlist.push(song)
  if (pIndex === state.currentIndex) {
    commit(types.SET_CURRENT_INDEX, playlist.length - 1)
  }
  const sequenceList = state.sequenceList.slice()
  const sIndex = findIndex(sequenceList, song)
  if (sIndex === -1) {
    sequenceList.push(song)
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
}

export const clearPlaylist = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING, false)
  commit(types.SET_FULLSCREEN, false)
}

export const displayMsg = function ({ commit }, { flag, msg }) {
  commit(types.SET_MESSAGE, msg)
  commit(types.SET_SHOW_MSG, flag)
}

export const getUser = function ({ commit, state }) {
  if (state.user) {
    return
  }
  const url = 'http://encounter-music.cn:8080/login/status'

  axios.post(url).then((res) => {
    if (res.data.code === 200) {
      const data = res.data
      const user = {
        userId: data.profile.userId,
        nickname: data.profile.nickname,
        avatar: data.profile.avatarUrl
      }
      commit(types.SET_USER, user)
    } else {
      commit(types.SET_USER, null)
    }
  }).catch((e) => {
    console.log(e)
  })
}
