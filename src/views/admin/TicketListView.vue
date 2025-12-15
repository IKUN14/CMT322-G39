<template>
  <div class="ticket-list">
    <h2>Repair Management</h2>
    <div class="filters">
      <select v-model="filterStatus" class="select">
        <option value="">All Status</option>
        <option value="Submitted">Submitted</option>
        <option value="Accepted">Accepted</option>
        <option value="Assigned">Assigned</option>
        <option value="InProgress">In Progress</option>
      </select>
      <button @click="handleRefresh" class="btn btn-primary">Refresh</button>
      <button @click="handleExport" class="btn btn-success">Export CSV</button>
    </div>
    <div class="table-container">
      <table class="ticket-table">
        <thead>
          <tr>
            <th><input type="checkbox" @change="ticketStore.toggleSelectAll()" /></th>
            <th>Title</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Creator</th>
            <th>Assignee</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in filteredTickets" :key="ticket.id">
            <td>
              <input
                type="checkbox"
                :checked="ticketStore.selectedTicketIds.includes(ticket.id)"
                @change="ticketStore.toggleSelectTicket(ticket.id)"
              />
            </td>
            <td>{{ ticket.title }}</td>
            <td>
              <span 
                class="status-badge" 
                :style="{ 
                  color: getStatusColor(ticket.status),
                  backgroundColor: getStatusBgColor(ticket.status)
                }"
              >
                {{ getStatusLabel(ticket.status) }}
              </span>
            </td>
            <td>
              <span 
                class="urgency-badge" 
                :style="{ 
                  color: getUrgencyColor(ticket.urgency),
                  backgroundColor: getUrgencyBgColor(ticket.urgency)
                }"
              >
                {{ ticket.urgency }}
              </span>
            </td>
            <td>{{ ticket.createdByName }}</td>
            <td>{{ ticket.currentAssigneeName || 'Unassigned' }}</td>
            <td>{{ formatTime(ticket.createdAt) }}</td>
            <td>
              <button @click="goToDetail(ticket.id)" class="btn btn-primary btn-sm">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredTickets.length === 0" class="empty">No repairs found</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketStore } from '@/stores/tickets'
import { getStatusLabel, getStatusColor, getStatusBgColor, getUrgencyColor, getUrgencyBgColor } from '@/utils/ticketStateMachine'
import type { TicketStatus } from '@/types'

const router = useRouter()
const ticketStore = useTicketStore()
const filterStatus = ref<TicketStatus | ''>('')

// Computed property to filter tickets based on selected status
const filteredTickets = computed(() => {
  if (!filterStatus.value) {
    return ticketStore.tickets
  }
  return ticketStore.tickets.filter(ticket => ticket.status === filterStatus.value)
})

const handleRefresh = () => {
  if (filterStatus.value) {
    ticketStore.fetchTickets({ status: [filterStatus.value] })
  } else {
    ticketStore.fetchTickets()
  }
}

// Watch for filter status changes and fetch filtered tickets
watch(filterStatus, (newStatus) => {
  if (newStatus) {
    ticketStore.fetchTickets({ status: [newStatus] })
  } else {
    ticketStore.fetchTickets()
  }
})

const handleExport = async () => {
  try {
    const csv = await ticketStore.exportCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `tickets-${new Date().toISOString()}.csv`
    link.click()
  } catch (error: any) {
    alert(error.message || 'Export failed')
  }
}

const goToDetail = (id: string) => {
  router.push(`/admin/tickets/${id}`)
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('en-US')
}

onMounted(() => {
  // Initial fetch without filter
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

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ticket-table {
  width: 100%;
  border-collapse: collapse;
}

.ticket-table th,
.ticket-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.ticket-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #606266;
}

.ticket-table tbody tr:hover {
  background-color: #f5f7fa;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.status-badge,
.urgency-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
