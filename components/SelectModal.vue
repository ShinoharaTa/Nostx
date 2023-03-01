<template>
  <div class="modal text-center d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="mt-4 h1 text-center">NosTx</div>
          <template v-if="!error">
            <div class="mt-3">クライアントを選択</div>
            <div class="row mt-4 px-4">
              <div
                class="py-3 col-6"
                :class="{ 'bg-primary text-white': select === 1 }"
                @click="select = 1"
              >
                <div class="d-flex justify-content-center">
                  <div class="w-50 bg-white icon">
                    <img
                      src="https://media.discordapp.net/attachments/536423734144401422/1080365850810396693/3f213087732422818ea1f7bfc2345c5a.png"
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
                      src="https://media.discordapp.net/attachments/536423734144401422/1080365959707099136/nostrich_512.png"
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
          </template>
          <div class="text-danger mt-4 py-3" v-else>
            URLにエラーがあります<br />
            確認が必要です
          </div>
          <div class="mt-4 text-center note" v-if="this.active">
            設定を変えるときは以下のURL <br />
            <a href="https://nostx.shino3.net">https://nostx.shino3.net</a>
          </div>
        </div>
        <div class="modal-footer" v-if="!error">
          <div class="">
            <input
              type="checkbox"
              id="select_0"
              name="select_0"
              v-model="select_opt"
            />
            <label for="select_0" class="">常にこのアプリを使用する</label>
          </div>
          <div class="ms-3" v-if="active">
            <button
              class="btn btn-primary px-3"
              @click="selected"
              :disabled="select < 1 && select > 4"
            >
              開く
            </button>
          </div>
          <div v-else>
            <button
              class="btn btn-primary px-3"
              @click="selected"
              :disabled="select < 1 && select > 4"
            >
              設定を変更
            </button>
          </div>
        </div>
        <div class="modal-footer" v-else>
          <button
            class="btn btn-outline-secondary px-3"
            @click="$router.back()"
          >
            もどる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: false,
  },
  data() {
    return {
      select: null,
      select_opt: true,
      error: false,
    }
  },
  mounted() {
    this.select = this.$cookies.get('selected')
    if (this.active) {
      let key = this.$route.params.key
      if (key.match(/(^npub.*)|(^note.*)/)) {
        if (this.select) {
          this.selected()
        }
      } else {
        this.error = true
      }
    }
  },
  methods: {
    selected: function () {
      if (this.select_opt) {
        console.log(this.select)
        this.$cookies.set('selected', this.select)
      } else {
        this.$cookies.remove('selected')
      }
      if (!this.active) return
      let key = this.$route.params.key
      // memo
      // NIP-21 URL Scheme : nostr://[NIP-19]
      if (key) {
        if (key.match(/^npub.*/)) {
          if (this.select === 1) {
            window.location.href = 'https://iris.to/' + key
          }
          if (this.select === 2) {
            window.location.href = 'https://snort.social/p/' + key
          }
          // if (select === 3) {
          // window.location.href("nostr://" + key);
          // }
        }
        if (key.match(/^note.*/)) {
          if (this.select === 1) {
            window.location.href = 'https://iris.to/post/' + key
          }
          if (this.select === 2) {
            window.location.href = 'https://snort.social/e/' + key
          }
          // if (select === 3) {
          // window.location.href("nostr://" + key);
          // }
        }
      }
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

.note {
  font-family: 'normal-font';
  font-size: 0.8rem;
  line-height: 1.5rem;
}

.modal-content {
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.25);
}
</style>
