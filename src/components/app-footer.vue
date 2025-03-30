<template>
  <footer class="app-footer">
    <p>{{ text }}</p>
  </footer>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Copyright © 2025 技术支持: 哈尔滨工业大学（威海）'
  }
})
</script>

<style scoped>
.app-footer {
  color: white;
  font-size: 14px;
  opacity: 0.8;
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
  padding: 15px 0;
  background: rgba(0, 83, 117, 0.9);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style> 