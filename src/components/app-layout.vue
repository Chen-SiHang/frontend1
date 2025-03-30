<template>
  <div class="layout-container">
    <!-- 背景层 -->
    <app-background :type="backgroundType" :image="backgroundImage" />
    
    <!-- 导航栏层 (可选) -->
    <app-navbar 
      v-if="showNavbar"
      :navItems="navItems" 
      @nav-click="$emit('nav-click', $event)"
      @logout="$emit('logout')"
    />
    
    <!-- 内容层 -->
    <div :class="['content-container', {'with-navbar': showNavbar}]">
      <slot></slot>
    </div>
    
    <!-- 页脚层 -->
    <app-footer v-if="showFooter" :text="footerText" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import AppBackground from '@components/app-background.vue'
import AppNavbar from '@components/app-navbar.vue'
import AppFooter from '@components/app-footer.vue'

defineProps({
  backgroundType: {
    type: String,
    default: 'default'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  showNavbar: {
    type: Boolean,
    default: true
  },
  navItems: {
    type: Array,
    default: () => []
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  footerText: {
    type: String,
    default: 'Copyright © 2025 哈尔滨工业大学（威海）'
  }
})

defineEmits(['nav-click', 'logout'])
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.content-container {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

.content-container.with-navbar {
  padding-top: 10px;
}
</style> 