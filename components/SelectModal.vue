<template>
  <div class="text-center">
    <div>クライアントを選択</div>
    <div class="row mt-4">
      <div
        class="py-3 col-6"
        :class="{ 'bg-primary text-white': select === 1 }"
        @click="select = 1"
      >
        <div class="d-flex justify-content-center">
          <div class="w-50 bg-white icon">
            <img
              src="https://imgproxy.iris.to/insecure/plain/https://iris.to/3f213087732422818ea1f7bfc2345c5a.png"
              alt=""
              class="img-fluid"
            />
          </div>
        </div>
        <div class="mt-3">Iris.to</div>
      </div>

      <div
        class="py-3 col-6"
        :class="{ 'bg-primary text-white': select === 2 }"
        @click="select = 2"
      >
        <div class="d-flex justify-content-center">
          <div class="w-50 bg-white icon">
            <img
              src="https://github.com/v0l/snort/blob/main/packages/app/public/nostrich_512.png?raw=true"
              alt=""
              class="img-fluid"
            />
          </div>
        </div>
        <div class="mt-3">Snort.social</div>
      </div>
      <!-- <div
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
      </div> -->
    </div>
    <div class="mt-3">
      <input
        type="checkbox"
        id="select_0"
        name="select_0"
        :value="0"
        v-model="select_opt"
      />
      <label for="select_0" class="mt-4">デフォルトを使用する</label>
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
      select_opt: true,
    }
  },
  methods: {
    selected: function () {
      if (!this.select_opt) {
        this.$cookies.set('selected', this.select)
      } else {
        this.$cookies.remove('selected')
      }
      this.$emit('selected', this.select)
    },
  },
}
</script>

<style scoped>
input[type='radio'] {
  display: none;
}

.icon {
  border-radius: 50%;
  overflow: hidden;
}
</style>
