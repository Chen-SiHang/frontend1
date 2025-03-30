<template>
  <nav class="relative z-10 w-full py-2.5">
    <div class="bg-white max-w-7xl mx-auto py-3 px-6 rounded-xl flex justify-between items-center shadow-sm">
      <!-- 左侧 Logo 和标题 -->
      <div class="flex items-center gap-3">
        <img src="/images/logo-2.png" alt="校徽" class="h-8 w-8" />
        <span class="text-[#2B5876] text-lg font-medium">学生综合素质评价系统 - 管理面板</span>
      </div>
      
      <!-- 中间导航菜单 -->
      <div class="flex gap-5">
        <div 
          v-for="(item, index) in navItems" 
          :key="index"
          class="relative group"
        >
          <a 
            :class="[
              'px-4 py-2 rounded-md text-sm transition-all duration-200 inline-block',
              item.active 
                ? 'bg-[#2B5876] text-white' 
                : 'text-[#666] hover:bg-gray-100 hover:text-[#2B5876]'
            ]"
            href="#"
            @click.prevent="$emit('nav-click', index)"
          >
            {{ item.text }}
          </a>
          <!-- 下拉菜单 -->
          <div class="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div class="bg-[#EBF3F8] rounded-md py-2 min-w-[120px] shadow-lg">
              <a 
                v-for="(subItem, subIndex) in ['选项1', '选项2', '选项3']" 
                :key="subIndex"
                href="#"
                class="block px-4 py-2 text-sm text-[#2B5876] hover:bg-[#2B5876] hover:text-white transition-colors duration-200"
                @click.prevent
              >
                {{ subItem }}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧退出按钮 -->
      <div class="ml-5">
        <button 
          class="flex items-center gap-1.5 px-4 py-2 border border-[#2B5876] rounded-md bg-transparent text-[#2B5876] text-sm hover:bg-[#2B5876] hover:text-white transition-all duration-200"
          @click="$emit('logout')"
        >
          <span class="font-normal">⇥</span>
          退出登录
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavItem {
  text: string;
  active: boolean;
  route?: string;
}

defineProps<{
  navItems: NavItem[]
}>()

defineEmits<{
  (e: 'nav-click', index: number): void
  (e: 'logout'): void
}>()
</script>

<style scoped>
/* 可以添加额外的样式 */
.group:hover .absolute {
  transform: translateY(0);
  pointer-events: auto;
}

.absolute {
  transform: translateY(-10px);
  pointer-events: none;
}
</style> 