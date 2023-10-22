import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  config = { headers: { Authorization: token } }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlogObject => {
  const response = await axios.post(baseUrl, newBlogObject, config)
  return response.data
}

const update = async (blogObject) => {
  const response = await axios.put(`${ baseUrl }/${blogObject.id}`, blogObject, config)
  return response.data
}

const deleteBlog = async (blogObject) => {
  const response = await axios.delete(`${ baseUrl }/${blogObject.id}`, config)
  return response.data
}

export default { getAll, create, update, deleteBlog, setToken }