<template>
  <div class="ticket-list">
    <div class="page-header">
      <div>
        <h2>My Repairs</h2>
        <p class="subtitle">Focus on your assigned tasks</p>
      </div>
      <div class="tabs">
        <button
          :class="['tab', { active: activeTab === 'assigned' }]"
          @click="activeTab = 'assigned'"
        >
          Pending
        </button>
        <button
          :class="['tab', { active: activeTab === 'inprogress' }]"
          @click="activeTab = 'inprogress'"
        >
          In Progress
        </button>
        <button
          :class="['tab', { active: activeTab === 'history' }]"
          @click="activeTab = 'history'"
        >
          History
        </button>
      </div>
    </div>
    <div class="ticket-items">
      <div
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="ticket-item"
        @click="goToDetail(ticket.id)"
      >
        <div class="ticket-header">
          <h3>{{ ticket.title }}</h3>
          <span 
            class="status-badge" 
            :style="{ 
              color: getStatusColor(ticket.status),
              backgroundColor: getStatusBgColor(ticket.status)
            }"
          >
            {{ getStatusLabel(ticket.status) }}
          </span>
        </div>
        <div class="ticket-info">
          <span class="info-pill">Location: {{ ticket.location }}</span>
          <span class="info-pill">
            Urgency:
            <span 
              class="urgency-badge" 
              :style="{ 
                color: getUrgencyColor(ticket.urgency),
                backgroundColor: getUrgencyBgColor(ticket.urgency)
              }"
            >
              {{ ticket.urgency }}
            </span>
          </span>
        </div>
      </div>
      <div v-if="filteredTickets.length === 0" class="empty">No repairs found</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTicketStore } from '@/stores/tickets'
import { getStatusLabel, getStatusColor, getStatusBgColor, getUrgencyColor, getUrgencyBgColor } from '@/utils/ticketStateMachine'
import { TicketStatus } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const ticketStore = useTicketStore()
const activeTab = ref<'assigned' | 'inprogress' | 'history'>('assigned')

const filteredTickets = computed(() => {
  const userId = authStore.user?.id
  if (!userId) {
    return []
  }
  
  if (activeTab.value === 'assigned') {
    return ticketStore.tickets.filter(
      t => t.status === TicketStatus.Assigned && t.currentAssignee === userId
    )
  }
  if (activeTab.value === 'inprogress') {
    return ticketStore.tickets.filter(
      t => t.status === TicketStatus.InProgress && t.currentAssignee === userId
    )
  }
  return ticketStore.tickets.filter(
    t =>
      (t.status === TicketStatus.Resolved || t.status === TicketStatus.Closed) &&
      t.currentAssignee === userId
  )
})

const goToDetail = (id: string) => {
  router.push(`/worker/tickets/${id}`)
}

onMounted(async () => {
  // Ensure user information is loaded
  if (!authStore.user) {
    await authStore.fetchCurrentUser()
  }
  // Load all repair request data
  await ticketStore.fetchTickets()
})
</script>

<style scoped>
.ticket-list {
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

.tabs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.tab {
  padding: 8px 16px;
  border: 1px solid rgba(39, 83, 231, 0.2);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s;
  color: #0f1b3d;
  box-shadow: 0 6px 14px rgba(15, 27, 61, 0.08);
}

.tab.active {
  background-color: #2753e7;
  color: white;
  box-shadow: 0 8px 18px rgba(39, 83, 231, 0.35);
}

.ticket-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-item {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 10px 24px rgba(15, 27, 61, 0.08);
  border: 1px solid rgba(39, 83, 231, 0.08);
  cursor: pointer;
  transition: box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticket-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-header h3 {
  font-size: 16px;
  color: #0f1b3d;
  margin: 0;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.ticket-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 20px;
  font-size: 14px;
  color: #5f6b8a;
}

.info-pill {
  background: rgba(15, 27, 61, 0.04);
  border-radius: 999px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.urgency-badge {
  padding: 3px 8px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #5f6b8a;
}

@media (max-width: 720px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tabs {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
