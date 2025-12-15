import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkerProfile } from '@/types'
import { workerApi } from '@/services/api'

export const useWorkerStore = defineStore('workers', () => {
  const workers = ref<WorkerProfile[]>([])
  const currentWorker = ref<WorkerProfile | null>(null)
  const loading = ref(false)

  const availableWorkers = computed(() => workers.value.filter(w => w.status === 'available'))
  const busyWorkers = computed(() => workers.value.filter(w => w.status === 'busy'))
  const offlineWorkers = computed(() => workers.value.filter(w => w.status === 'offline'))

  async function fetchWorkers(search?: string) {
    loading.value = true
    try {
      workers.value = await workerApi.listWorkers(search)
    } catch (error) {
      console.error('Failed to fetch workers:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchWorker(id: string) {
    loading.value = true
    try {
      currentWorker.value = await workerApi.getWorker(id)
      return currentWorker.value
    } catch (error) {
      console.error('Failed to fetch worker:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createWorker(data: Omit<WorkerProfile, 'id'>) {
    loading.value = true
    try {
      const worker = await workerApi.createWorker(data)
      workers.value.push(worker)
      return worker
    } catch (error) {
      console.error('Failed to create worker:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateWorker(id: string, data: Partial<WorkerProfile>) {
    loading.value = true
    try {
      const worker = await workerApi.updateWorker(id, data)
      const index = workers.value.findIndex(w => w.id === id)
      if (index !== -1) {
        workers.value[index] = worker
      }
      if (currentWorker.value?.id === id) {
        currentWorker.value = worker
      }
      return worker
    } catch (error) {
      console.error('Failed to update worker:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    workers,
    currentWorker,
    loading,
    availableWorkers,
    busyWorkers,
    offlineWorkers,
    fetchWorkers,
    fetchWorker,
    createWorker,
    updateWorker
  }
})
