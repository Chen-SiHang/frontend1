<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[500px] max-w-[90%]">
      <h3 class="text-lg font-medium mb-4">编辑加分条</h3>
      <div class="space-y-4">
        <TextInput
          id="edit-title"
          label="标题"
          v-model="localForm.title"
          :required="true"
        />
        
        <TextInput
          id="edit-description"
          label="描述"
          v-model="localForm.description"
        />
        
        <TextInput
          id="edit-points"
          label="分值"
          v-model="localForm.points"
          type="number"
          step="0.5"
          :required="true"
        />
        
        <div class="flex flex-col gap-1">
          <label class="text-sm text-text-light">状态</label>
          <select 
            v-model="localForm.status"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
          >
            <option :value="BonusStatus.Pending">待审核</option>
            <option :value="BonusStatus.Approved">已通过</option>
            <option :value="BonusStatus.Rejected">已拒绝</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button 
          class="btn secondary"
          @click="$emit('update:show', false)"
        >
          取消
        </button>
        <button 
          class="btn primary"
          @click="$emit('save')"
          :disabled="loading"
        >
          <Spinner v-if="loading" size="sm" />
          <span v-else>保存</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BonusStatus } from '@models/bonus'
import TextInput from '@components/input-text.vue'
import Spinner from '@components/spinner.vue'

interface EditFormData {
  title?: string
  description?: string
  points?: number | string
  status?: number | string
}

const props = defineProps<{
  show: boolean
  form: EditFormData
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:form', value: EditFormData): void
  (e: 'save'): void
}>()

const localForm = computed({
  get: () => props.form,
  set: (value) => emit('update:form', value)
})
</script> 