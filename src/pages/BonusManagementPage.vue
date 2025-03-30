<template>
  <app-layout
    backgroundType="particles"
    :navItems="navItems"
    showNavbar
    showFooter
    @nav-click="handleNavClick"
    @logout="handleLogout"
  >
    <div class="card">
      <!-- 加分表单 -->
      <bonus-form
        v-model:formData="formData"
        :loading="loading"
        @submit="handleSubmit"
        @file-upload="handleFileChange"
      />
      
      <!-- 记录表格 -->
      <bonus-table
        :bonusList="records"
        :loading="tableLoading"
        v-model:searchQuery="searchQuery"
        v-model:filterType="filterType"
        v-model:filterStatus="filterStatus"
        @search="handleSearch"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    
    <bonus-edit-modal
      v-model:show="showEditModal"
      v-model:form="editForm"
      :loading="editLoading"
      @save="handleSaveEdit"
    />
  </app-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Bonus, BonusType, BonusStatus } from '../models/bonus'
import { setCookie } from '../utils/cookie'
import AppLayout from '@components/app-layout.vue'
import BonusForm from '@components/bonus/bonus-form.vue'
import BonusTable from '@components/bonus/bonus-table.vue'
import BonusEditModal from '@components/bonus/bonus-edit-modal.vue'
import { GoodDate } from '@utils/datetime'

// 获取全局消息服务
const { setMessage } = inject('banner') as { setMessage: (data: { type: string, message: string }) => void }

// 状态定义
const loading = ref(false)
const tableLoading = ref(false)
const editLoading = ref(false)
const showEditModal = ref(false)
const editForm = ref({
  title: '',
  description: '',
  points: '',
  status: ''
})

// 导航组件
const navItems = ref([
  { text: '首页', active: false },
  { text: '申诉中心', active: false },
  { text: '成绩管理', active: true },
  { text: '成绩导出', active: false }
])

// 表格数据
const records = ref<Bonus[]>([])

// 模拟加载数据
const loadMockData = () => {
  tableLoading.value = true
  
  // 模拟API延迟
  setTimeout(() => {
    records.value = [
      {
        id: '1',
        title: '学科竞赛获奖',
        description: '参加全国数学建模比赛获奖',
        type: BonusType.PersonalDevelopment,
        points: 3.5,
        activityId: 'ACT2023001',
        createdBy: 'teacher1',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080901', '2021080902'],
        typeString: () => '个性发展分',
        statusString: () => '已通过'
      },
      {
        id: '2',
        title: '担任班级干部',
        description: '本学期担任班长工作',
        type: BonusType.DailyBehavior,
        points: 2.0,
        activityId: 'ACT2023002',
        createdBy: 'teacher1',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Pending,
        studentIds: ['2021080903'],
        typeString: () => '日常行为分',
        statusString: () => '待审核'
      },
      {
        id: '3',
        title: '社会实践活动',
        description: '参加暑期社会实践',
        type: BonusType.PersonalDevelopment,
        points: 4.0,
        activityId: 'ACT2023003',
        createdBy: 'teacher2',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Rejected,
        studentIds: ['2021080904', '2021080905'],
        typeString: () => '个性发展分',
        statusString: () => '已拒绝'
      },
      // 新增加的10条记录
      {
        id: '4',
        title: '大学生创新创业大赛',
        description: '获得校级一等奖',
        type: BonusType.PersonalDevelopment,
        points: 5.0,
        activityId: 'ACT2023004',
        createdBy: 'teacher3',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080906', '2021080907', '2021080908'],
        typeString: () => '个性发展分',
        statusString: () => '已通过'
      },
      {
        id: '5',
        title: '志愿服务活动',
        description: '参与社区疫情防控志愿服务',
        type: BonusType.DailyBehavior,
        points: 1.5,
        activityId: 'ACT2023005',
        createdBy: 'teacher1',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080909', '2021080910'],
        typeString: () => '日常行为分',
        statusString: () => '已通过'
      },
      {
        id: '6',
        title: '科研论文发表',
        description: '在核心期刊发表学术论文',
        type: BonusType.PersonalDevelopment,
        points: 6.0,
        activityId: 'ACT2023006',
        createdBy: 'teacher4',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Pending,
        studentIds: ['2021080911'],
        typeString: () => '个性发展分',
        statusString: () => '待审核'
      },
      {
        id: '7',
        title: '参与学生会工作',
        description: '担任学生会文艺部部长',
        type: BonusType.DailyBehavior,
        points: 2.5,
        activityId: 'ACT2023007',
        createdBy: 'teacher2',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080912'],
        typeString: () => '日常行为分',
        statusString: () => '已通过'
      },
      {
        id: '8',
        title: '体育比赛获奖',
        description: '校运动会100米比赛第一名',
        type: BonusType.PersonalDevelopment,
        points: 3.0,
        activityId: 'ACT2023008',
        createdBy: 'teacher5',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080913'],
        typeString: () => '个性发展分',
        statusString: () => '已通过'
      },
      {
        id: '9',
        title: '参与社团活动',
        description: '主持举办校园文化节活动',
        type: BonusType.DailyBehavior,
        points: 2.0,
        activityId: 'ACT2023009',
        createdBy: 'teacher3',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Rejected,
        studentIds: ['2021080914', '2021080915'],
        typeString: () => '日常行为分',
        statusString: () => '已拒绝'
      },
      {
        id: '10',
        title: '专业技能证书',
        description: '获得软件开发高级工程师证书',
        type: BonusType.PersonalDevelopment,
        points: 4.5,
        activityId: 'ACT2023010',
        createdBy: 'teacher1',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080916'],
        typeString: () => '个性发展分',
        statusString: () => '已通过'
      },
      {
        id: '11',
        title: '班级活动组织',
        description: '组织班级团建活动',
        type: BonusType.DailyBehavior,
        points: 1.0,
        activityId: 'ACT2023011',
        createdBy: 'teacher2',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Pending,
        studentIds: ['2021080917', '2021080918'],
        typeString: () => '日常行为分',
        statusString: () => '待审核'
      },
      {
        id: '12',
        title: '学术报告参与',
        description: '参加学术讲座并提交心得体会',
        type: BonusType.PersonalDevelopment,
        points: 1.5,
        activityId: 'ACT2023012',
        createdBy: 'teacher4',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080919', '2021080920', '2021080921'],
        typeString: () => '个性发展分',
        statusString: () => '已通过'
      },
      {
        id: '13',
        title: '宿舍卫生评比',
        description: '宿舍获评学期文明宿舍',
        type: BonusType.DailyBehavior,
        points: 1.5,
        activityId: 'ACT2023013',
        createdBy: 'teacher5',
        createdAt: new GoodDate(),
        updatedAt: new GoodDate(),
        status: BonusStatus.Approved,
        studentIds: ['2021080922', '2021080923', '2021080924', '2021080925'],
        typeString: () => '日常行为分',
        statusString: () => '已通过'
      }
    ]
    tableLoading.value = false
  }, 1000)
}

// 修复BonusFormData接口定义问题
interface BonusFormData {
  title: string;
  description: string;
  type: string;
  points: string;
  activityId: string;
  studentIds: string;
}

// 表单数据
const formData = ref({
  title: '',
  description: '',
  type: '',
  points: '',
  activityId: '',
  studentIds: ''
})

// 搜索和筛选
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')

// 路由
const router = useRouter()

// 加载初始数据
onMounted(() => {
  loadMockData()
})

const handleNavClick = (index: number) => {
  navItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

const handleLogout = () => {
  setCookie('token', '', 0)
  router.push('/login')
}

const handleSubmit = async (data: BonusFormData): Promise<void> => {
  // 表单数据验证
  if (!data.title.trim()) {
    setMessage({ type: 'error', message: '请输入标题' })
    return
  }
  
  if (!data.type) {
    setMessage({ type: 'error', message: '请选择加分类别' })
    return
  }
  
  if (!data.points || isNaN(Number(data.points)) || Number(data.points) <= 0) {
    setMessage({ type: 'error', message: '请输入有效的分值' })
    return
  }
  
  if (!data.studentIds.trim()) {
    setMessage({ type: 'error', message: '请输入学生ID' })
    return
  }
  
  if (!data.activityId.trim()) {
    setMessage({ type: 'error', message: '请输入活动编号' })
    return
  }
  
  loading.value = true
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟成功响应
    const newBonus: Bonus = {
      id: Date.now().toString(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      type: Number(data.type),
      points: Number(data.points),
      activityId: data.activityId.trim(),
      studentIds: data.studentIds.split(',').map(id => id.trim()),
      createdBy: 'current_user',
      createdAt: new GoodDate(),
      updatedAt: new GoodDate(),
      status: BonusStatus.Pending,
      typeString: () => Number(data.type) === BonusType.DailyBehavior ? '日常行为分' : '个性发展分',
      statusString: () => '待审核'
    }
    
    // 更新本地记录列表
    records.value.unshift(newBonus)
    
    // 显示成功消息
    setMessage({ type: 'success', message: '加分记录提交成功' })
    
    // 重置表单
    formData.value = {
      title: '',
      description: '',
      type: '',
      points: '',
      activityId: '',
      studentIds: ''
    }
    
  } catch (error) {
    console.error('提交加分记录失败:', error)
    setMessage({ 
      type: 'error', 
      message: '提交失败，请稍后重试' 
    })
  } finally {
    loading.value = false
  }
}

const handleFileChange = (file: File): void => {
  // 检查文件类型
  const validTypes = ['.csv', '.xlsx', '.xls']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  
  if (!validTypes.includes(fileExt)) {
    setMessage({ type: 'error', message: '请上传CSV或Excel文件' })
    return
  }
  
  // 模拟文件上传和解析逻辑
  setMessage({ type: 'info', message: `文件 ${file.name} 上传中...` })
  
  setTimeout(() => {
    setMessage({ type: 'success', message: '文件上传成功，已添加3条记录' })
  }, 1500)
}

const handleSearch = (): void => {
  // 这里可以根据searchQuery、filterType和filterStatus进行搜索
  console.log('搜索参数:', { query: searchQuery.value, type: filterType.value, status: filterStatus.value })
  setMessage({ type: 'info', message: '正在搜索...' })
  
  // 模拟搜索请求
  tableLoading.value = true
  setTimeout(() => {
    // 模拟返回结果
    tableLoading.value = false
    setMessage({ type: 'success', message: '搜索完成' })
  }, 1000)
}

const handleEdit = (bonus: Bonus): void => {
  showEditModal.value = true
  editForm.value = {
    title: bonus.title,
    description: bonus.description,
    points: String(bonus.points),
    status: String(bonus.status)
  }
}

const handleSaveEdit = (): void => {
  editLoading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    editLoading.value = false
    showEditModal.value = false
    setMessage({ type: 'success', message: '更新成功' })
  }, 1000)
}

const handleDelete = async (id: string): Promise<void> => {
  if (confirm(`确定要删除该加分记录吗？`)) {
    try {
      // 模拟删除请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新本地记录
      records.value = records.value.filter(item => item.id !== id)
      setMessage({ type: 'success', message: '记录已删除' })
    } catch (error) {
      setMessage({ type: 'error', message: '删除失败，请稍后重试' })
    }
  }
}
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px 14px;
  width: 100%;
  max-width: 1280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  box-sizing: border-box;
}

/* 添加这些样式来实现导航栏按钮点击后蓝色背景高亮效果 */
:deep(.nav-item.active) {
  background-color: var(--primary-blue);
  color: white;
}

/* 添加这些样式来实现加分记录内部上下滚动条 */
:deep(.bonus-table-container) {
  max-height: 400px;
  overflow-y: auto;
}

/* 添加这些样式来实现编辑和删除按钮之间的间距 */
:deep(.action-btn) {
  margin-right: 12px;
}
</style> 