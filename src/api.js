import http from 'tauri/api/http'

const baseURL = 'https://manage.runcloud.io/api/v2'
const options = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export default {
  clearAuth () {
    delete (options.headers.authorization)
  },
  setAuth (username, password) {
    options.headers.authorization = 'Basic ' + btoa(`${username}:${password}`);
  },
  http,
  request (slug, _options = {
    method: 'GET'
  }) {
    return http.request({
      url: `${baseURL}${slug}`,
      ...options,
      ..._options
    })
  },
  get (slug) {
    return http.get(`${baseURL}${slug}`, options)
  },
  post (slug, body = null) {
    return http.post(`${baseURL}${slug}`, body, options)
  },
  put (slug, body = null) {
    return http.put(`${baseURL}${slug}`, body, options)
  },
  patch (slug, body = null) {
    return http.request({
      ...options,
      method: 'PATCH',
      url: `${baseURL}${slug}`,
      body
    })
  },
  delete (slug) {
    return http.request({
      ...options,
      method: 'DELETE',
      url: `${baseURL}${slug}`,
    })
  },
}