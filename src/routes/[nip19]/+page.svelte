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
import { validateNip19Input } from "$lib/validation";

const key: string = page.params.nip19;
const validation = validateNip19Input(key);

let nip19decode: DecodeResult | null;
let process = true;

onMount(async () => {
	if (validation.status === "nsec-warning" || validation.status === "unsupported") {
		// 秘密鍵や未対応形式はクライアントへ渡さない
		nip19decode = null;
	} else {
		// "invalid" でも NIP-05 (name@domain) の可能性があるため parseQuery に委ねる
		nip19decode = await parseQuery(key);
	}
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
      {:else if validation.status === "nsec-warning" || validation.status === "unsupported"}
        <div
          class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div class="bg-white error_icon">
              <img src="/image/error_icon.jpg" alt="" class="img-fluid" />
            </div>
          </div>
          <div class="mt-4">
            {#if validation.status === "nsec-warning"}
              {$_("validation.nsec_warning")}
            {:else}
              {$_("validation.unsupported")}
            {/if}
          </div>
        </div>
      {:else}
        {#if nip19decode}
          <div class="mt-4">
            {#if nip19decode}
              {#if nip19decode.type === "npub"}
                <Profile id={nip19decode.data} />
              {:else if nip19decode.type === "nprofile"}
                <Profile
                  id={nip19decode.data.pubkey}
                  relays={nip19decode.data.relays ?? []}
                />
              {:else if nip19decode.type === "note"}
                <PostContent id={nip19decode.data} />
              {:else if nip19decode.type === "nevent"}
                <PostContent
                  id={nip19decode.data.id}
                  relays={nip19decode.data.relays ?? []}
                  author={nip19decode.data.author}
                  kind={nip19decode.data.kind}
                />
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
              {#if validation.status === "invalid"}
                <div class="mt-2">{$_("validation.invalid")}</div>
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
