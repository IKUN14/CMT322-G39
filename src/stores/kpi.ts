import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { KPI } from '@/types'
import { kpiApi } from '@/services/api'

export const useKpiStore = defineStore('kpi', () => {
  const kpi = ref<KPI | null>(null)
  const loading = ref(false)

  async function fetchKPI() {
    loading.value = true
    try {
      kpi.value = await kpiApi.getKPI()
      return kpi.value
    } catch (error) {
      console.error('Failed to fetch KPI:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    kpi,
    loading,
    fetchKPI
  }
})
