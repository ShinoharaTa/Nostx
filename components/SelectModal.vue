<template>
  <div class="px-4 pt-5">
    <div class="">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
      <template v-if="!error">
        <div class="mt-5 text-center">クライアントを選択</div>
        <div
          v-for="(client, key, index) in clients"
          :key="index"
          class="item mt-3"
          :class="{ selected: select === key }"
          @click="select = key"
        >
          <client-item :imgsrc="client.imgsrc" :name="client.name" />
        </div>
      </template>
      <div
        class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
        v-else
      >
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
          :disabled="select === ''"
        >
          リンクを開く
        </button>
      </div>
      <div v-else class="mt-4">
        <button
          class="btn btn-lg bg-brand px-4"
          @click="selected"
          :disabled="select === ''"
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

<script lang="ts">
import ClientItem from '@/components/ClientItem.vue'
import { nip05 } from 'nostr-tools'
import Vue from 'vue'

interface Clients {
  [key: string]: Client
}

interface Client {
  [key: string]: any
}

export default Vue.extend({
  components: {
    ClientItem,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      select: '' as string,
      select_opt: false as boolean,
      error: false as boolean,
      clients: {
        iris: {
          name: 'Iris.to',
          imgsrc:
            'https://media.discordapp.net/attachments/536423734144401422/1080365850810396693/3f213087732422818ea1f7bfc2345c5a.png',
          url_user: 'https://iris.to/',
          url_note: 'https://iris.to/post/',
          nip05: true,
          smartphone: false,
        },
        snort: {
          name: 'Snort.social',
          imgsrc:
            'https://media.discordapp.net/attachments/536423734144401422/1080365959707099136/nostrich_512.png',
          url_user: 'https://snort.social/p/',
          url_note: 'https://snort.social/e/',
          nip05: false,
          smartphone: false,
        },
        nostter: {
          name: 'nostter',
          imgsrc:
            'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43e.svg',
          url_user: 'https://nostter.vercel.app/',
          url_note: 'https://nostter.vercel.app/',
          nip05: false,
          smartphone: false,
        },
        apps: {
          name: 'アプリで開く',
          imgsrc: '/image/app_icon.svg',
          url_user: 'nostr:',
          url_note: 'nostr:',
          nip05: false,
          smartphone: false,
        },
      } as Clients,
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
      ? this.$cookies.get('selected')
      : 'iris'
    if (!this.clients.hasOwnProperty(this.select)) {
      this.select = 'iris'
      return
    }
    this.select_opt = this.$cookies.get('is_all')
      ? this.$cookies.get('is_all')
      : false
    if (this.active) {
      let key = this.$route.params.key
      let query = this.$route.query
      if (key.match(/(^npub.*)|(^note.*)/)) {
        if (this.select_opt) {
          this.selected()
        }
      } else if (key.match(/^user$/)) {
        if (query.hasOwnProperty('u')) {
          const pubkey = nip05.queryProfile(query.u as string);
          console.log(pubkey);
          if (this.select_opt) {
            this.selected()
          }
        } else {
          this.error = true
        }
      } else {
        this.error = true
      }
    }
  },
  methods: {
    selected: function () {
      this.$cookies.set('selected', this.select)
      this.$cookies.set('is_all', this.select_opt)
      if (!this.active) return
      let key = this.$route.params.key
      // memo
      // NIP-21 URL Scheme : nostr://[NIP-19]
      if (key) {
        if (key.match(/^user$/)) {
          console.log(key)
        }
        if (key.match(/^npub.*/)) {
          window.location.href = this.clients[this.select].url_user + key
        }
        if (key.match(/^note.*/)) {
          window.location.href = this.clients[this.select].url_note + key
        }
      }
    },
  },
})
</script>

<style scoped>
input[type='radio'] {
  display: none;
}

.item {
  background: #222;
  border-radius: 12px;
  padding: 0.6rem 2.5rem;
  border: 1px #444 solid;
}

.error_icon {
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #eee;
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
</style>
