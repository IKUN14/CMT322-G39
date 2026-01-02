<template>
  <div class="workers-view">
    <div class="page-header">
      <div>
        <h2>Maintenance Team</h2>
        <p class="subtitle">Manage worker availability and profiles</p>
      </div>
      <div class="filters">
        <input v-model="search" type="text" class="input" placeholder="Search workers..." />
        <button @click="handleRefresh" class="btn btn-primary" :disabled="loading">Refresh</button>
        <button @click="openAddDialog" class="btn btn-success" :disabled="loading">Add Worker</button>
      </div>
    </div>
    <div class="worker-cards">
      <div v-for="worker in filteredWorkers" :key="worker.id" class="worker-card">
        <div class="worker-header">
          <h3>{{ worker.name }}</h3>
          <span class="status-pill">{{ getStatusLabel(worker.status) }}</span>
        </div>
        <p>Department: {{ worker.department || 'Unassigned' }}</p>
        <div class="actions">
          <div class="status-segment">
            <button
              type="button"
              :class="['segment-btn', { active: workerStatuses[worker.id] === 'available' }]"
              :disabled="loading"
              @click="workerStatuses[worker.id] = 'available'"
            >
              Available
            </button>
            <button
              type="button"
              :class="['segment-btn', { active: workerStatuses[worker.id] === 'busy' }]"
              :disabled="loading"
              @click="workerStatuses[worker.id] = 'busy'"
            >
              Busy
            </button>
            <button
              type="button"
              :class="['segment-btn', { active: workerStatuses[worker.id] === 'offline' }]"
              :disabled="loading"
              @click="workerStatuses[worker.id] = 'offline'"
            >
              Offline
            </button>
          </div>
          <button class="btn btn-primary" :disabled="loading" @click="updateStatus(worker.id)">Update</button>
        </div>
      </div>
      <div v-if="filteredWorkers.length === 0" class="empty">No workers available</div>
    </div>

    <div v-if="showAddDialog" class="dialog-overlay" @click="closeAddDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>Add Worker</h3>
          <button @click="closeAddDialog" class="close-btn">×</button>
        </div>
        <form @submit.prevent="handleCreateWorker" class="dialog-body">
          <div class="form-group">
            <label>Email *</label>
            <input v-model="newWorker.email" type="email" class="input" required />
          </div>
          <div class="form-group">
            <label>Password *</label>
            <input v-model="newWorker.password" type="password" class="input" minlength="6" required />
            <small class="form-hint">Minimum 6 characters</small>
          </div>
          <div class="form-group">
            <label>Name *</label>
            <input v-model="newWorker.name" type="text" class="input" required />
          </div>
          <div class="form-group">
            <label>Department</label>
            <input v-model="newWorker.department" type="text" class="input" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="newWorker.phone" type="text" class="input" />
          </div>
          <div class="dialog-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create' }}
            </button>
            <button type="button" class="btn" @click="closeAddDialog">Cancel</button>
          </div>
          <div v-if="createError" class="error-message">{{ createError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWorkerStore } from '@/stores/workers'

const workerStore = useWorkerStore()
const search = ref('')
const loading = computed(() => workerStore.loading)
const workerStatuses = ref<Record<string, string>>({})
const showAddDialog = ref(false)
const createError = ref('')
const newWorker = ref({
  email: '',
  password: '',
  name: '',
  department: '',
  phone: ''
})

const filteredWorkers = computed(() => {
  if (!search.value) return workerStore.workers
  const keyword = search.value.toLowerCase()
  return workerStore.workers.filter(
    worker =>
      worker.name.toLowerCase().includes(keyword) ||
      worker.department.toLowerCase().includes(keyword) ||
      worker.status.toLowerCase().includes(keyword)
  )
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline'
  }
  return labels[status] || status
}

const handleRefresh = async () => {
  await workerStore.fetchWorkers(search.value)
  workerStatuses.value = Object.fromEntries(workerStore.workers.map(w => [w.id, w.status]))
}

const updateStatus = async (workerId: string) => {
  const status = workerStatuses.value[workerId]
  if (!status) return
  await workerStore.updateWorkerStatus(workerId, status as any)
}

const openAddDialog = () => {
  createError.value = ''
  showAddDialog.value = true
}

const closeAddDialog = () => {
  showAddDialog.value = false
  newWorker.value = { email: '', password: '', name: '', department: '', phone: '' }
}

const handleCreateWorker = async () => {
  createError.value = ''
  try {
    await workerStore.createWorker({ ...newWorker.value })
    await handleRefresh()
    closeAddDialog()
  } catch (err: any) {
    createError.value = err.message || 'Failed to create worker'
  }
}

watch(search, () => {
  handleRefresh()
})

onMounted(() => {
  handleRefresh()
})
</script>

<style scoped>
.workers-view {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h2 {
  margin-bottom: 6px;
  color: #0f1b3d;
}

.subtitle {
  color: #5f6b8a;
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filters .input {
  width: 280px;
}

.worker-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.worker-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 12px 26px rgba(15, 27, 61, 0.1);
  border: 1px solid rgba(39, 83, 231, 0.08);
}

.worker-card h3 {
  margin: 0;
  color: #0f1b3d;
}

.worker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.status-pill {
  background: rgba(39, 83, 231, 0.12);
  color: #2753e7;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.worker-card p {
  margin-bottom: 8px;
  color: #5f6b8a;
  font-size: 14px;
}

.actions {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.actions .btn {
  width: 100%;
}

.status-segment {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.segment-btn {
  border: 1px solid rgba(15, 27, 61, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: #0f1b3d;
  border-radius: 999px;
  padding: 8px 6px;
  font-size: 13px;
  white-space: nowrap;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-btn.active {
  background: #2753e7;
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 16px rgba(39, 83, 231, 0.25);
}

.segment-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
.empty {
  text-align: center;
  padding: 40px;
  color: #5f6b8a;
}

@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters {
    width: 100%;
  }

  .filters .input {
    width: 100%;
  }
}

/* Dialog styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.dialog-header h3 {
  margin: 0;
  color: #303133;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #909399;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background-color: #f5f7fa;
  color: #303133;
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.form-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.error-message {
  margin-top: 12px;
  padding: 8px;
  background-color: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  font-size: 14px;
}
</style>
