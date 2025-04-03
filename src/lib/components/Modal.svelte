<script lang="ts">
import { showModal, closeModal } from "$lib/ui";
export let modalTitle: null | string = null;
</script>

<!-- ZAP Modal -->
{#if $showModal}
  <div class="modal fade show d-block" tabindex="-1" data-bs-theme="dark">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{modalTitle}</div>
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button type="button" class="btn-close" on:click={closeModal}></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
{/if}