<script lang="ts">
  import { clients } from "../lib/const";
  export let select = "";
</script>

{#each clients as client}
  <button
    class="item mt-3"
    class:selected={select === client.key}
    on:click={() => {
      select = client.key;
    }}
  >
    <div class="d-flex align-items-center">
      <div class="bg-white app_icon">
        <img src={client.imgsrc} alt="" class="img-fluid" />
      </div>
      <div class="app_text">{client.name}</div>
    </div>
  </button>
{/each}

<style>
  .app_icon {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    margin-right: 2rem;
  }
  .app_text {
    font-size: 16px;
  }
</style>
