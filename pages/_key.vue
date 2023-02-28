<template>
  <div class="container">
    <div class="mt-5 py-3 h1 text-center">NosTx</div>
    <SelectModal @selected="selected" />
    <!-- <a href="nostr://npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9">scheme</a> -->
  </div>
</template>

<script>
import $cookies from "cookie-universal-nuxt";

export default {
  mounted() {
    let select = this.$cookies.get('select')
    if (select) {
      this.selected(select)
    }
  },
  methods: {
    selected: function (select) {
      console.log(select)
      // リダイレクト;
    },
  },
}
</script>
