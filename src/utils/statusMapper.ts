import { TicketStatus } from '@/types'

const toDbMap: Record<TicketStatus, string> = {
  [TicketStatus.Draft]: 'draft',
  [TicketStatus.Submitted]: 'submitted',
  [TicketStatus.Accepted]: 'accepted',
  [TicketStatus.Assigned]: 'assigned',
  [TicketStatus.Reassigned]: 'reassigned',
  [TicketStatus.InProgress]: 'in_progress',
  [TicketStatus.Resolved]: 'resolved',
  [TicketStatus.Closed]: 'closed',
  [TicketStatus.Canceled]: 'canceled'
}

const toAppMap: Record<string, TicketStatus> = Object.entries(toDbMap).reduce(
  (acc, [appStatus, dbStatus]) => {
    acc[dbStatus] = appStatus as TicketStatus
    return acc
  },
  {} as Record<string, TicketStatus>
)

export function toDbStatus(status: TicketStatus): string {
  return toDbMap[status]
}

export function toAppStatus(dbStatus: string): TicketStatus {
  return toAppMap[dbStatus] ?? TicketStatus.Draft
}
