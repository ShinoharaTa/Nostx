<script lang="ts">
import { onMount } from "svelte";
import Application from "$lib/components/Application.svelte";
import { clients } from "$lib/const";
import { page } from "$app/state";
import { parseQuery } from "$lib/nostr";
import PostContent from "$lib/components/Content.svelte";
import Profile from "$lib/components/Profile.svelte";
import { _ } from "svelte-i18n";
import type { DecodeResult } from "nostr-tools/nip19";

const key: string = page.params.nip19;

let nip19decode: DecodeResult | null;
let process = true;

onMount(async () => {
	nip19decode = await parseQuery(key);
	console.log(nip19decode);
	process = false;
});
</script>

<div class="page">
  <div class="px-4 pt-3">
    <div class="d-grid">
      <div class="text-center">
        <a href="/">
          <img src="/image/nostxlogo.svg" class="img-fluid w-25" alt="" />
        </a>
      </div>
      {#if process}
        <div class="mt-5">Loading...</div>
      {:else}
        {#if nip19decode}
          <div class="mt-4">
            {#if nip19decode}
              {#if nip19decode.type === "npub"}
                <Profile id={nip19decode.data} />
              {:else if nip19decode.type === "nprofile"}
                <Profile id={nip19decode.data.pubkey} />
              {:else if nip19decode.type === "note"}
                <PostContent id={nip19decode.data} />
              {:else if nip19decode.type === "nevent"}
                <PostContent id={nip19decode.data.id} />
              {/if}
            {/if}
          </div>
          <div class="mt-3 text-center">{$_("app.client_select")}</div>
          <div class="row g-2">
            {#each clients as client}
              <Application {client} result={nip19decode} />
            {/each}
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
      {/if}
    </div>
  </div>
</div>
