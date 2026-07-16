<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { validateNip19Input } from "$lib/validation";

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	const candidates = [
		params.get("text"),
		params.get("url"),
		params.get("title"),
	].filter((value): value is string => !!value);
	for (const candidate of candidates) {
		const result = validateNip19Input(candidate);
		if (result.status === "ok" && result.normalized) {
			goto(`/${result.normalized}`, { replaceState: true });
			return;
		}
	}
	goto("/", { replaceState: true });
});
</script>

<div class="page text-center">
	<div class="px-4 pt-5">Redirecting...</div>
</div>
