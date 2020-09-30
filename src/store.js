import Config from './stores/config'

let store = null
export default (Vue) => {
  if (store) return store
  store = Vue.observable({
    server: null,
    ip: '127.0.0.1'
  })

  const $config = new Vue(Config)
  $config.init()
  Vue.prototype.$config = $config
  Vue.prototype.$store = store

  return store
}