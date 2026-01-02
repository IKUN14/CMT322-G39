<template>
  <div class="status-timeline">
    <h3>Status Timeline</h3>
    <div class="timeline">
      <div
        v-for="(history, index) in statusHistory"
        :key="history.id"
        class="timeline-item"
        :class="{ active: index === statusHistory.length - 1 }"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-status">
            <span class="status-label" :style="{ color: getStatusColor(history.toStatus) }">
              {{ getStatusLabel(history.toStatus) }}
            </span>
            <span class="timeline-time">{{ formatTime(history.changedAt) }}</span>
          </div>
          <div class="timeline-user">
            Operator: {{ history.changedByName }}
          </div>
          <div v-if="history.reason" class="timeline-reason">
            Reason: {{ history.reason }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusHistory } from '@/types'
import { getStatusLabel, getStatusColor } from '@/utils/ticketStateMachine'

interface Props {
  statusHistory: StatusHistory[]
}

const props = defineProps<Props>()

const formatTime = (time?: string | null) => {
  if (!time) return '-'
  const date = new Date(time)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-US')
}
</script>

<style scoped>
.status-timeline {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 27, 61, 0.12);
  border: 1px solid rgba(39, 83, 231, 0.08);
}

.status-timeline h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #0f1b3d;
}

.timeline {
  position: relative;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background-color: rgba(15, 27, 61, 0.12);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 24px 1fr;
  column-gap: 14px;
}

.timeline-dot {
  position: relative;
  left: 4px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #cbd5f5;
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 2px rgba(15, 27, 61, 0.12);
}

.timeline-item.active .timeline-dot {
  background-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.timeline-content {
  background-color: rgba(15, 27, 61, 0.04);
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(15, 27, 61, 0.06);
}

.timeline-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status-label {
  font-weight: 600;
  font-size: 14px;
}

.timeline-time {
  font-size: 12px;
  color: #5f6b8a;
}

.timeline-user {
  font-size: 12px;
  color: #5f6b8a;
  margin-bottom: 4px;
}

.timeline-reason {
  font-size: 12px;
  color: #5f6b8a;
  margin-top: 4px;
}
</style>
