import { describe, it, expect } from 'vitest'
import {
  canTransition,
  getAvailableTransitions,
  requiresReason,
  canStudentCancel,
  isTerminalStatus,
  getStatusLabel,
  getStatusColor
} from './ticketStateMachine'
import { TicketStatus, UserRole } from '@/types'

describe('ticketStateMachine', () => {
  describe('canTransition', () => {
    it('Student should be able to transition Draft to Submitted', () => {
      expect(canTransition(TicketStatus.Draft, TicketStatus.Submitted, UserRole.Student)).toBe(true)
    })

    it('Admin should be able to transition Submitted to Accepted', () => {
      expect(canTransition(TicketStatus.Submitted, TicketStatus.Accepted, UserRole.Admin)).toBe(true)
    })

    it('Student should not be able to transition Submitted to Accepted', () => {
      expect(canTransition(TicketStatus.Submitted, TicketStatus.Accepted, UserRole.Student)).toBe(false)
    })

    it('Worker should be able to transition Assigned to InProgress', () => {
      expect(canTransition(TicketStatus.Assigned, TicketStatus.InProgress, UserRole.Worker)).toBe(true)
    })

    it('Student should be able to transition Resolved to Closed', () => {
      expect(canTransition(TicketStatus.Resolved, TicketStatus.Closed, UserRole.Student)).toBe(true)
    })
  })

  describe('getAvailableTransitions', () => {
    it('Should return list of statuses that Draft can transition to (Student)', () => {
      const transitions = getAvailableTransitions(TicketStatus.Draft, UserRole.Student)
      expect(transitions).toContain(TicketStatus.Submitted)
      expect(transitions.length).toBeGreaterThan(0)
    })

    it('Should return list of statuses that Submitted can transition to (Admin)', () => {
      const transitions = getAvailableTransitions(TicketStatus.Submitted, UserRole.Admin)
      expect(transitions).toContain(TicketStatus.Accepted)
      expect(transitions).toContain(TicketStatus.Canceled)
    })
  })

  describe('requiresReason', () => {
    it('Submitted to Canceled should require a reason', () => {
      expect(requiresReason(TicketStatus.Submitted, TicketStatus.Canceled)).toBe(true)
    })

    it('Draft to Submitted should not require a reason', () => {
      expect(requiresReason(TicketStatus.Draft, TicketStatus.Submitted)).toBe(false)
    })
  })

  describe('canStudentCancel', () => {
    it('Student should be able to cancel Submitted repair request', () => {
      expect(canStudentCancel(TicketStatus.Submitted)).toBe(true)
    })

    it('Student should be able to cancel Accepted repair request', () => {
      expect(canStudentCancel(TicketStatus.Accepted)).toBe(true)
    })

    it('Student should not be able to cancel InProgress repair request', () => {
      expect(canStudentCancel(TicketStatus.InProgress)).toBe(false)
    })
  })

  describe('isTerminalStatus', () => {
    it('Closed should be a terminal status', () => {
      expect(isTerminalStatus(TicketStatus.Closed)).toBe(true)
    })

    it('Canceled should be a terminal status', () => {
      expect(isTerminalStatus(TicketStatus.Canceled)).toBe(true)
    })

    it('InProgress should not be a terminal status', () => {
      expect(isTerminalStatus(TicketStatus.InProgress)).toBe(false)
    })
  })

  describe('getStatusLabel', () => {
    it('Should return correct status labels', () => {
      expect(getStatusLabel(TicketStatus.Draft)).toBe('Draft')
      expect(getStatusLabel(TicketStatus.Submitted)).toBe('Submitted')
      expect(getStatusLabel(TicketStatus.Closed)).toBe('Closed')
    })
  })

  describe('getStatusColor', () => {
    it('Should return status color', () => {
      expect(getStatusColor(TicketStatus.Submitted)).toBe('#409EFF')
      expect(getStatusColor(TicketStatus.Closed)).toBe('#909399')
      expect(getStatusColor(TicketStatus.Canceled)).toBe('#F56C6C')
    })
  })
})
