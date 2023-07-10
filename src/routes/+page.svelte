<script lang="ts">
  import { onMount } from "svelte";
  import ClientSelect from "../components/ClientSelect.svelte";
  import { getLocalStorage, updateLocalStorage } from "$lib/app";
  import type { Config } from "$lib/app";

  let error = false;
  const config: Config = getLocalStorage();
  onMount(async () => {
    console.log(config)
  });
  function saveSetting() {
    updateLocalStorage(config)
  }
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="d-grid">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
      {#if !error}
        <div class="mt-5 text-center">クライアントを選択</div>
        <ClientSelect bind:select={config.client} />
      {:else}
        <div
          class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
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
      {/if}
    </div>

    <div class="text-center mt-4">
      <div class="mt-3 text-white">
        <input
          type="checkbox"
          id="select_0"
          name="select_0"
          bind:checked={config.auto}
        />
        <label for="select_0" class="">常にこのアプリを使用する</label>
      </div>
      <div class="mt-4">
        <button class="btn btn-lg bg-brand px-4" on:click={saveSetting}>
          設定を保存
        </button>
      </div>
    </div>
  </div>
  <div class="text-center mt-4">
    <a href="/qr">QRコードを作る</a>
  </div>
</div>
