<script lang="ts">
  import { onMount } from "svelte";
  import Application from "../../components/Application.svelte";
  import { clients } from "$lib/const";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { parseQuery } from "$lib/nostr";
  import type { ParsedNIP19 } from "$lib/nostr";
  import PostContent from "../../components/Content.svelte";
  import Profile from "../../components/Profile.svelte";
  import { _ } from "svelte-i18n";

  const key: string = $page.params.nip19;

  let result: ParsedNIP19 | null;
  let process: boolean = true;

  onMount(async () => {
    result = await parseQuery(key);
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
        {#if result}
          <div class="mt-4">
            {#if result}
              {#if result.type === "user"}
                <!-- content here -->
                <Profile id={result.hex} />
              {:else if result.type === "npub" || result.type === "nprofile"}
                <!-- else if content here -->
                <Profile id={result.hex} />
              {:else if result.type === "note" || result.type === "nevent"}
                <PostContent id={result.hex} />
              {/if}
            {/if}
          </div>
          <div class="mt-3 text-center">{$_("app.client_select")}</div>
          <div class="row g-2">
            {#each clients as client}
              <Application {client} {result} />
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
