<script lang="ts">
  import { onMount } from "svelte";
  import ClientSelect from "../../components/ClientSelectHorizontal.svelte";
  import { getLocalStorage, updateLocalStorage } from "$lib/app";
  import type { Config } from "$lib/app";
  import { clients } from "$lib/const";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { parseQuery } from "$lib/nostr";
  import type { ParsedNIP19 } from "$lib/nostr";
  import PostContent from "../../components/Content.svelte";
  import Profile from "../../components/Profile.svelte";
  import { _ } from "svelte-i18n";

  let error = false;
  let process = false;
  const config: Config = getLocalStorage();

  const key: string = $page.params.nip19;
  console.log(key);

  function goBack() {
    window.history.back();
  }

  let result: ParsedNIP19 | null = null;

  onMount(async () => {
    result = await parseQuery(key);
    if(!result) {
      error = true;
      return;
    }
    if (config.auto) {
      selected();
    }
  });

  const selected = async () => {
    updateLocalStorage(config);
    const client = clients.find((item) => item.key == config.client);
    if (!client) return;
    if (!result) return;
    if (result.type === "user") {
      await goto(client.url_user + result.key);
    }
    if (result.type === "npub") {
      await goto(client.url_user + result.key);
    }
    if (result.type === "note") {
      await goto(client.url_note + result.key);
    }
  };
</script>

<div class="page">
  <div class="px-4 pt-3">
    <div class="d-grid">
      <div class="text-center">
        <a href="/">
          <img src="/image/nostxlogo.svg" class="img-fluid w-25" alt="" />
        </a>
      </div>
      {#if !error}
        <div class="mt-4">
          {#if result}
            {#if result.type === "user"}
              <!-- content here -->
              <Profile id={result.hex} />
            {:else if result.type === "npub"}
              <!-- else if content here -->
              <Profile id={result.hex} />
            {:else if result.type === "note"}
              <PostContent id={result.hex} />
            {/if}
          {/if}
        </div>
        <div class="mt-3 text-center">{$_("app.client_select")}</div>
        <ClientSelect bind:select={config.client} />
        <div class="text-center">
          <div class="mt-3 text-white">
            <input
              type="checkbox"
              id="select_0"
              name="select_0"
              bind:checked={config.auto}
            />
            <label for="select_0" class="">{$_("app.default_select")}</label>
          </div>
          <div class="mt-3">
            <button
              class="btn btn-lg bg-brand w-75"
              disabled={process}
              on:click={selected}
            >
              {#if !process}
                {$_("app.open_nostr")}
              {:else}
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    class="spinner-border me-3 spinner-border-sm"
                    role="status"
                  />
                  <div>Loading ...</div>
                </div>
              {/if}
            </button>
          </div>
        </div>
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
            {$_("single.error")}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
