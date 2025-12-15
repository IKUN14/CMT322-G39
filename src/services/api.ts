import type {
  User,
  Ticket,
  WorkerProfile,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  CreateTicketRequest,
  AssignTicketRequest,
  BatchAssignRequest,
  UpdateTicketStatusRequest,
  SubmitReportRequest,
  ConfirmTicketRequest,
  TicketFilter,
  KPI,
  Feedback,
  CreateFeedbackRequest
} from '@/types'
import {
  TicketStatus as Status,
  Urgency as UrgencyEnum,
  UserRole as Role
} from '@/types'

// Mock data storage (in-memory)
interface UserWithPassword extends User {
  password: string
}

let mockUsers: UserWithPassword[] = [
  {
    id: '1',
    username: 'student',
    email: 'student@example.com',
    password: '123456',
    role: Role.Student,
    name: 'Student Zhang San',
    phone: '13800138000'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    role: Role.Admin,
    name: 'Admin Li Si',
    phone: '13800138001'
  },
  {
    id: '3',
    username: 'worker',
    email: 'worker@example.com',
    password: '123456',
    role: Role.Worker,
    name: 'Worker Wang Wu',
    phone: '13800138002'
  }
]

let mockTickets: Ticket[] = [
  {
    id: 't1',
    title: 'Dormitory Door Lock Damaged',
    description: 'The dormitory door lock cannot be opened normally and needs repair',
    images: [],
    location: 'Building A Room 201',
    urgency: UrgencyEnum.Normal,
    status: Status.Submitted,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: '1',
    createdByName: 'Student Zhang San',
    assignmentRecords: [],
    statusHistory: [
      {
        id: 'h1',
        ticketId: 't1',
        fromStatus: Status.Draft,
        toStatus: Status.Submitted,
        changedAt: new Date(Date.now() - 86400000).toISOString(),
        changedBy: '1',
        changedByName: 'Student Zhang San'
      }
    ]
  }
]

let mockWorkers: WorkerProfile[] = [
  {
    id: 'w1',
    userId: '3',
    name: 'Worker Wang Wu',
    phone: '13800138002',
    department: 'Maintenance Department',
    skills: ['Plumbing & Electrical', 'Doors & Windows'],
    status: 'available',
    rating: 4.8,
    completedTickets: 25
  }
]

let mockFeedbacks: Feedback[] = []

let currentUser: User | null = null

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Authentication API
export const authApi = {
  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    await delay()
    const user = mockUsers.find(
      u => (u.username === data.username || u.email === data.username) && u.password === data.password
    )
    if (!user) {
      throw new Error('Invalid username or password')
    }
    const { password, ...userWithoutPassword } = user
    currentUser = userWithoutPassword as User
    return {
      user: userWithoutPassword as User,
      token: `mock-token-${user.id}`
    }
  },

  async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    await delay()
    if (mockUsers.some(u => u.username === data.username || u.email === data.email)) {
      throw new Error('Username or email already exists')
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      phone: ''
    }
    mockUsers.push({ ...newUser, password: data.password })
    
    // If registering as Worker role, automatically create WorkerProfile
    if (data.role === Role.Worker) {
      const newWorker: WorkerProfile = {
        id: `worker-${Date.now()}`,
        userId: newUser.id,
        name: data.name,
        phone: newUser.phone || '',
        department: 'Maintenance Department',
        skills: [],
        status: 'available',
        rating: 0,
        completedTickets: 0
      }
      mockWorkers.push(newWorker)
    }
    
    currentUser = newUser
    return {
      user: newUser,
      token: `mock-token-${newUser.id}`
    }
  },

  // Create user without changing current login state (for admin creating workers)
  async createUser(data: RegisterRequest): Promise<User> {
    await delay()
    if (mockUsers.some(u => u.username === data.username || u.email === data.email)) {
      throw new Error('Username or email already exists')
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      phone: ''
    }
    mockUsers.push({ ...newUser, password: data.password })
    // Don't change currentUser, maintain current login state
    return newUser
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    await delay()
    const user = mockUsers.find(u => u.email === data.email)
    if (!user) {
      throw new Error('Email not found')
    }
    return { message: 'Password reset link has been sent to your email' }
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100)
    return currentUser
  },

  async logout(): Promise<void> {
    await delay(100)
    currentUser = null
  }
}

// Repair Request API
export const ticketApi = {
  async listTickets(filter?: TicketFilter): Promise<Ticket[]> {
    await delay()
    let result = [...mockTickets]

    if (filter?.status && filter.status.length > 0) {
      result = result.filter(t => filter.status!.includes(t.status))
    }

    if (filter?.urgency && filter.urgency.length > 0) {
      result = result.filter(t => filter.urgency!.includes(t.urgency))
    }

    if (filter?.assignedTo) {
      result = result.filter(t => t.currentAssignee === filter.assignedTo)
    }

    if (filter?.createdBy) {
      result = result.filter(t => t.createdBy === filter.createdBy)
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getTicket(id: string): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === id)
    if (!ticket) {
      throw new Error('Repair request not found')
    }
    return ticket
  },

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    await delay()
    if (!currentUser) throw new Error('Not logged in')

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      ...data,
      status: Status.Draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      assignmentRecords: [],
      statusHistory: []
    }
    mockTickets.push(newTicket)
    return newTicket
  },

  async updateTicketStatus(data: UpdateTicketStatusRequest): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === data.ticketId)
    if (!ticket) throw new Error('Repair request not found')
    if (!currentUser) throw new Error('Not logged in')

    const oldStatus = ticket.status
    ticket.status = data.status
    ticket.updatedAt = new Date().toISOString()

    ticket.statusHistory.push({
      id: `history-${Date.now()}`,
      ticketId: ticket.id,
      fromStatus: oldStatus,
      toStatus: data.status,
      changedAt: new Date().toISOString(),
      changedBy: currentUser.id,
      changedByName: currentUser.name,
      reason: data.reason
    })

    if (data.status === Status.Resolved) {
      ticket.completedAt = new Date().toISOString()
    }
    if (data.status === Status.Canceled) {
      ticket.cancelReason = data.reason
    }

    return ticket
  },

  async assignTicket(data: AssignTicketRequest): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === data.ticketId)
    if (!ticket) throw new Error('Repair request not found')
    if (!currentUser) throw new Error('Not logged in')

    const worker = mockWorkers.find(w => w.id === data.workerId)
    if (!worker) throw new Error('Worker not found')

    // Update current assignee
    ticket.currentAssignee = worker.userId
    ticket.currentAssigneeName = worker.name
    ticket.status = Status.Assigned
    ticket.updatedAt = new Date().toISOString()

    // Add assignment record
    ticket.assignmentRecords.push({
      id: `assign-${Date.now()}`,
      ticketId: ticket.id,
      workerId: worker.id,
      workerName: worker.name,
      assignedAt: new Date().toISOString(),
      assignedBy: currentUser.id,
      assignedByName: currentUser.name,
      reason: data.reason
    })

    ticket.statusHistory.push({
      id: `history-${Date.now()}`,
      ticketId: ticket.id,
      fromStatus: ticket.statusHistory.length > 0 
        ? ticket.statusHistory[ticket.statusHistory.length - 1].toStatus 
        : Status.Draft,
      toStatus: Status.Assigned,
      changedAt: new Date().toISOString(),
      changedBy: currentUser.id,
      changedByName: currentUser.name,
      reason: data.reason
    })

    return ticket
  },

  async reassignTicket(data: AssignTicketRequest): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === data.ticketId)
    if (!ticket) throw new Error('Repair request not found')
    if (!currentUser) throw new Error('Not logged in')

    const worker = mockWorkers.find(w => w.id === data.workerId)
    if (!worker) throw new Error('Worker not found')

    // First mark as Reassigned
    const oldStatus = ticket.status
    ticket.status = Status.Reassigned
    ticket.updatedAt = new Date().toISOString()

    ticket.statusHistory.push({
      id: `history-${Date.now()}`,
      ticketId: ticket.id,
      fromStatus: oldStatus,
      toStatus: Status.Reassigned,
      changedAt: new Date().toISOString(),
      changedBy: currentUser.id,
      changedByName: currentUser.name,
        reason: data.reason || 'Reassigned'
    })

    // Then reassign
    return this.assignTicket(data)
  },

  async batchAssign(data: BatchAssignRequest): Promise<Ticket[]> {
    await delay()
    const results: Ticket[] = []
    for (const ticketId of data.ticketIds) {
      try {
        const ticket = await this.assignTicket({
          ticketId,
          workerId: data.workerId,
          reason: data.reason
        })
        results.push(ticket)
      } catch (error) {
        console.error(`Failed to assign ticket ${ticketId}:`, error)
      }
    }
    return results
  },

  async batchComplete(ticketIds: string[]): Promise<Ticket[]> {
    await delay()
    const results: Ticket[] = []
    for (const ticketId of ticketIds) {
      try {
        const ticket = await this.updateTicketStatus({
          ticketId,
          status: Status.Resolved
        })
        results.push(ticket)
      } catch (error) {
        console.error(`Failed to complete ticket ${ticketId}:`, error)
      }
    }
    return results
  },

  async submitReport(data: SubmitReportRequest): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === data.ticketId)
    if (!ticket) throw new Error('Repair request not found')

    ticket.report = data.report
    ticket.reportImages = data.images || []
    ticket.status = Status.Resolved
    ticket.completedAt = new Date().toISOString()
    ticket.updatedAt = new Date().toISOString()

    if (!currentUser) throw new Error('Not logged in')
    ticket.statusHistory.push({
      id: `history-${Date.now()}`,
      ticketId: ticket.id,
      fromStatus: Status.InProgress,
      toStatus: Status.Resolved,
      changedAt: new Date().toISOString(),
      changedBy: currentUser.id,
      changedByName: currentUser.name
    })

    return ticket
  },

  async confirmTicket(data: ConfirmTicketRequest): Promise<Ticket> {
    await delay()
    const ticket = mockTickets.find(t => t.id === data.ticketId)
    if (!ticket) throw new Error('Repair request not found')
    if (!currentUser) throw new Error('Not logged in')

    if (data.approved) {
      // Approval: directly change to Closed status
      ticket.status = Status.Closed
      ticket.statusHistory.push({
        id: `history-${Date.now()}`,
        ticketId: ticket.id,
        fromStatus: Status.Resolved,
        toStatus: Status.Closed,
        changedAt: new Date().toISOString(),
        changedBy: currentUser.id,
        changedByName: currentUser.name,
        reason: data.reason || 'Approved'
      })
    } else {
      ticket.status = Status.InProgress
      ticket.rejectReason = data.reason
      ticket.statusHistory.push({
        id: `history-${Date.now()}`,
        ticketId: ticket.id,
        fromStatus: Status.Resolved,
        toStatus: Status.InProgress,
        changedAt: new Date().toISOString(),
        changedBy: currentUser.id,
        changedByName: currentUser.name,
        reason: data.reason || 'Rejected'
      })
    }

    ticket.updatedAt = new Date().toISOString()
    return ticket
  },

  async exportCSV(filter?: TicketFilter): Promise<string> {
    await delay()
    const tickets = await this.listTickets(filter)
    const headers = ['Repair ID', 'Title', 'Status', 'Urgency', 'Creator', 'Assignee', 'Created At']
    const rows = tickets.map(t => [
      t.id,
      t.title,
      t.status,
      t.urgency,
      t.createdByName,
      t.currentAssigneeName || 'Unassigned',
      t.createdAt
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    return csv
  }
}

// Worker API
export const workerApi = {
  async listWorkers(search?: string): Promise<WorkerProfile[]> {
    await delay()
    let result = [...mockWorkers]
    if (search) {
      const keyword = search.toLowerCase()
      result = result.filter(
        w =>
          w.name.toLowerCase().includes(keyword) ||
          w.department.toLowerCase().includes(keyword)
      )
    }
    return result
  },

  async getWorker(id: string): Promise<WorkerProfile> {
    await delay()
    const worker = mockWorkers.find(w => w.id === id)
    if (!worker) throw new Error('Worker not found')
    return worker
  },

  async createWorker(data: Omit<WorkerProfile, 'id'>): Promise<WorkerProfile> {
    await delay()
    const newWorker: WorkerProfile = {
      id: `worker-${Date.now()}`,
      ...data
    }
    mockWorkers.push(newWorker)
    return newWorker
  },

  async updateWorker(id: string, data: Partial<WorkerProfile>): Promise<WorkerProfile> {
    await delay()
    const worker = mockWorkers.find(w => w.id === id)
    if (!worker) throw new Error('Worker not found')
    Object.assign(worker, data)
    return worker
  }
}

// KPI API
export const kpiApi = {
  async getKPI(): Promise<KPI> {
    await delay()
    const totalTickets = mockTickets.length
    const pendingTickets = mockTickets.filter(
      t => t.status === Status.Submitted || t.status === Status.Accepted
    ).length
    const inProgressTickets = mockTickets.filter(
      t => t.status === Status.Assigned || t.status === Status.InProgress
    ).length
    const resolvedTickets = mockTickets.filter(
      t => t.status === Status.Resolved || t.status === Status.Closed
    ).length
    const urgentTickets = mockTickets.filter(
      t => t.urgency === UrgencyEnum.Urgent || t.urgency === UrgencyEnum.Emergency
    ).length

    // Calculate average resolution time (mock data)
    const avgResolutionTime = 24.5

    return {
      totalTickets,
      pendingTickets,
      inProgressTickets,
      resolvedTickets,
      avgResolutionTime,
      urgentTickets
    }
  }
}

// Feedback API
export const feedbackApi = {
  async createFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
    await delay()
    if (!currentUser) throw new Error('Not logged in')

    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      ticketId: data.ticketId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: data.content,
      rating: data.rating,
      images: data.images || [],
      createdAt: new Date().toISOString()
    }
    mockFeedbacks.push(newFeedback)
    return newFeedback
  },

  async getFeedbackByTicket(ticketId: string): Promise<Feedback[]> {
    await delay()
    return mockFeedbacks.filter(f => f.ticketId === ticketId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getAllFeedbacks(): Promise<Feedback[]> {
    await delay()
    return [...mockFeedbacks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
}
