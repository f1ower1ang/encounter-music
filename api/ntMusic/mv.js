import axios from 'axios'

export async function ntMvInfo(id) {
  const url1 = 'http://encounter-music.cn:8080/mv/detail'
  const url2 = 'http://encounter-music.cn:8080/simi/mv'
  const data1 = await axios.get(url1, {
    params: {
      mvid: id
    }
  })
  const data2 = await axios.get(url2, {
    params: {
      mvid: id
    }
  })
  const data = Object.assign({}, data1.data.data, data2.data)
  return Promise.resolve({ data })
}
