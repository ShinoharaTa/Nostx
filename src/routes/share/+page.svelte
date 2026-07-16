<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";

const bech32Pattern =
	/(?:npub1|nprofile1|note1|nevent1|naddr1|nsec1)[a-z0-9]+/;

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	const shared = [
		params.get("text"),
		params.get("url"),
		params.get("title"),
	]
		.filter((value): value is string => !!value)
		.join(" ");
	const matched = shared.match(bech32Pattern);
	if (matched) {
		goto(`/${matched[0]}`, { replaceState: true });
	} else {
		goto("/", { replaceState: true });
	}
});
</script>

<div class="page text-center">
	<div class="px-4 pt-5">Redirecting...</div>
</div>
