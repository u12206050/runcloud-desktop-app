<template>
  <div>
    <vs-progress v-if="loading" indeterminate color="primary" />
    <vs-table v-else :data="services" striped>
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Memory</vs-th>
        <vs-th>Cpu</vs-th>
        <vs-th>Version</vs-th>
        <vs-th></vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr v-for="(s) in data" :key="s.realName" :state="s.running ? '' : 'danger'">
          <vs-td>{{ s.name }}</vs-td>
          <vs-td>{{ s.memory === 'Service stopped' ? '–––' : s.memory }}</vs-td>
          <vs-td>{{ s.cpu === 'Service stopped' ? '–––' : s.cpu }}</vs-td>
          <vs-td>{{ s.version }}</vs-td>
          <vs-td v-if="s.loading">
            <vs-progress indeterminate color="primary"></vs-progress>
          </vs-td>
          <vs-td v-else>
            <div v-if="s.running" class="flex">
              <vs-button @click="execute('stop', s)" size="small" class="mx-1" type="gradient" color="danger" icon="stop"></vs-button>
              <vs-button @click="execute('restart', s)" size="small" class="mx-1" type="gradient" color="warning" icon="autorenew"></vs-button>
            </div>
            <div v-else class="flex">
              <vs-button @click="execute('start', s)" size="small" class="mx-1" type="gradient" color="success" icon="play_arrow"></vs-button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import Server from '../resources/server'
export default {
  data () {
    return {
      loading: true,
      services: null,
    }
  },
  methods: {
    async load () {
      this.loading = true
      try {
        const data = await this.serverApi.services().get()
        this.services = data ? Object.values(data) : []
      } catch (err) {
        console.warn('execute', err)
      }
      this.loading = false
      this.$config.loaded = true
    },
    async execute (action, service) {
      this.$set(service, 'loading', true)
      try {
        console.log(await this.servicesApi.execute(action, service.realName))
        this.$set(service, 'loading', false)
        this.load()
      } catch (err) {
        this.$set(service, 'loading', false)
        console.warn('execute', err)
      }
    },
  },
  computed: {
    server () {
      return this.$store.server
    },
    serverApi () {
      return new Server(this.server.id)
    },
    servicesApi () {
      return this.serverApi.services()
    },
  },
  mounted () {
    this.load()
  }
}
</script>