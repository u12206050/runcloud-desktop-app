<template>
  <div>
    <vs-progress v-if="loading" indeterminate color="primary" />
    <vs-table v-else stripe :data="rules">
      <template slot="header">
        <div class="w-full p-2 flex justify-between items-center">
          <h3 class="font-medium">Firewall Rules</h3>
          <div class="flex justify-end">
            <vs-button v-if="shouldDeploy" class="mx-2" size="small" color="success" type="filled" @click="deployRules">Deploy Rules</vs-button>
            <vs-button class="mx-2" size="small" color="primary" icon="add" type="filled" @click="create">Add new</vs-button>
          </div>
        </div>
      </template>
      <template slot="thead">
        <vs-th>Type</vs-th>
        <vs-th>Protocol</vs-th>
        <vs-th>Port</vs-th>
        <vs-th>IP Address</vs-th>
        <vs-th>Action</vs-th>
        <vs-th>Comment</vs-th>
        <vs-th>Options</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr v-for="(r) in data" :key="r.id" >
          <vs-td>{{ r.type }}</vs-td>
          <vs-td>{{ r.protocol }}</vs-td>
          <vs-td>{{ r.port }}</vs-td>
          <vs-td v-if="r.ipAddress === $store.ip" class="font-bold">{{ r.ipAddress }}</vs-td>
          <vs-td v-else>{{ r.ipAddress || '*' }}</vs-td>
          <vs-td>{{ r.firewallAction }}</vs-td>
          <vs-td>
            <input placeholder="Comment" v-model="$config.firewalls[r.id]" class="focus:border-blue-500 border-transparent border-b bg-transparent" />
          </vs-td>
          <vs-td>
            <vs-button class="mx-1" title="Clone rule" radius color="success" size="small" type="filled" icon="content_copy" @click="create(r)"></vs-button>
            <vs-button class="mx-1" title="Edit rule" radius color="warning" size="small" type="filled" icon="create" @click="editRule(r)"></vs-button>
            <vs-button class="mx-1" title="Delete rule" radius color="danger" size="small" type="filled" icon="delete_outline" @click="confirmDelete(r)"></vs-button>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <vs-popup :title="`${action} Rule`" :active.sync="showPopup">
      <form @submit.stop="submit" v-if="rule" class="flex flex-col justify-center items-center">
        <div class="flex items-center p-4">
          <vs-input required label-placeholder="Comment" v-model="rule.comment" />
          <div class="flex items-center w-1/2 px-4 pt-4">
            <label class="font-medium w-24">Type</label>
            <div>
              <vs-radio class="justify-start mb-2" v-model="rule.type" vs-name="type" color="primary" vs-value="global">Global</vs-radio>
              <vs-radio class="justify-start mt-2" v-model="rule.type" vs-name="type" color="success" vs-value="rich">Rich</vs-radio>
            </div>
          </div>
        </div>

        <div class="flex items-center p-4">
          <vs-input required label-placeholder="Port" v-model="rule.port" />
          <div class="flex items-center w-1/2 px-4 pt-4">
            <label class="font-medium w-24">Protocol</label>
            <div>
              <vs-radio class="justify-start mb-2" v-model="rule.protocol" vs-name="protocol" color="warning" vs-value="tcp">TCP</vs-radio>
              <vs-radio class="justify-start mt-2" v-model="rule.protocol" vs-name="protocol" color="warning" vs-value="udp">UDP</vs-radio>
            </div>
          </div>
        </div>

        <div v-if="rule.type === 'rich'" class="flex items-center p-4">
          <div class="flex items-center">
            <vs-input required label-placeholder="IP Address" v-model="rule.ipAddress" />
            <vs-button class="-ml-8 mr-1 mt-4" color="dark" type="filled" icon="public" @click.stop="() => { rule.ipAddress = $store.ip; $forceUpdate() }"></vs-button>
          </div>
          <div class="flex items-center w-1/2 px-4 pt-4">
            <label class="font-medium w-24">Action</label>
            <div>
              <vs-radio class="justify-start mb-2" v-model="rule.firewallAction" vs-name="firewallAction" color="success" vs-value="accept">Accept</vs-radio>
              <vs-radio class="justify-start mt-2" v-model="rule.firewallAction" vs-name="firewallAction" color="danger" vs-value="reject">Reject</vs-radio>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <vs-button class="m-4 w-24" color="dark" type="border" @click.prevent="rule = null">Cancel</vs-button>
          <vs-button class="w-24" color="primary" type="filled" @click="submit">Submit</vs-button>
        </div>
      </form>
    </vs-popup>
  </div>
</template>

<script>
import Server from '../resources/server'
export default {
  data () {
    return {
      loading: true,
      rules: null,
      action: 'Edit',
      rule: null,
      toDelete: null,
      shouldDeploy: false,
    }
  },
  methods: {
    async load () {
      this.loading = true
      this.rule = null
      this.toDelete = null
      const { data } = await this.serverApi.firewalls().get()
      this.rules = data
      this.loading = false
      this.$config.loaded = true
    },
    async submit () {
      const r = { ...this.rule }
      if (r.type === 'global') {
        delete(r.ip)
        delete(r.firewallAction)
      }
      this.rule = null

      const { title, color } = this.action === 'Edit' ? {
        title: 'Updated',
        color: 'primary'
      } : {
        title: 'Created',
        color: 'success'
      }

      try {
        if (this.action === 'Edit') {
          const rule = await this.serverApi.firewalls().create(r)
          this.$config.$set(this.$config.firewalls, rule.id, r.comment)

          await this.serverApi.firewall(r.id).delete()
          this.$delete(this.$config.firewalls, r.id)

          // await this.serverApi.firewall(r.id).update(r)
          //this.$config.$set(this.$config.firewalls, r.id, r.comment)
        } else {
          const rule = await this.serverApi.firewalls().create(r)
          this.$config.$set(this.$config.firewalls, rule.id, r.comment)
        }

        this.$vs.notify({title, text: `Firewall rule ${r.comment || r.port}`, color})
        this.shouldDeploy = true

        this.load()
      } catch (err) {
        this.$vs.notify({title: `${title} failed`, text: err.toString(), color: 'danger'})
      }
    },
    create (r) {
      this.rule = {
        ...r,
        id: 0,
      }
      this.action = 'Create'
    },
    editRule (rule) {
      this.rule = {
        ...rule,
        comment: this.$config.firewalls[rule.id]
      }
      this.action = 'Edit'
    },
    confirmDelete (rule) {
      this.toDelete = rule
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm deletion`,
        text: `Remove ${this.comments[rule.id]} "${rule.firewallAction || 'accept'} ${rule.protocol} ${rule.ipAddress || '*'}:${rule.port}"`,
        accept:this.deleteRule
      })
    },
    async deleteRule () {
      const { id, ipAddress, port } = this.toDelete || {}
      if (id && port) {
        try {
          await this.serverApi.firewall(id).delete()
          this.$delete(this.$config.firewalls, id)
          this.shouldDeploy = true
          this.$vs.notify({title: 'Deleted rule', text: `${ipAddress || 'all'}:${port}`, color: 'warning'})

          this.load()
        } catch (err) {
          this.$vs.notify({title: 'Failed to delete', text: err.toString(), color: 'danger'})
        }
      }
    },
    async deployRules () {
      this.loading = true
      try {
        await this.serverApi.firewalls().deploy()
        this.shouldDeploy = false
        this.$vs.notify({title: 'Deployed', text: `Firewall rules deployed`, color: 'primary'})
      } catch (err) {
        this.$vs.notify({title: 'Failed to deploy', text: err.toString(), color: 'danger'})
      }
      this.loading = false
    }
  },
  computed: {
    comments () {
      return this.$config.firewalls || {}
    },
    server () {
      return this.$store.server
    },
    serverApi () {
      return new Server(this.server.id)
    },
    showPopup: {
      get () {
        return !! this.rule
      },
      set (b) {
        if (!b) {
          this.rule = null
        }
      }
    }
  },
  mounted () {
    this.load()
  }
}
</script>