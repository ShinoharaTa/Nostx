<template>
  <div class="d-flex align-items-center">
    <div class="bg-white app_icon">
      <img :src="imgsrc" alt="" class="img-fluid" />
    </div>
    <div class="app_text">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    imgsrc: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  methods: {},
})
</script>

<style scoped>
.app_icon {
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eee;
  width: 42px;
  height: 42px;
  margin-right: 2rem;
}
.app_text {
  font-size: 16px;
}
</style>
