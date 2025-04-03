import { get, writable } from "svelte/store";

export const showModal = writable(false)
export const closeModal = () => {showModal.set(false)}
export const openModal = () => {showModal.set(true)}