<template>
  <div class="score-input-section">
    <div class="input-area">
      <div class="form-group">
        <label>学号 <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formData.studentId"
          placeholder="请输入学号"
          required
        >
      </div>
      <div class="form-group">
        <label>姓名 <span class="optional">(选填)</span></label>
        <input 
          type="text" 
          v-model="formData.name"
          placeholder="请输入姓名"
        >
      </div>
      <div class="form-group">
        <label>加分类别 <span class="required">*</span></label>
        <select v-model="formData.scoreType" class="score-type" required>
          <option value="">请选择加分类别</option>
          <option value="daily">日常行为分</option>
          <option value="personal">个性发展分</option>
        </select>
      </div>
      <div class="form-group">
        <label>分值 <span class="required">*</span></label>
        <input 
          type="number" 
          step="0.5" 
          v-model="formData.score"
          placeholder="请输入分值"
          required
          min="0.5"
        >
      </div>
      <div class="form-group">
        <label>事由 <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formData.reason"
          placeholder="请输入加分事由"
          required
        >
      </div>
    </div>
    <div class="button-area">
      <input 
        type="file" 
        ref="fileInput"
        accept=".csv,.xlsx,.xls" 
        style="display: none;"
        @change="handleFileChange"
      >
      <button class="btn primary" @click="triggerFileInput" :disabled="loading">
        <i class="upload-icon">↑</i>
        导入Excel/CSV
      </button>
      <button 
        class="btn primary submit-btn" 
        @click="handleSubmit"
        :disabled="loading"
      >
        <span v-if="loading">提交中...</span>
        <span v-else>提交</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const fileInput = ref(null)
const formData = ref({
  studentId: '',
  name: '',
  scoreType: '',
  score: null,
  reason: ''
})

const emit = defineEmits(['submit', 'file-upload'])

const handleSubmit = () => {
  emit('submit', formData.value)
}

const resetForm = () => {
  formData.value = {
    studentId: '',
    name: '',
    scoreType: '',
    score: null,
    reason: ''
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  emit('file-upload', event)
  // 重置文件输入，以便可以再次选择同一文件
  event.target.value = ''
}

// 暴露resetForm方法给父组件
defineExpose({ resetForm })
</script>

<style scoped>
.score-input-section {
  margin-bottom: 30px;
}

.input-area {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-light);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.score-type {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 32px;
}

.button-area {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn.primary {
  background: var(--primary-light);
  color: white;
}

.upload-icon {
  font-style: normal;
  margin-right: 6px;
}

.required {
  color: red;
  margin-left: 4px;
}

.optional {
  color: #999;
  font-size: 12px;
  margin-left: 4px;
}

@media (max-width: 1400px) {
  .input-area {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
}

@media (max-width: 992px) {
  .input-area {
    grid-template-columns: minmax(250px, 1fr);
  }
}

@media (max-width: 768px) {
  .input-area {
    grid-template-columns: 1fr;
  }
  
  .button-area {
    flex-direction: column;
  }
}
</style> 