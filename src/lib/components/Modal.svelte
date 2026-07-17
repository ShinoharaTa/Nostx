<script lang="ts">
import type { Snippet } from "svelte";
import { showModal, closeModal } from "$lib/ui";
import { _ } from "svelte-i18n";
let {
	modalTitle = null,
	children,
	footer,
}: {
	modalTitle?: null | string;
	children?: Snippet;
	footer?: Snippet;
} = $props();
</script>

<!-- ZAP Modal -->
{#if $showModal}
  <div class="modal fade show d-block" tabindex="-1" data-bs-theme="dark">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{modalTitle}</div>
          <button
            type="button"
            class="btn-close"
            aria-label={$_("profile.close")}
            onclick={closeModal}
          ></button>
        </div>
        <div class="modal-body">
          {@render children?.()}
        </div>
        <div class="modal-footer">
          {@render footer?.()}
        </div>
      </div>
    </div>
  </div>
{/if}