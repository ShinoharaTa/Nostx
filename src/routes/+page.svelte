<script lang="ts">
  import { onMount } from "svelte";
  import ClientSelect from "../components/ClientSelect.svelte";
  import { getLocalStorage, updateLocalStorage } from "$lib/app";
  import type { Config } from "$lib/app";
  import { _ } from "svelte-i18n";

  const config: Config = getLocalStorage();
  onMount(async () => {
    console.log(config);
  });
  function saveSetting() {
    updateLocalStorage(config);
  }
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="d-grid">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
      <div class="mt-5 text-center">
        {$_("app.clinet_select", { default: "アプリを選ぶ" })}
      </div>
      <ClientSelect bind:select={config.client} />
    </div>

    <div class="text-center mt-4">
      <div class="mt-3 text-white">
        <input
          type="checkbox"
          id="select_0"
          name="select_0"
          bind:checked={config.auto}
        />
        <label for="select_0" class="">
          {$_("app.default_select", { default: "常にこのアプリを使用する" })}
        </label>
      </div>
      <div class="mt-4">
        <button class="btn btn-lg bg-brand px-4" on:click={saveSetting}>
          {$_("app.save", { default: "設定を保存する" })}
        </button>
      </div>
    </div>
  </div>
  <div class="text-center mt-4">
    <a href="/qr">QRコードを作る</a>
  </div>
</div>
