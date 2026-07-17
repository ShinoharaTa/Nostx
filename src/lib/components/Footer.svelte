<script lang="ts">
import { setLocale } from "$lib/i18n";
import { _, locale } from "svelte-i18n";

const current = $derived($locale?.startsWith("ja") ? "ja" : "en");
</script>

<footer class="bg-surface-800 text-white p-3 flex justify-center">
  <div class="text-center">
    <div>
      <a href="https://github.com/ShinoharaTa/Nostx" target="_blank" class="px-3">
        GitHub
      </a>
      <a href="https://github.com/ShinoharaTa/Nostx/issues" target="_blank" class="px-3">
        Support
      </a>
    </div>
    <div class="mt-2 lang-switch" role="group" aria-label={$_("a11y.language")}>
      <button
        type="button"
        class:active={current === "ja"}
        aria-pressed={current === "ja"}
        onclick={() => setLocale("ja")}
      >
        日本語
      </button>
      <span class="sep" aria-hidden="true">|</span>
      <button
        type="button"
        class:active={current === "en"}
        aria-pressed={current === "en"}
        onclick={() => setLocale("en")}
      >
        English
      </button>
    </div>
    <div class="mt-2">©2025 T.Shinohara</div>
  </div>
</footer>

<style>
  footer {
    margin-top: auto;
    text-align: center;
    font-size: 0.85rem;
  }
  .lang-switch button {
    background: none;
    border: none;
    padding: 0 0.5rem;
    color: #999;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .lang-switch button.active {
    color: #fff;
    text-decoration: underline;
  }
  .lang-switch .sep {
    color: #666;
  }
</style>
