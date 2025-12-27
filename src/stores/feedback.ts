import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Feedback, CreateFeedbackRequest } from '@/types'
import { feedbackApi } from '@/services/supabaseApi'

export const useFeedbackStore = defineStore('feedback', () => {
  const feedbacks = ref<Feedback[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFeedbackByTicket(ticketId: string) {
    loading.value = true
    error.value = null
    try {
      feedbacks.value = await feedbackApi.fetchByTicket(ticketId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch feedback'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createFeedback(payload: CreateFeedbackRequest & { ticketId: string }) {
    loading.value = true
    error.value = null
    try {
      const fb = await feedbackApi.create(payload)
      if (fb) {
        feedbacks.value.unshift(fb)
      }
      return fb
    } catch (err: any) {
      error.value = err.message || 'Failed to create feedback'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    feedbacks,
    loading,
    error,
    fetchFeedbackByTicket,
    createFeedback
  }
})
