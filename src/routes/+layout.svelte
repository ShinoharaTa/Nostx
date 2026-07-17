<script>
import "$lib/styles/style.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from "$lib/components/Footer.svelte";
import { page } from "$app/state";

let { children } = $props();
</script>

<svelte:head>
  {#if page.route.id !== "/[nip19]"}
    <!-- 汎用OGP: [nip19] ページはサーバー取得データ入りのOGPを自身で出力する -->
    <meta property="og:title" content="Nostx" />
    <meta
      property="og:description"
      content="Nostx is a redirect service that opens Nostr profiles and notes in your favorite Nostr apps."
    />
    <meta property="og:image" content={`${page.url.origin}/image/nostxlogo.svg`} />
    <meta property="og:url" content={page.url.href} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
  {/if}
</svelte:head>

<div class="h-min-100vh">
  {@render children?.()}
  <Footer></Footer>
</div>
<style>
  .h-min-100vh {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>
