<script lang="ts">
  import { clients } from "../lib/const";
  export let select = "";
</script>

<div class="row g-2">
  {#each clients as client}
    <div class="col-3">
      <button
        class="item mt-2"
        class:selected={select === client.key}
        on:click={() => {
          select = client.key;
        }}
      >
        <div class="d-flex justify-content-center">
          <div class="bg-white app_icon">
            <img src={client.imgsrc} alt="" class="img-fluid" />
          </div>
        </div>
        <div class="app_text mt-1">{client.name}</div>
      </button>
    </div>
  {/each}
</div>

<style>
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
