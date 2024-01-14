<script lang="ts">
  import type { Client } from "$lib/const";
  import type { ParsedNIP19 } from "$lib/nostr";
  export let client: Client;
  export let result: ParsedNIP19;

  const linkUrl = () => {
    if (result.type === "user") {
      return client.url_user + result.key;
    }
    if (result.type === "npub") {
      return client.url_user + result.key;
    }
    if (result.type === "note") {
      return client.url_note + result.key;
    }
    return "";
  };
</script>

<div class="col-3">
  <a class="item mt-2 text-center" href="{linkUrl()}">
    <div class="d-flex justify-content-center">
      <div class="bg-white app_icon">
        <img src={client.imgsrc} alt="" class="img-fluid" />
      </div>
    </div>
    <div class="app_text mt-1">{client.name}</div>
  </a>
</div>

<style>
  a {
    display: inline-block;
    text-decoration: none;
  }
  .app_icon {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    /* margin-right: 2rem; */
  }
  .app_text {
    font-size: 8px;
  }
  .item {
    padding: 0.6rem 0;
    width: 100%;
  }
</style>
