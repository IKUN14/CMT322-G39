<template>
  <div class="ticket-list">
    <h2>My Repairs</h2>
    <div class="filters">
      <select v-model="filterStatus" class="select" @change="handleFilter">
        <option value="">All Status</option>
        <option value="Submitted">Submitted</option>
        <option value="Accepted">Accepted</option>
        <option value="Assigned">Assigned</option>
        <option value="InProgress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
      <button @click="handleRefresh" class="btn btn-primary">Refresh</button>
    </div>
    <div v-if="ticketStore.loading" class="loading">Loading...</div>
    <div v-else class="ticket-items">
      <div
        v-for="ticket in ticketStore.tickets"
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
          <span>Created: {{ formatTime(ticket.createdAt) }}</span>
        </div>
      </div>
      <div v-if="ticketStore.tickets.length === 0" class="empty">
        No repairs found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketStore } from '@/stores/tickets'
import { getStatusLabel, getStatusColor, getStatusBgColor, getUrgencyColor, getUrgencyBgColor } from '@/utils/ticketStateMachine'
import type { TicketStatus } from '@/types'

const router = useRouter()
const ticketStore = useTicketStore()
const filterStatus = ref<TicketStatus | ''>('')

const handleFilter = () => {
  ticketStore.fetchTickets(
    filterStatus.value ? { status: [filterStatus.value as TicketStatus] } : undefined
  )
}

const handleRefresh = () => {
  ticketStore.fetchTickets()
}

const goToDetail = (id: string) => {
  router.push(`/student/tickets/${id}`)
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  ticketStore.fetchTickets()
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

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filters .select {
  width: 200px;
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

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
