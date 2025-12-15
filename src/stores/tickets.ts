import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ticket, TicketFilter, CreateTicketRequest, UpdateTicketStatusRequest, AssignTicketRequest, BatchAssignRequest, SubmitReportRequest, ConfirmTicketRequest } from '@/types'
import { TicketStatus } from '@/types'
import { ticketApi } from '@/services/api'

export const useTicketStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>([])
  const currentTicket = ref<Ticket | null>(null)
  const loading = ref(false)
  const selectedTicketIds = ref<string[]>([])

  // Computed properties
  const draftTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Draft))
  const submittedTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Submitted))
  const acceptedTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Accepted))
  const assignedTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Assigned))
  const inProgressTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.InProgress))
  const resolvedTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Resolved))
  const closedTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Closed))
  const canceledTickets = computed(() => tickets.value.filter(t => t.status === TicketStatus.Canceled))

  const hasSelected = computed(() => selectedTicketIds.value.length > 0)
  const isAllSelected = computed(() => {
    return tickets.value.length > 0 && selectedTicketIds.value.length === tickets.value.length
  })

  // Actions
  async function fetchTickets(filter?: TicketFilter) {
    loading.value = true
    try {
      tickets.value = await ticketApi.listTickets(filter)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchTicket(id: string) {
    loading.value = true
    try {
      const ticket = await ticketApi.getTicket(id)
      // Use new object reference to ensure reactive update
      currentTicket.value = { ...ticket }
      // Also update the ticket in the list
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tickets.value[index] = { ...ticket }
      }
      return currentTicket.value
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createTicket(data: CreateTicketRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.createTicket(data)
      tickets.value.unshift(ticket)
      return ticket
    } catch (error) {
      console.error('Failed to create ticket:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateTicketStatus(data: UpdateTicketStatusRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.updateTicketStatus(data)
      // Update the ticket in the list
      const index = tickets.value.findIndex(t => t.id === ticket.id)
      if (index !== -1) {
        tickets.value[index] = ticket
      }
      // Ensure currentTicket is updated correctly (use new object reference to trigger reactive update)
      if (currentTicket.value?.id === ticket.id) {
        currentTicket.value = { ...ticket }
      }
      return ticket
    } catch (error) {
      console.error('Failed to update ticket status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function assignTicket(data: AssignTicketRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.assignTicket(data)
      const index = tickets.value.findIndex(t => t.id === ticket.id)
      if (index !== -1) {
        tickets.value[index] = { ...ticket }
      }
      if (currentTicket.value?.id === ticket.id) {
        currentTicket.value = { ...ticket }
      }
      return ticket
    } catch (error) {
      console.error('Failed to assign ticket:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function reassignTicket(data: AssignTicketRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.reassignTicket(data)
      const index = tickets.value.findIndex(t => t.id === ticket.id)
      if (index !== -1) {
        tickets.value[index] = { ...ticket }
      }
      if (currentTicket.value?.id === ticket.id) {
        currentTicket.value = { ...ticket }
      }
      return ticket
    } catch (error) {
      console.error('Failed to reassign ticket:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function batchAssign(data: BatchAssignRequest) {
    loading.value = true
    try {
      const updatedTickets = await ticketApi.batchAssign(data)
      // Update tickets in the list
      updatedTickets.forEach(ticket => {
        const index = tickets.value.findIndex(t => t.id === ticket.id)
        if (index !== -1) {
          tickets.value[index] = ticket
        }
      })
      selectedTicketIds.value = []
      return updatedTickets
    } catch (error) {
      console.error('Failed to batch assign tickets:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function batchComplete(ticketIds: string[]) {
    loading.value = true
    try {
      const updatedTickets = await ticketApi.batchComplete(ticketIds)
      updatedTickets.forEach(ticket => {
        const index = tickets.value.findIndex(t => t.id === ticket.id)
        if (index !== -1) {
          tickets.value[index] = ticket
        }
      })
      selectedTicketIds.value = []
      return updatedTickets
    } catch (error) {
      console.error('Failed to batch complete tickets:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function submitReport(data: SubmitReportRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.submitReport(data)
      const index = tickets.value.findIndex(t => t.id === ticket.id)
      if (index !== -1) {
        tickets.value[index] = ticket
      }
      if (currentTicket.value?.id === ticket.id) {
        currentTicket.value = ticket
      }
      return ticket
    } catch (error) {
      console.error('Failed to submit report:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function confirmTicket(data: ConfirmTicketRequest) {
    loading.value = true
    try {
      const ticket = await ticketApi.confirmTicket(data)
      const index = tickets.value.findIndex(t => t.id === ticket.id)
      if (index !== -1) {
        tickets.value[index] = ticket
      }
      if (currentTicket.value?.id === ticket.id) {
        currentTicket.value = ticket
      }
      return ticket
    } catch (error) {
      console.error('Failed to confirm ticket:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function exportCSV(filter?: TicketFilter) {
    try {
      return await ticketApi.exportCSV(filter)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      throw error
    }
  }

  // Selection management
  function toggleSelectTicket(id: string) {
    const index = selectedTicketIds.value.indexOf(id)
    if (index > -1) {
      selectedTicketIds.value.splice(index, 1)
    } else {
      selectedTicketIds.value.push(id)
    }
  }

  function selectAllTickets() {
    selectedTicketIds.value = tickets.value.map(t => t.id)
  }

  function clearSelection() {
    selectedTicketIds.value = []
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      clearSelection()
    } else {
      selectAllTickets()
    }
  }

  return {
    tickets,
    currentTicket,
    loading,
    selectedTicketIds,
    draftTickets,
    submittedTickets,
    acceptedTickets,
    assignedTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    canceledTickets,
    hasSelected,
    isAllSelected,
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicketStatus,
    assignTicket,
    reassignTicket,
    batchAssign,
    batchComplete,
    submitReport,
    confirmTicket,
    exportCSV,
    toggleSelectTicket,
    selectAllTickets,
    clearSelection,
    toggleSelectAll
  }
})
