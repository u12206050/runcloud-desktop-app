<template>
  <vs-progress v-if="loading" indeterminate color="primary" />
  <div v-else-if="servers" class="flex flex-wrap items-stretch p-2">
    <div v-for="server in servers" :key="server.id" @click="$store.server = server" class="p-2 w-full xs:w-1/2 md:w-1/3 max-w-xs">
      <vs-card actionable>
        <div slot="header" class="flex justify-between items-center">
          <h3 class="mr-2">{{ server.name }}</h3>
          <transition name="scale" appear>
            <vs-icon v-if="$store.server && server.id === $store.server.id" icon="check" size="small" bg="success" color="white" round></vs-icon>
          </transition>
        </div>
        <div>
          <vs-list>
            <vs-list-item icon="dns" :title="server.ip" :subtitle="`${server.provider}`" />
            <vs-list-item :icon="server.online ? 'power' : 'power_off'" :subtitle="server.online ? 'Connected' : 'Disconnected'" />
            <vs-list-item icon="location_on" :subtitle="server.ipAddress" />
          </vs-list>
        </div>
      </vs-card>
    </div>
  </div>
  <vs-button v-else type="filled" color="primary" icon="refresh" class="mx-12 my-6" @click="load">Refresh</vs-button>
</template>

<script>
import Server from '../resources/server'
export default {
  data () {
    return {
      api: null,
      servers: null,
      loading: true,
    }
  },
  methods: {
    async load () {
      this.loading = true
      try {
        const { data } = await this.api.get()
        this.servers = data
      } catch (err) {
        this.$vs.notify({title:'Failed to fetch servers', text: err.toString(), color:'danger'})
      }
      this.loading = false
    }
  },
  mounted () {
    this.api = new Server();
    this.load()
  }
}
</script>