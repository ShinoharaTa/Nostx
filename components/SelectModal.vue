<template>
  <div class="px-4 mt-5">
    <div class="">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
      <template v-if="!error">
        <div class="mt-5 text-center">クライアントを選択</div>
        <div
          class="item mt-3"
          :class="{ selected: select === 1 }"
          @click="select = 1"
        >
          <div class="d-flex align-items-center">
            <div class="bg-white app_icon">
              <img
                src="https://media.discordapp.net/attachments/536423734144401422/1080365850810396693/3f213087732422818ea1f7bfc2345c5a.png"
                alt=""
                class="img-fluid"
              />
            </div>
            <div class="app_text">Iris.to</div>
          </div>
        </div>

        <div
          class="item mt-3"
          :class="{ selected: select === 2 }"
          @click="select = 2"
        >
          <div class="d-flex align-items-center">
            <div class="bg-white app_icon">
              <img
                src="https://media.discordapp.net/attachments/536423734144401422/1080365959707099136/nostrich_512.png"
                alt=""
                class="img-fluid"
              />
            </div>
            <div class="app_text">Snort.social</div>
          </div>
        </div>
        <div
          v-if="isSmartPhone"
          class="item mt-3"
          :class="{ selected: select === 3 }"
          @click="select = 3"
        >
          <div class="d-flex align-items-center">
            <div class="bg-white app_icon add-padding">
              <img src="/image/app_icon.svg" alt="" class="img-fluid" />
            </div>
            <div class="app_text">アプリで開く</div>
          </div>
        </div>
      </template>
      <div class="text-danger text-center mt-5 py-4 px-5 border border-danger item" v-else>
        <div class="d-flex align-items-center justify-content-center">
          <div class="bg-white error_icon">
            <img src="/image/error_icon.jpg" alt="" class="img-fluid" />
          </div>
        </div>
        <div class="mt-4">
          URLにエラーがあります<br />
          確認が必要です
        </div>
      </div>
      <div class="mt-4 text-center note text-white" v-if="this.active">
        設定を変えるときは以下のURL <br />
        <a href="https://nostx.shino3.net">https://nostx.shino3.net</a>
      </div>
    </div>
    <div class="text-center mt-4" v-if="!error">
      <div class="mt-3 text-white">
        <input
          type="checkbox"
          id="select_0"
          name="select_0"
          v-model="select_opt"
        />
        <label for="select_0" class="">常にこのアプリを使用する</label>
      </div>
      <div class="mt-4" v-if="active">
        <button
          class="btn btn-lg bg-brand px-4"
          @click="selected"
          :disabled="select < 1 && select > 4"
        >
          リンクを開く
        </button>
      </div>
      <div v-else class="mt-4">
        <button
          class="btn btn-lg bg-brand px-4"
          @click="selected"
          :disabled="select < 1 && select > 4"
        >
          設定を変更
        </button>
      </div>
    </div>
    <div class="text-center mt-4" v-else>
      <button class="btn btn-lg bg-brand px-4" @click="$router.back()">
        前のページへ
      </button>
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
  computed: {
    isSmartPhone: function () {
      return (
        (navigator.userAgent.indexOf('iPhone') > 0 &&
          navigator.userAgent.indexOf('iPad') == -1) ||
        navigator.userAgent.indexOf('Android') > 0
      )
    },
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
          if (this.select === 3) {
            window.location.href = 'nostr:' + key
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
          if (this.select === 3) {
            window.location.href = 'nostr:' + key
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

.item {
  background: #222;
  border-radius: 12px;
  padding: 1rem 2.5rem;
  border: 1px #444 solid;
}

.app_icon {
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #eee;
  width: 48px;
  margin-right: 2rem;
}

.error_icon {
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #eee;
}

.app_text {
  font-size: 20px;
}

.add-padding {
  padding: 5px;
}

.note {
  font-size: 1rem;
  line-height: 1.5rem;
}

.modal-content {
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.25);
}

.selected {
  background-color: #673ab7c0;
  border: 1px #673ab7 solid;
}

.bg-brand {
  color: #fff;
  background-color: #7c4dff;
}

a {
  color: #ccc;
}
</style>
