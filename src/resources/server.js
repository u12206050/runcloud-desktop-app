import api from '../api'
import Base from './base'

class Server extends Base {
  baseUrl = '/servers'

  constructor (id = '') {
    super('', id)
  }

  firewalls () {
    if (! this.id) throw new Error('Resource id required')
    return new Firewall(this.url)
  }

  firewall (id = '') {
    if (! this.id) throw new Error('Resource id required')
    return new Firewall(this.url, id)
  }

  services () {
    if (! this.id) throw new Error('Resource id required')
    return new Services(this.url)
  }
}

class Services extends Base {
  baseUrl = '/services'

  execute (action, realName) {
    return api.patch(this.url, {
      action,
      realName
    })
  }

  start (realName) {
    return this.execute('start', realName)
  }
  stop (realName) {
    return this.execute('stop', realName)
  }
  restart (realName) {
    return this.execute('restart', realName)
  }
  reload (realName) {
    return this.execute('reload', realName)
  }

  create () {
    throw new Error('Not available')
  }

  update () {
    throw new Error('Not available')
  }

  delete () {
    throw new Error('Not available')
  }
}

class Firewall extends Base {
  baseUrl = '/security/firewalls'

  data = {
    port: 80,
    type: 'global',
    protocol: 'tcp',
    ipAddress: '127.0.0.1',
    firewallAction: 'accept'
  }

  constructor (prefix, id = '') {
    super(prefix, id)
  }

  deploy () {
    return api.request(this.collectionUrl, {
      method: 'PUT',
      responseType: 2
    })
  }
}

export default Server