<script lang="ts">
  import { _ } from "svelte-i18n";

  const items = [
    {
      type: "note",
      status: "success",
      title: "投稿",
      key: "note1y3sjcuu90gz9e40xmntg0rytg9z3cxn6lm5cd5rlpy93p4ncz5lqn0xg5q",
    },
    {
      type: "note(nevent)",
      status: "success",
      title: "投稿",
      key: "nevent1qqszgcfvwwzh5pzu6hnde4583j95z3gurfa0a6vx6plsjzcs6eup20sk5ej4t",
    },
    {
      type: "note",
      status: "success",
      title: "投稿 with Image",
      key: "note1rpusku7lcjly6uurvmel68sxq4rsp3zfxm6zdk9d7vk4eur90j8q6javk3",
    },
    {
      type: "note",
      status: "danger",
      title: "投稿",
      key: "note1rpusku7lcjly6uurvmel68sxq4rsp3zfxm6zdk9d7vk4eur90j8q6javk5",
    },
    {
      type: "profile",
      status: "success",
      title: "ユーザー(npub)",
      key: "npub1l60d6h2uvdwa9yq0r7r2suhgrnsadcst6nsx2j03xwhxhu2cjyascejxe5",
    },
    {
      type: "profile",
      status: "success",
      title: "ユーザー(nprofile)",
      key: "nprofile1qqs0a8kat4wxxhwjjq83lp4gwt5pecwkug9afcr9f8cn8tnt79vfzwc7uwaal",
    },
    {
      type: "profile",
      status: "success",
      title: "ユーザー(NIP-05)",
      key: "shino3@shino3.net",
    },
    {
      type: "profile",
      status: "success",
      title: "ユーザー(NIP-05)",
      key: "shino3.net",
    },
    {
      type: "profile",
      status: "danger",
      title: "ユーザー(npub)",
      key: "npub1l60d6h2uvdwa9yq0r7r2suhgrnsadcst6nsx2j03xwhxhu2cjyascejxe6",
    },
    {
      type: "profile",
      status: "danger",
      title: "ユーザー(nprofile)",
      key: "nprofile1qqs0a8kat4wxxhwjjq83lp4gwt5pecwkug9afcr9f8cn8tnt79vfzwc7uwaak",
    },
    {
      type: "profile",
      status: "danger",
      title: "ユーザー(NIP-05)",
      key: "example.com",
    },
  ];
</script>

<div class="page">
  {#each items as item}
    <div class="my-3">
      <div class="item border-{item.status}">
        <div class="">{item.title}</div>
        <div class="mt-2 text-break">
          <a href="/{item.key}">{item.key}</a>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .item {
    font-size: 14px;
    padding: 1rem;
  }
</style>
