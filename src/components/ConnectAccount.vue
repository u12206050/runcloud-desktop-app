<template>
  <div class="flex flex-col items-center p-4">
    <vs-input
      label-placeholder="Account name"
      v-model="name"
    />
    <div class="mt-4">
      <vs-input
        label-placeholder="API Key"
        v-model="auth.username"
        min-length="40"
      />
    </div>
    <div class="my-4">
      <vs-input
        label-placeholder="API Secret"
        v-model="auth.password"
        min-length="60"
      />
    </div>

    <vs-alert :active="error" color="danger" icon="new_releases" >
      <span>{{error}}</span>
    </vs-alert>

    <div class="flex justify-center mt-4">
      <vs-button :disabled="verifying || ! verified" color="primary" type="border" @click="add">
        <div class="flex items-center">
          <span>Connect</span>
          <span class="ml-2">
            <vs-icon v-if="verified" icon="verified_user" color="success" />
            <vs-progress v-else-if="verifying" class="w-4" indeterminate color="primary" />
          </span>
        </div>
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectAccount',
  data () {
    return {
      name: '',
      auth: {
        username: '',
        password: '',
      },
      verifying: null,
      verified: false,
      error: null,
    }
  },
  methods: {
    async add () {
      const { name, auth, verified } = this
      if (name && verified) {
        this.$config.addAccount({
          name,
          auth
        })
        this.$emit('close')
      }
    },
    async verify () {
      this.error = false
      this.verified = false
      const { username, password } = this.auth
      if (username && password && username.length > 40 && password.length > 60) {
        this.verifying = true
        try {
          this.$rc.setAuth(username, password)
          const { message } = await this.$rc.get('/ping')
          this.verified = message === 'pong'
        } catch (err) {
          this.error = `Error: ${err}`
        } finally {
          this.verifying = false
          if (!this.verified) {
            this.$rc.clearAuth()
          }
        }
      }
    }
  },
  watch: {
    auth: {
      deep: true,
      handler () {
        this.verify()
      }
    }
  }
}
</script>