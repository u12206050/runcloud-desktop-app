import api from '../api'

class Base {
  baseUrl = '/'
  data = {}

  constructor (prefix = '', id = '') {
    this.prefix = prefix
    this.id = id
  }

  get url () {
    return `${this.collectionUrl}/${this.id}`
  }

  get collectionUrl () {
    return `${this.prefix}${this.baseUrl}`
  }

  get () {
    return api.get(this.url)
  }

  create (data) {
    return api.post(this.url, data)
  }

  update (data) {
    if (! this.id) throw new Error('Resource id required')
    return api.patch(this.url, data)
  }

  delete () {
    if (! this.id) throw new Error('Resource id required')
    return api.delete(this.url)
  }

  collection () {
    return new this(this.collectionUrl)
  }
}

export default Base