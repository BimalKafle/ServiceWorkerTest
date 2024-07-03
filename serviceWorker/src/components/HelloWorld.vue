<script setup>
import { ref, onMounted } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);

const startTimer = () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage("start timer");
    console.log("Message posted to service worker");
  } else {
    console.log("No active service worker controller");
  }
};
const stopTimer = () => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage("stop timer");
    console.log("Message posted to service worker to stop timer");
  }
};
onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      count.value = event.data;
      console.log("Message received from service worker");
    });
  }
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="startTimer">count is {{ count }}</button>
    <button type="button" @click="stopTimer">Stop</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
  <div class="controls" tabindex="0">
    <p class="result">Result: 0</p>
  </div>
  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
