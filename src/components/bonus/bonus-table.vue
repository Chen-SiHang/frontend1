<template>
  <div class="h-auto max-h-[500px] bg-background-light rounded-lg p-5 flex flex-col mt-2.5">
    <div class="flex justify-between items-start mb-4">
      <h3 class="m-0 text-text-light font-medium">加分记录</h3>
      <div class="flex gap-[70px] items-center flex-nowrap">
        <div class="relative w-[200px]">
          <input 
            type="text" 
            v-model="localSearchQuery"
            placeholder="搜索标题/活动编号"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
          <span class="absolute left-[calc(100%+25px)] top-1/2 -translate-y-1/2 text-text-light text-base">🔍</span>
        </div>
        <div class="flex items-center gap-2">
          <select 
            v-model="localFilterType"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-[130px] appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 8L2 4h8z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-8"
          >
            <option value="">所有类型</option>
            <option :value="BonusType.DailyBehavior">日常行为分</option>
            <option :value="BonusType.PersonalDevelopment">个性发展分</option>
          </select>
          <select 
            v-model="localFilterStatus"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-[130px] appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 8L2 4h8z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-8"
          >
            <option value="">所有状态</option>
            <option :value="BonusStatus.Pending">待审核</option>
            <option :value="BonusStatus.Approved">已通过</option>
            <option :value="BonusStatus.Rejected">已拒绝</option>
          </select>
          <button 
            class="btn primary h-[35px] transition-colors duration-300"
            @click="$emit('search')"
          >
            查询
          </button>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto bonus-table-container rounded-md bg-white min-h-[300px] max-h-[400px] shadow-sm mt-5">
      <table class="w-full border-collapse text-left">
        <thead class="sticky top-0 bg-white z-10 shadow-sm">
          <tr>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[60px]">ID</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[180px]">标题</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[100px]">类型</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[80px]">分值</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[120px]">活动编号</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[100px]">状态</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[120px]">创建时间</th>
            <th class="px-4 py-3 border-b border-gray-100 text-sm font-normal text-text-light bg-white w-[120px]">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-8">
              <Spinner size="md" />
            </td>
          </tr>
          <tr v-else-if="bonusList.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">暂无数据</td>
          </tr>
          <tr v-else v-for="bonus in bonusList" :key="bonus.id">
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ bonus.id }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ bonus.title }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ bonus.typeString() }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ bonus.points }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ bonus.activityId }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs',
                  bonus.status === BonusStatus.Pending ? 'bg-yellow-100 text-yellow-800' : 
                  bonus.status === BonusStatus.Approved ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ bonus.statusString() }}
              </span>
            </td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm text-gray-800">{{ formatDate(bonus.createdAt) }}</td>
            <td class="px-4 py-3 border-b border-gray-100 text-sm">
              <button 
                class="action-btn edit px-3 py-1 rounded text-blue-600 hover:bg-blue-50"
                @click="$emit('edit', bonus)"
              >编辑</button>
              <button 
                class="action-btn delete px-3 py-1 rounded text-red-600 hover:bg-red-50"
                @click="$emit('delete', bonus.id)"
              >删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bonus, BonusType, BonusStatus } from '@models/bonus'
import { GoodDate } from '@utils/datetime'
import Spinner from '@components/spinner.vue'

const props = defineProps<{
  bonusList: Bonus[]
  loading: boolean
  searchQuery: string
  filterType: string | number
  filterStatus: string | number
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:filterType', value: string | number): void
  (e: 'update:filterStatus', value: string | number): void
  (e: 'search'): void
  (e: 'edit', bonus: Bonus): void
  (e: 'delete', id: string): void
}>()

const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value)
})

const localFilterType = computed({
  get: () => props.filterType,
  set: (value) => emit('update:filterType', value)
})

const localFilterStatus = computed({
  get: () => props.filterStatus,
  set: (value) => emit('update:filterStatus', value)
})

const formatDate = (date: GoodDate): string => {
  if (!date) return ''
  return date.toLocaleDateString()
}
</script>

<style scoped>
/* 添加按钮之间的间距 */
.action-btn.edit {
  margin-right: 16px;
}

.action-btn {
  transition: background-color 0.2s;
}
</style> 