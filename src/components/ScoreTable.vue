<template>
  <div class="score-details">
    <div class="score-header">
      <h3>导入记录</h3>
      <div class="search-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索学号/姓名/事由"
          >
          <i class="search-icon">🔍</i>
        </div>
        <div class="date-range">
          <input 
            type="date" 
            class="date-input" 
            v-model="startDate"
            placeholder="开始日期"
          >
          <span class="date-separator">至</span>
          <input 
            type="date" 
            class="date-input" 
            v-model="endDate"
            placeholder="结束日期"
          >
          <button class="btn primary" @click="handleSearch">查询</button>
        </div>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="60">序号</th>
            <th width="120">学号</th>
            <th width="100">姓名</th>
            <th width="80">分值</th>
            <th>事由</th>
            <th width="120">日期</th>
            <th width="100">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.studentId }}</td>
            <td>{{ record.name }}</td>
            <td class="score-value">{{ record.score }}</td>
            <td>{{ record.reason }}</td>
            <td>{{ record.date }}</td>
            <td>
              <button class="btn-link" @click="handleEdit(record)">编辑</button>
              <button class="btn-link delete" @click="handleDelete(record)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')

const emit = defineEmits(['search', 'edit', 'delete'])

const handleSearch = () => {
  emit('search', { query: searchQuery.value, startDate: startDate.value, endDate: endDate.value })
}

const handleEdit = (record) => {
  emit('edit', record)
}

const handleDelete = (record) => {
  emit('delete', record)
}
</script>

<style scoped>
.score-details {
  margin-top: 40px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.score-header h3 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.search-filters {
  display: flex;
  gap: 15px;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 200px;
  padding: 8px 12px;
  padding-left: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
  font-style: normal;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  width: 130px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.date-separator {
  color: var(--text-light);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

th {
  color: var(--text-light);
  font-weight: normal;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-light);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  font-size: 14px;
}

.delete {
  color: var(--danger);
}

.score-value {
  font-weight: 500;
  color: var(--primary-blue);
}

.btn {
  border: none;
  cursor: pointer;
  font-size: 14px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: var(--primary-light);
  color: white;
  transition: background-color 0.3s;
}

.btn.primary:hover {
  background: #1976d2;
}

@media (max-width: 1200px) {
  .score-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .search-filters {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .date-range {
    width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .date-range {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
  
  .date-input {
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 