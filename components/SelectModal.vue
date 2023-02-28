<template>
  <div class="text-center">
    <div>デフォルトの転送先を選択</div>
    <div class="row mt-4">
      <div
        class="py-3 col-6 col-md-3"
        :class="{ 'bg-primary text-white': select === 1 }"
        @click="select = 1"
      >
        <div class="mt-3">Iris.to</div>
      </div>
      <div
        class="py-3 col-6 col-md-3"
        :class="{ 'bg-primary text-white': select === 2 }"
        @click="select = 2"
      >
        <div class="mt-3">Snort.social</div>
      </div>
      <div
        class="py-3 col-6 col-md-3"
        :class="{ 'bg-primary text-white': select === 3 }"
        @click="select = 3"
      >
        <div class="mt-3">Amethyst/Android</div>
      </div>
      <div
        class="py-3 col-6 col-md-3"
        :class="{ 'bg-primary text-white': select === 4 }"
        @click="select = 4"
      >
        <div class="mt-3">Damus/iOS</div>
      </div>
    </div>
    <div class="mt-3">
      <input
        type="checkbox"
        id="select_0"
        name="select_0"
        :value="0"
        v-model="select_opt"
      />
      <label for="select_0" class="mt-4">毎回選択する</label>
    </div>
    <div class="mt-4">
      <button
        class="btn btn-primary px-5"
        @click="selected"
        :disabled="select < 1 && select > 4"
      >
        設定を保存
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: null,
      select_opt: false,
    }
  },
  methods: {
    selected: function () {
      this.$cookies.set('selected', this.select)
      this.$emit('selected', this.select)
    },
  },
}
</script>

<style scoped>
input[type='radio'] {
  display: none;
}
</style>
