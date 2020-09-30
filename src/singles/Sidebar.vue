<template>
  <div class="hidden">
    <vs-sidebar
      absolute
      v-model="active"
      open
      >
      <template #logo>
        <!-- ...img logo -->
      </template>
      <vs-sidebar-item id="market">
        <template #icon>
          <vs-icon icon="grid-alt" />
        </template>
        Accounts
      </vs-sidebar-item>
      <vs-sidebar-item id="Music">
        <template #icon>
          <vs-icon icon="lock" color="success" />
        </template>
        Firewall
      </vs-sidebar-item>
      <vs-sidebar-item id="donate">
        <template #icon>
          <vs-icon icon="donate-heart" />
        </template>
        Donate
      </vs-sidebar-item>
      <vs-sidebar-item id="drink">
        <template #icon>
          <vs-icon icon="drink" />
        </template>
        Drink
      </vs-sidebar-item>
      <vs-sidebar-item id="shopping">
        <template #icon>
          <vs-icon icon="shopping-bags" />
        </template>
        Shopping
      </vs-sidebar-item>
      <vs-sidebar-item id="chat">
        <template #icon>
          <vs-icon icon="chat" />
        </template>
        Chat
      </vs-sidebar-item>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar>
            <img src="/avatars/avatar-5.png" alt="">
          </vs-avatar>

          <vs-avatar badge-color="danger" badge-position="top-right">
            <vs-icon icon="bell" />

            <template #badge>
              28
            </template>
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: true,
    }
  }
}
</script>