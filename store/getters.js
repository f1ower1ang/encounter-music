export const singer = state => state.singer

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const fullScreen = state => state.fullScreen

export const playing = state => state.playing

export const currentSong = state => state.playList[state.currentIndex] || {}

export const currentIndex = state => state.currentIndex

export const favoriteList = state => state.favoriteList

export const playHistory = state => state.playHistory

export const favorDiscList = state => state.favorDiscList

export const favorAlbumList = state => state.favorAlbumList

export const searchHistory = state => state.searchHistory

export const showMsg = state => state.showMsg

export const message = state => state.message

export const user = state => state.user
