import axios from 'axios'
const base = `${window.location.protocol}//${window.location.hostname}/api`

function query (obj) {
  obj = obj || {}
  let queries = Object.keys(obj).map(key => {
    key = encodeURIComponent(key)
    let value = encodeURIComponent(obj[key])
    return [key, value].join('=')
  })

  return queries.length ? '?' + queries.join('&') : ''
}

function getItems ({ ...options }) {
  return axios.get(`${base}/items${query(options)}`).then(res => res.data).catch(err => err)
}

function postItem ({ ...options }) {
  return axios.post(`${base}/items${query(options)}`).then(res => res.data).catch(err => err)
}

function getItem ({ itemId, ...options }) {
  return axios.get(`${base}/items/${itemId}${query(options)}`).then(res => res.data).catch(err => err)
}

function putItem ({ itemId, ...options }, item) {
  return axios.put(`${base}/items/${itemId}${query(options)}`, item).then(res => res.data).catch(err => err)
}

function deleteItem ({ itemId, ...options }) {
  return axios.delete(`${base}/items/${itemId}${query(options)}`).then(res => res.data).catch(err => err)
}

export default {
  getItems,
  postItem,
  getItem,
  putItem,
  deleteItem
}
