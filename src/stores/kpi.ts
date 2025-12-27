import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { KPI } from '@/types'
import { kpiApi } from '@/services/supabaseApi'

export const useKpiStore = defineStore('kpi', () => {
  const kpi = ref<KPI | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchKPI() {
    loading.value = true
    error.value = null
    try {
      kpi.value = await kpiApi.getKPI()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch KPI'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    kpi,
    loading,
    error,
    fetchKPI
  }
})
