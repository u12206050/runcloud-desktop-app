<template>
  <div id="app" class="h-full flex flex-col" v-if="! loading">
    <vs-navbar type="gradient" class="p-4">
      <div slot="title">
        <vs-navbar-title>
          <Logo class="h-6" />
        </vs-navbar-title>
      </div>

      <ul class="flex flex-col md:flex-row px-2">
        {{ $store.collapse }}
        <template v-for="(acc, id) in accounts">
          <li class="m-1 md:my-0" :key="id">
            <vs-button class="w-full" size="small" :color="accountId === id ? 'primary' : 'dark'" type="gradient" @click="switchAccount(id)">{{ acc.name }}</vs-button>
          </li>
        </template>
        <li class="m-1 md:my-0">
          <vs-button class="w-full" icon="add" color="success" type="gradient" size="small" @click="addNewAccount">Connect</vs-button>
        </li>
      </ul>
    </vs-navbar>

    <div v-if="account" class="flex-1 overflow-hidden">
      <vs-tabs v-model="tab" class="h-full overflow-scroll" alignment="fixed">
        <vs-tab label="Servers">
          <div class="con-tab-ejemplo">
            <Servers />
          </div>
        </vs-tab>
        <vs-tab label="Firewall" v-if="$store.server">
          <div class="p-4">
            <Firewall />
          </div>
        </vs-tab>
        <vs-tab label="Services" v-if="$store.server">
          <div class="p-4">
            <Services />
          </div>
        </vs-tab>
        <vs-tab label="Account">
          <div class="p-4">
            <h3 class="m-4">{{ account.name }}</h3>
            <vs-button class="mx-4 -mt-2" type="filled" color="danger" @click="confirmRemove">Remove Account</vs-button>
          </div>
        </vs-tab>
      </vs-tabs>
    </div>
    <div v-else class="flex-1 flex flex-col justify-center items-center text-xl bg-gray-100 text-gray-700 px-4 text-center">
      <h1 class="mb-2 font-bold text-2xl">Welcome to the Runcloud App</h1>
      <p>Start by connecting your account using your api key found <a class="text-blue-600 underline" target="_blank" href="https://manage.runcloud.io/settings/apikey">here</a></p>
      <ul class="text-sm p-8 text-left list-disc">
        <li>All connected accounts are stored locally on this device.</li>
        <li>No information is transmitted to any other service except for the runcloud platform.</li>
        <li>The only other external service used is <i>ipify.org</i> in order to obtain your public ip address</li>
      </ul>
    </div>

    <div class="bg-gray-200 border-t border-gray-400 p-2 text-sm flex justify-between">
      <p>Created by Gerard Lamusse 2020</p>
      <p>Your ip: <span class="select-all cursor-pointer hover:text-primary" @click="copyIP">{{ $store.ip }}</span></p>

      <vs-popup :title="popup && popup.title" :active.sync="showPopup">
        <component v-if="popup" :is="popup.comp" @close="showPopup = false"></component>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import Logo from './singles/Logo'
import ConnectAccount from './components/ConnectAccount'
import Servers from './components/Servers'
import Firewall from './components/Firewall'
import Services from './components/Services'

export default {
  name: 'App',
  components: {
    Logo,
    ConnectAccount,
    Servers,
    Firewall,
    Services,
  },
  data () {
    return {
      tab: 0,
      loading: true,
      activeItem: null,

      showPopup: false,
      popup: null,
    }
  },
  methods: {
    copyIP () {
      document.execCommand("copy");
      this.$vs.notify({title: 'Copied', color: 'success'})
    },
    addNewAccount () {
      this.$nextTick(() => {
        this.popup = {
          comp: ConnectAccount,
          title: 'Connect Account'
        }
        this.showPopup = true
      })
    },
    switchAccount (id) {
      this.$config.setAccountId(id)
    },
    confirmRemove () {
      if (this.account) {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: `Confirm removal`,
          text: `Are you sure you want to remove "${this.account.name}" from this app?`,
          accept: this.removeAccount
        })
      }
    },
    removeAccount () {
      if (this.account) {
        this.$config.removeAccount(this.accountId)
      }
    },
  },
  computed: {
    accounts () {
      return this.$config.accounts || {}
    },
    accountId () {
      return this.$config.accountId || false
    },
    account () {
      return this.$config.account || null
    },
    loaded () {
      return this.$config.loaded
    }
  },
  async mounted () {
    this.$vs.loading()
    const { ip } = await this.$rc.http.get('https://api.ipify.org?format=json')
    this.$store.ip = ip
    if (this.loaded) {
      this.$vs.loading.close()
      this.loading = false
    }
  },
  watch: {
    // Cleanup popup component
    showPopup (b) {
      if (!b) {
        this.popup = null
      }
    },
    account (acc) {
      if (acc) {
        this.$rc.setAuth(acc.auth.username, acc.auth.password)
      } else {
        this.$rc.clearAuth()
      }
    },
    loaded (l) {
      if (l) {
        this.$vs.loading.close()
        this.loading = false
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style >
html, body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}

#app .con-vs-tabs .con-ul-tabs {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #f7fafc;
}
</style>
