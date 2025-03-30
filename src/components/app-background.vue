<template>
  <div class="background-container">
    <canvas v-if="type === 'particles'" ref="particleCanvas" id="particleCanvas" class="particle-canvas"></canvas>
    <div 
      v-else-if="type === 'image'" 
      class="image-background"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
    <div v-else class="default-background"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useParticles } from '@composables/useParticles'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // 'particles', 'image', 'default'
    validator: (value: string) => ['particles', 'image', 'default'].includes(value)
  },
  image: {
    type: String,
    default: ''
  }
})

const particleCanvas = ref<HTMLCanvasElement | null>(null)
const { initParticles } = useParticles()

onMounted(() => {
  if (props.type === 'particles') {
    initParticles(particleCanvas.value)
  }
})

// 当类型变更时重新初始化
watch(() => props.type, (newType) => {
  if (newType === 'particles') {
    // 在下一个 tick 确保 DOM 已更新
    setTimeout(() => {
      initParticles(particleCanvas.value)
    }, 0)
  }
})
</script>

<style scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.default-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-blue);
}
</style> 