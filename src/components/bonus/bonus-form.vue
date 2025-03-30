<template>
  <div class="flex gap-11 mb-5 w-full box-border py-2.5">
    <div class="flex-1 grid grid-cols-3 gap-9 items-start">
      <TextInput
        id="title"
        label="标题"
        v-model="localFormData.title"
        placeholder="请输入加分标题"
        :required="true"
      />
      
      <div class="flex flex-col gap-2">
        <label class="text-sm text-text-light mb-1">加分类型 <span class="text-red-500">*</span></label>
        <select 
          v-model="localFormData.type"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 8L2 4h8z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-8"
        >
          <option value="" disabled>请选择加分类型</option>
          <option :value="BonusType.DailyBehavior">日常行为分</option>
          <option :value="BonusType.PersonalDevelopment">个性发展分</option>
        </select>
      </div>
      
      <TextInput
        id="points"
        label="分值"
        v-model="localFormData.points"
        placeholder="请输入分值"
        type="number"
        step="0.5"
        :required="true"
      />
      
      <TextInput
        id="activityId"
        label="活动编号"
        v-model="localFormData.activityId"
        placeholder="请输入活动编号"
        :required="true"
      />
      
      <TextInput
        id="studentIds"
        label="学生ID"
        v-model="localFormData.studentIds"
        placeholder="多个ID请用逗号分隔"
        :required="true"
        tips="多个ID请用逗号分隔"
      />
      
      <TextInput
        id="description"
        label="描述"
        v-model="localFormData.description"
        placeholder="请输入描述信息"
        :required="false"
        tips="(选填)"
      />
    </div>
    <div class="flex flex-col gap-4 pt-6 min-w-[150px] ml-4">
      <input 
        type="file" 
        ref="fileInput"
        accept=".csv,.xlsx" 
        class="hidden"
        @change="handleFileChange"
      >
      <button 
        class="btn primary w-full"
        @click="triggerFileInput"
        :disabled="loading"
      >
        <span class="icon">↑</span>
        导入Excel/CSV
      </button>
      <button 
        class="btn primary w-full"
        @click="handleSubmit"
        :disabled="loading"
      >
        <Spinner v-if="loading" size="sm" />
        <span v-else>提交</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BonusType } from '@models/bonus'
import TextInput from '@components/input-text.vue'
import Spinner from '@components/spinner.vue'

interface BonusFormData {
  title: string
  description: string
  type: string | number
  points: string | number
  activityId: string
  studentIds: string
}

const props = defineProps<{
  formData: BonusFormData
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:formData', value: BonusFormData): void
  (e: 'submit', data: BonusFormData): void
  (e: 'file-upload', file: File): void
}>()

const localFormData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value)
})

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (): void => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-upload', file)
  }
}

const handleSubmit = (): void => {
  emit('submit', localFormData.value)
}
</script> 