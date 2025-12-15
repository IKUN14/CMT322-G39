import { TicketStatus, UserRole } from '@/types'

/**
 * State machine: defines transition rules between repair request statuses
 */
export interface StateTransition {
  from: TicketStatus
  to: TicketStatus[]
  allowedRoles: UserRole[]
  requiresReason?: boolean
}

// Status transition rules
// Note: A status can have multiple transition rules, each corresponding to a different target status
const stateTransitions: StateTransition[] = [
  // Draft → Submitted (Student)
  {
    from: TicketStatus.Draft,
    to: [TicketStatus.Submitted],
    allowedRoles: [UserRole.Student]
  },
  // Submitted → Accepted (Admin only)
  {
    from: TicketStatus.Submitted,
    to: [TicketStatus.Accepted],
    allowedRoles: [UserRole.Admin]
  },
  // Submitted → Canceled (Student and Admin)
  {
    from: TicketStatus.Submitted,
    to: [TicketStatus.Canceled],
    allowedRoles: [UserRole.Admin, UserRole.Student],
    requiresReason: true
  },
  // Accepted → Assigned (Admin)
  {
    from: TicketStatus.Accepted,
    to: [TicketStatus.Assigned],
    allowedRoles: [UserRole.Admin]
  },
  // Accepted → Canceled (Student and Admin)
  {
    from: TicketStatus.Accepted,
    to: [TicketStatus.Canceled],
    allowedRoles: [UserRole.Admin, UserRole.Student],
    requiresReason: true
  },
  // Assigned → InProgress (Worker)
  {
    from: TicketStatus.Assigned,
    to: [TicketStatus.InProgress, TicketStatus.Reassigned],
    allowedRoles: [UserRole.Worker, UserRole.Admin]
  },
  // InProgress → Resolved (Worker)
  {
    from: TicketStatus.InProgress,
    to: [TicketStatus.Resolved, TicketStatus.Reassigned],
    allowedRoles: [UserRole.Worker, UserRole.Admin]
  },
  // Resolved → Closed (Student approval)
  {
    from: TicketStatus.Resolved,
    to: [TicketStatus.Closed],
    allowedRoles: [UserRole.Student]
  },
  // Reassigned → Assigned (Admin)
  {
    from: TicketStatus.Reassigned,
    to: [TicketStatus.Assigned],
    allowedRoles: [UserRole.Admin]
  },
  // Canceled is a terminal state
  // Closed is a terminal state
]

/**
 * Check if status transition is allowed
 */
export function canTransition(
  fromStatus: TicketStatus,
  toStatus: TicketStatus,
  userRole: UserRole
): boolean {
  // Find all transition rules starting from fromStatus
  const transitions = stateTransitions.filter(t => t.from === fromStatus)
  if (transitions.length === 0) return false

  // Find transition rule that includes the target status
  const transition = transitions.find(t => t.to.includes(toStatus))
  if (!transition) return false

  // Check if user role has permission
  const hasPermission = transition.allowedRoles.includes(userRole)

  return hasPermission
}

/**
 * Get all statuses that can be transitioned to from current status
 */
export function getAvailableTransitions(
  currentStatus: TicketStatus,
  userRole: UserRole
): TicketStatus[] {
  // Find all transition rules starting from currentStatus
  const transitions = stateTransitions.filter(t => t.from === currentStatus)
  if (transitions.length === 0) return []

  // Collect all statuses that this role can transition to
  const availableStatuses: TicketStatus[] = []
  transitions.forEach(transition => {
    if (transition.allowedRoles.includes(userRole)) {
      availableStatuses.push(...transition.to)
    }
  })

  // Remove duplicates
  return [...new Set(availableStatuses)]
}

/**
 * Check if status transition requires a reason
 */
export function requiresReason(
  fromStatus: TicketStatus,
  toStatus: TicketStatus
): boolean {
  // Find all transition rules starting from fromStatus
  const transitions = stateTransitions.filter(t => t.from === fromStatus)
  if (transitions.length === 0) return false

  // Find transition rule that includes the target status
  const transition = transitions.find(t => t.to.includes(toStatus))
  if (!transition) return false

  return transition.requiresReason ?? false
}

/**
 * Check if student can cancel repair request
 */
export function canStudentCancel(status: TicketStatus): boolean {
  return status === TicketStatus.Submitted || status === TicketStatus.Accepted
}

/**
 * Check if status is terminal (cannot be transitioned further)
 */
export function isTerminalStatus(status: TicketStatus): boolean {
  return status === TicketStatus.Closed || status === TicketStatus.Canceled
}

/**
 * Get status display label
 */
export function getStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    [TicketStatus.Draft]: 'Draft',
    [TicketStatus.Submitted]: 'Submitted',
    [TicketStatus.Accepted]: 'Accepted',
    [TicketStatus.Assigned]: 'Assigned',
    [TicketStatus.InProgress]: 'In Progress',
    [TicketStatus.Resolved]: 'Resolved',
    [TicketStatus.Closed]: 'Closed',
    [TicketStatus.Canceled]: 'Canceled',
    [TicketStatus.Reassigned]: 'Reassigned'
  }
  return labels[status] || status
}

/**
 * Get status color (text color)
 */
export function getStatusColor(status: TicketStatus): string {
  const colors: Record<TicketStatus, string> = {
    [TicketStatus.Draft]: '#606266',
    [TicketStatus.Submitted]: '#409EFF',
    [TicketStatus.Accepted]: '#67C23A',
    [TicketStatus.Assigned]: '#E6A23C',
    [TicketStatus.InProgress]: '#E6A23C',
    [TicketStatus.Resolved]: '#67C23A',
    [TicketStatus.Closed]: '#67C23A',
    [TicketStatus.Canceled]: '#F56C6C',
    [TicketStatus.Reassigned]: '#E6A23C'
  }
  return colors[status] || '#606266'
}

/**
 * Get status background color
 */
export function getStatusBgColor(status: TicketStatus): string {
  const bgColors: Record<TicketStatus, string> = {
    [TicketStatus.Draft]: '#F5F7FA',
    [TicketStatus.Submitted]: '#ECF5FF',
    [TicketStatus.Accepted]: '#F0F9FF',
    [TicketStatus.Assigned]: '#FFF7E6',
    [TicketStatus.InProgress]: '#FFF7E6',
    [TicketStatus.Resolved]: '#F0FDF4',
    [TicketStatus.Closed]: '#F0FDF4',
    [TicketStatus.Canceled]: '#FEF0F0',
    [TicketStatus.Reassigned]: '#FFF7E6'
  }
  return bgColors[status] || '#F5F7FA'
}

/**
 * Get urgency color (text color)
 */
export function getUrgencyColor(urgency: string): string {
  const colors: Record<string, string> = {
    'Normal': '#606266',
    'Urgent': '#E6A23C',
    'Emergency': '#F56C6C'
  }
  return colors[urgency] || '#606266'
}

/**
 * Get urgency background color
 */
export function getUrgencyBgColor(urgency: string): string {
  const bgColors: Record<string, string> = {
    'Normal': '#F5F7FA',
    'Urgent': '#FFF7E6',
    'Emergency': '#FEF0F0'
  }
  return bgColors[urgency] || '#F5F7FA'
}
