<template>
  <div class="workers-view">
    <h2>Maintenance Team</h2>
    <div class="filters">
      <input v-model="search" type="text" class="input" placeholder="Search workers..." />
      <button @click="handleRefresh" class="btn btn-primary">Refresh</button>
      <button @click="showAddDialog = true" class="btn btn-success">Add Worker</button>
    </div>
    <div class="worker-cards">
      <div v-for="worker in workerStore.workers" :key="worker.id" class="worker-card">
        <h3>{{ worker.name }}</h3>
        <p>Department: {{ worker.department }}</p>
        <p>Status: {{ getStatusLabel(worker.status) }}</p>
      </div>
      <div v-if="workerStore.workers.length === 0" class="empty">No workers available</div>
    </div>

    <!-- Add Worker Dialog -->
    <div v-if="showAddDialog" class="dialog-overlay" @click.self="showAddDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>Add Worker</h3>
          <button @click="showAddDialog = false" class="close-btn">&times;</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleCreateWorker">
            <div class="form-group">
              <label>Name <span style="color: red;">*</span></label>
              <input v-model="workerForm.name" type="text" class="input" placeholder="Please enter name" required />
            </div>
            <div class="form-group">
              <label>Username <span style="color: red;">*</span></label>
              <input v-model="workerForm.username" type="text" class="input" placeholder="Please enter username" required />
            </div>
            <div class="form-group">
              <label>Email <span style="color: red;">*</span></label>
              <input v-model="workerForm.email" type="email" class="input" placeholder="Please enter email" required />
            </div>
            <div class="form-group">
              <label>Password <span style="color: red;">*</span></label>
              <input v-model="workerForm.password" type="password" class="input" placeholder="Please enter password" required />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="workerForm.phone" type="tel" class="input" placeholder="Please enter phone" />
            </div>
            <div class="form-group">
              <label>Department <span style="color: red;">*</span></label>
              <input v-model="workerForm.department" type="text" class="input" placeholder="Please enter department" required />
            </div>
            <div class="form-group">
              <label>Status <span style="color: red;">*</span></label>
              <select v-model="workerForm.status" class="select" required>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div v-if="createError" class="error-message">{{ createError }}</div>
            <div class="dialog-actions">
              <button type="button" @click="showAddDialog = false" class="btn">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWorkerStore } from '@/stores/workers'
import { authApi } from '@/services/api'
import { UserRole } from '@/types'

const workerStore = useWorkerStore()
const search = ref('')
const showAddDialog = ref(false)
const creating = ref(false)
const createError = ref('')

const workerForm = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  status: 'available' as 'available' | 'busy' | 'offline'
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline'
  }
  return labels[status] || status
}

const handleRefresh = () => {
  workerStore.fetchWorkers(search.value)
}

const handleCreateWorker = async () => {
  creating.value = true
  createError.value = ''
  
  try {
    // First create user account (Worker role), use createUser to avoid changing current login state
    const newUser = await authApi.createUser({
      username: workerForm.value.username,
      email: workerForm.value.email,
      password: workerForm.value.password,
      name: workerForm.value.name,
      role: UserRole.Worker
    })
    
    // Then create worker profile using the newly created user ID
    await workerStore.createWorker({
      userId: newUser.id,
      name: workerForm.value.name,
      phone: workerForm.value.phone,
      department: workerForm.value.department,
      skills: [],
      status: workerForm.value.status
    })
    
    // Reset form
    workerForm.value = {
      name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      department: '',
      status: 'available'
    }
    showAddDialog.value = false
    alert('Worker created successfully')
    
    // Refresh list
    await workerStore.fetchWorkers()
  } catch (error: any) {
    createError.value = error.message || 'Failed to create'
  } finally {
    creating.value = false
  }
}

watch(search, () => {
  workerStore.fetchWorkers(search.value)
})

onMounted(() => {
  workerStore.fetchWorkers()
})
</script>

<style scoped>
.workers-view {
  padding: 20px;
}

.workers-view h2 {
  margin-bottom: 20px;
  color: #303133;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filters .input {
  width: 300px;
}

.worker-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.worker-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.worker-card h3 {
  margin-bottom: 12px;
  color: #303133;
}

.worker-card p {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #909399;
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
