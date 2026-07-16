import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [],
  kit: {
    // Cloudflare Pages にデプロイする(ビルド出力: .svelte-kit/cloudflare)
    adapter: adapter(),
  },
};

export default config;
