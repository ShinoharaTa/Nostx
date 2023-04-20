<template>
  <div class="page">
    <SelectModal :active="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { relayInit } from 'nostr-tools'

export default Vue.extend({
  // mounted() {
  //   const relay = relayInit('wss://relay.example.com')
  //   relay.on('connect', () => {
  //     console.log(`connected to ${relay.url}`)
  //   })
  //   relay.on('error', () => {
  //     console.log(`failed to connect to ${relay.url}`)
  //   })

  //   await relay.connect()

  //   // let's query for an event that exists
  //   let sub = relay.sub([
  //     {
  //       ids: [
  //         'd7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027',
  //       ],
  //     },
  //   ])
  //   sub.on('event', (event) => {
  //     console.log('we got the event we wanted:', event)
  //   })
  //   sub.on('eose', () => {
  //     sub.unsub()
  //   })

  //   // let's publish a new event while simultaneously monitoring the relay for it
  //   let sk = generatePrivateKey()
  //   let pk = getPublicKey(sk)

  //   let sub = relay.sub([
  //     {
  //       kinds: [1],
  //       authors: [pk],
  //     },
  //   ])

  //   sub.on('event', (event) => {
  //     console.log('got event:', event)
  //   })

  //   let event = {
  //     kind: 1,
  //     pubkey: pk,
  //     created_at: Math.floor(Date.now() / 1000),
  //     tags: [],
  //     content: 'hello world',
  //   }
  //   event.id = getEventHash(event)
  //   event.sig = signEvent(event, sk)

  //   let pub = relay.publish(event)
  //   pub.on('ok', () => {
  //     console.log(`${relay.url} has accepted our event`)
  //   })
  //   pub.on('failed', (reason) => {
  //     console.log(`failed to publish to ${relay.url}: ${reason}`)
  //   })

  //   let events = await relay.list([{ kinds: [0, 1] }])
  //   let event = await relay.get({
  //     ids: ['44e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245'],
  //   })

  //   relay.close()
  // },
})
</script>
