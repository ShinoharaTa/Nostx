<template>
  <div class="page text-center">
    <div class="px-4 pt-5">
      <div class="">
        <div class="text-center">
          <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
        </div>
      </div>
      <!-- <div class="mt-4" id="generatedQR"></div> -->
      <div class="mt-4 card py-3 bg-dark">
        Nostrの npub or note入力すると<br />
        `https://nostx.shino3.net/npub...`の <br />
        形式のQRコードを生成します
      </div>
      <div class="mt-4" v-if="url">
        <img :src="url" class="img-fluid w-75" />
      </div>
      <div class="mt-4" v-else>
        <img src="/image/notimage.png" class="img-fluid w-75" />
      </div>
      <div class="text-center mt-5">
        <textarea
          v-model="nip19"
          class="form-control"
          placeholder="npub... or note..."
          rows="3"
        />
        <div class="mt-3">
          <button class="btn btn-lg bg-brand px-4" @click="generate">
            QRコードを生成する
          </button>
        </div>
      </div>
      <div class="mt-4">
        <a href="javascript:void(0)" class="" @click="$router.back()">
          «　前のページへ
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import QRCode from 'qrcode'

export default Vue.extend({
  data() {
    return {
      url: '',
      nip19: '',
    }
  },
  methods: {
    generate: function () {
      if (this.nip19 === '') return
      QRCode.toDataURL('https://nostx.shino3.net/' + this.nip19)
        .then((url: string) => {
          this.url = url
        })
        .catch((err: string) => {
          this.url = ''
        })
    },
  },
})
</script>

<style>
.card {
  /* color: #444;
  background: #f2f2f2; */
  font-size: 0.8rem;
  font-family: initial;
}
</style>
