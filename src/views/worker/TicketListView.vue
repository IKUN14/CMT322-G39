<template>
  <div class="ticket-list">
    <h2>My Repairs</h2>
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
          <span>Location: {{ ticket.location }}</span>
          <span>
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
const activeTab = ref<'assigned' | 'inprogress'>('assigned')

const filteredTickets = computed(() => {
  const userId = authStore.user?.id
  if (!userId) {
    return []
  }
  
  if (activeTab.value === 'assigned') {
    return ticketStore.tickets.filter(
      t => t.status === TicketStatus.Assigned && t.currentAssignee === userId
    )
  } else {
    return ticketStore.tickets.filter(
      t => t.status === TicketStatus.InProgress && t.currentAssignee === userId
    )
  }
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

.ticket-list h2 {
  margin-bottom: 20px;
  color: #303133;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  background-color: #409eff;
  color: white;
}

.ticket-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.ticket-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ticket-header h3 {
  font-size: 16px;
  color: #303133;
  margin: 0;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
}

.ticket-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #909399;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
