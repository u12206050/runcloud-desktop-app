import File from '../db/file'

export default {
  data() {
    return {
      file: null,
      loaded: false,
      accounts: {},
      account: null,
      accountId: null,
      firewalls: {},
    }
  },
  watch: {
    accounts: {
      deep: true,
      handler (n, o) {
        if (JSON.stringify(n) !== JSON.stringify(o)) {
          this.persist()
        }
      }
    },
    firewalls: {
      deep: true,
      handler (n) {
        console.log(n)
        this.persist()
      }
    },
    accountId (id) {
      this.account = this.accounts[id] || null
      this.persist()
    }
  },
  methods: {
    reset () {
      this.accounts = []
      this.accountId = null
      this.persist()
    },
    getAccounts () {
      return [...this.accounts]
    },
    addAccount (data) {
      const id = Date.now()
      this.accounts[id] = data
      this.setAccountId(id)
      this.persist()
    },
    removeAccount (id) {
      delete(this.accounts[id])
      if (this.accountId === id) {
        const ids = Object.keys(this.accounts);
        this.setAccountId(ids.length ? ids[0] : null)
      }
      this.persist()
    },
    /* Notify any listeners of changes */
    notifyChange (event, data) {
      this.$nextTick(() => {
        if (event) this.$emit(event, data)
        this.persist()
      })
    },
    async persist () {
      try {
        if (! this.loaded) return
        const { accounts, firewalls, accountId } = this
        await this.file.write({
          accounts, firewalls, accountId
        })
      } catch (err) {
        return false
      }
    },
    setAccountId (id) {
      this.accountId = id
    },
    async init () {
      const { accounts, firewalls, accountId } = await this.file.read()
      this.firewalls = firewalls || {}
      this.accounts = accounts || {}

      if (accountId) {
        this.setAccountId(accountId)
      } else if (Object.keys(this.accounts).length) {
        this.setAccountId(Object.keys(this.accounts)[0])
      }

      this.loaded = true
    }
  },
  created () {
    this.file = new File()
  }
}