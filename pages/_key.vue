<template>
  <div class="container">
    <div class="mt-5 py-3 h1 text-center">NosTx</div>
    <SelectModal @selected="selected" />
    <!-- <a href="nostr://npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9">scheme</a> -->
  </div>
</template>

<script>

export default {
  mounted() {
    let select = this.$cookies.get('selected')
    console.log(select);
    if (select) {
      this.selected(select)
    }
  },
  methods: {
    selected: function (select) {
      let key = this.$route.params.key;
      // memo
      // NIP-21 URL Scheme : nostr://[NIP-19]
      if(key){
        if(key.match(/^npub.*/)){
          if (select === 1) {
            window.location.href = "https://iris.to/" + key;
          }
          if (select === 2) {
            window.location.href = "https://snort.social/p/" + key;
          }
          // if (select === 3) {
            // window.location.href("nostr://" + key);
          // }
        }
        if(key.match(/^note.*/)){
          if (select === 1) {
            window.location.href = "https://iris.to/post/" + key;
          }
          if (select === 2) {
            window.location.href = "https://snort.social/e/" + key;
          }
          // if (select === 3) {
            // window.location.href("nostr://" + key);
          // }
        }
      }
      this.$router.push("/");
    },
  },
}
</script>
