<script lang="ts">
  export let imgsrc: string = '';
  export let name: string = '';
</script>

<div class="d-flex align-items-center">
  <div class="bg-white app_icon">
    <img src={imgsrc} alt="" class="img-fluid" />
  </div>
  <div class="app_text">{name}</div>
</div>

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
