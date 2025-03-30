<template>
  <nav class="nav-bar">
    <div class="nav-content">
      <div class="nav-logo">
        <div class="h-8 w-8 bg-primary-blue rounded-md flex items-center justify-center text-white font-bold">S</div>
        <span>学生综合素质评价系统 - 管理面板</span>
      </div>
      <div class="nav-links">
        <a 
          v-for="(item, index) in navItems" 
          :key="index"
          :class="['nav-item', { active: item.active }]"
          @click="handleNavClick(index)"
          href="#"
        >
          {{ item.text }}
        </a>
      </div>
      <div class="nav-logout">
        <button class="logout-btn" @click="handleLogout">
          <i class="logout-icon">⇥</i>
          退出登录
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  navItems: Array
})

const emit = defineEmits(['nav-click', 'logout'])

const handleNavClick = (index) => {
  emit('nav-click', index)
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.nav-bar {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
}

.nav-content {
  background: rgba(255, 255, 255, 0.95);
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 25px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-logo span {
  font-size: 18px;
  font-weight: 500;
  color: var(--primary-blue);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 6px;
  color: var(--text-light);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--background-light);
  color: var(--primary-blue);
}

.nav-item.active {
  background: var(--primary-blue);
  color: white;
}

.nav-logout {
  margin-left: 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--primary-blue);
  border-radius: 6px;
  background: transparent;
  color: var(--primary-blue);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--primary-blue);
  color: white;
}

.logout-icon {
  font-style: normal;
}
</style> 