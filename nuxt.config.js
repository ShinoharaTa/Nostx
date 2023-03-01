export default {
  // Target: https://go.nuxtjs.dev/config-target
  ssr: false,
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NosTx - Tx for nostr clients.',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      // OGP
      { property: 'og:title', content: 'NosTx' },
      {
        property: 'og:image',
        content: 'https://nostx.shino3.net/image/og-image.png',
      },
      {
        property: 'og:description',
        content: 'NosTx - Tx for nostr clients.',
      },
      { property: 'og:url', content: 'https://nostx.shino3.net/' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'NosTx' },
      // OGP: Twitter
      { name: 'twitter:site', content: 'https://nostx.shino3.net/' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'NosTx' },
      {
        name: 'twitter:image',
        content: 'https://nostx.shino3.net/image/og-image.png',
      },
      {
        name: 'twitter:description',
        content: 'NosTx - Tx for nostr clients.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: '/js/bootstrap.bundle.min.js' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/bootstrap.min.css', '~/assets/scss/style.scss'],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    // '@nuxtjs/axios',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    dir: 'public',
  },
  generate: {
    dir: 'public',
  },
}
