import App from '@/App.vue'
import Vue from 'vue'
import Vuesax from 'vuesax'
import Api from './api'
import Store from './store'

// import Config from './config'
import 'material-icons/iconfont/material-icons.css';
import 'vuesax/dist/vuesax.css'
import '@/assets/tailwind.css'

Vue.config.productionTip = false

Vue.prototype.$rc = Api;

Vue.use(Store)
Vue.use(Vuesax)

new Vue({
  render: h => h(App),
}).$mount('#app')
