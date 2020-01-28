const historyKey = '__history__'
const favoriteKey = '__favorite__'
const playHistoryKey = '__play_history__'
const favorDiscKey = '__favor_disc__'
const favorAlbumKey = '__favor_album__'
const searchHistoryKey = '__search_history__'
const MAX = 15

function insertQuery(lists, query, compare, maxLen) {
  const index = lists.findIndex(compare)
  if (index === 0) { return } else if (index !== -1) { lists.splice(index, 1) }
  lists.unshift(query)
  if (lists.length > maxLen) { lists.pop() }
}

function deleteFromArray(list, query, compare) {
  const index = list.findIndex(compare)
  list.splice(index, 1)
}

export function merge(arr) {
  let ret = []
  arr.forEach((item) => {
    ret = ret.concat(item)
  })
  return ret
}

export function saveHistory(query) {
  const searches = loadHistory()
  insertQuery(searches, query, (item) => {
    return item === query
  }, MAX)
  localStorage.setItem(historyKey, JSON.stringify(searches))
  return loadHistory()
}

export function loadHistory() {
  const history = JSON.parse(localStorage.getItem(historyKey))
  return history !== null ? history : []
}

export function deleteOne(query) {
  const searches = loadHistory()
  deleteFromArray(searches, query, (item) => {
    return item === query
  })
  localStorage.setItem(historyKey, JSON.stringify(searches))
  return JSON.parse(localStorage.getItem(historyKey))
}

export function clearAll() {
  localStorage.setItem(historyKey, JSON.stringify([]))
  return []
}

export function saveFavorite(song) {
  const favorite = loadFavorite()
  insertQuery(favorite, song, (item) => {
    return song.songId === item.songId
  }, 100)
  localStorage.setItem(favoriteKey, JSON.stringify(favorite))
  return loadFavorite()
}

export function loadFavorite() {
  const favor = JSON.parse(localStorage.getItem(favoriteKey))
  return favor !== null ? favor : []
}

export function deleteFavorite(song) {
  const favorite = loadFavorite()
  const index = favorite.findIndex(item => song.songId === item.songId)
  favorite.splice(index, 1)
  localStorage.setItem(favoriteKey, JSON.stringify(favorite))
  return loadFavorite()
}

export function saveFavorDisc(disc) {
  const favor = loadFavorDisc()
  insertQuery(favor, disc, item => item.discId === disc.discId, 100)
  localStorage.setItem(favorDiscKey, JSON.stringify(favor))
  return loadFavorDisc()
}

export function loadFavorDisc() {
  const favor = JSON.parse(localStorage.getItem(favorDiscKey))
  return favor !== null ? favor : []
}

export function deleteFavorDisc(disc) {
  const favor = loadFavorDisc()
  const index = favor.findIndex(item => disc.id === item.id)
  favor.splice(index, 1)
  localStorage.setItem(favorDiscKey, JSON.stringify(favor))
  return loadFavorDisc()
}

export function loadFavorAlbum() {
  const favor = JSON.parse(localStorage.getItem(favorAlbumKey))
  return favor !== null ? favor : []
}

export function saveFavorAlbum(album) {
  const favor = loadFavorAlbum()
  insertQuery(favor, album, item => item.id === album.id, 100)
  localStorage.setItem(favorAlbumKey, JSON.stringify(favor))
  return loadFavorAlbum()
}

export function deleteFavorAlbum(album) {
  const favor = loadFavorAlbum()
  const index = favor.findIndex(item => item.id === album.id)
  favor.splice(index, 1)
  localStorage.setItem(favorAlbumKey, JSON.stringify(favor))
  return loadFavorAlbum()
}

export function loadPlayHistory() {
  const playHis = JSON.parse(localStorage.getItem(playHistoryKey))
  return playHis !== null ? playHis : []
}

export function savePlayHistory(song) {
  const playHistory = loadPlayHistory()
  insertQuery(playHistory, song, (item) => {
    return song.songId === item.songId
  }, 199)
  localStorage.setItem(playHistoryKey, JSON.stringify(playHistory))

  return loadPlayHistory()
}

export function deletePlayHistory(song) {
  const playHistory = loadPlayHistory()
  const index = playHistory.findIndex((s) => {
    return s.songId === song.songId
  })
  playHistory.splice(index, 1)
  localStorage.setItem(playHistoryKey, JSON.stringify(playHistory))
  return loadPlayHistory()
}

export function loadSearchHistory() {
  const history = JSON.parse(localStorage.getItem(searchHistoryKey))
  return history !== null ? history : []
}

export function saveSearchHistory(key) {
  const history = loadSearchHistory()
  insertQuery(history, key, k => k === key, 10)
  localStorage.setItem(searchHistoryKey, JSON.stringify(history))
  return loadSearchHistory()
}

export function clearSearchHistory() {
  localStorage.setItem(searchHistoryKey, JSON.stringify([]))
  return []
}
