import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Feedback, CreateFeedbackRequest } from '@/types'
import { feedbackApi } from '@/services/api'

export const useFeedbackStore = defineStore('feedback', () => {
  const feedbacks = ref<Feedback[]>([])
  const loading = ref(false)

  async function createFeedback(data: CreateFeedbackRequest) {
    loading.value = true
    try {
      const feedback = await feedbackApi.createFeedback(data)
      feedbacks.value.push(feedback)
      return feedback
    } catch (error) {
      console.error('Failed to create feedback:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchFeedbackByTicket(ticketId: string) {
    loading.value = true
    try {
      feedbacks.value = await feedbackApi.getFeedbackByTicket(ticketId)
      return feedbacks.value
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchAllFeedbacks() {
    loading.value = true
    try {
      feedbacks.value = await feedbackApi.getAllFeedbacks()
      return feedbacks.value
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    feedbacks,
    loading,
    createFeedback,
    fetchFeedbackByTicket,
    fetchAllFeedbacks
  }
})
