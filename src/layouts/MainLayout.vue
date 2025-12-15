<template>
  <div class="main-layout">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="/images/logo.png" alt="Logo" class="logo-icon" @error="handleLogoError" />
          <h1 class="logo">USM Dormitory Facilities Repair and Feedback System</h1>
        </div>
        <nav class="nav">
          <router-link to="/dashboard" class="nav-link">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </router-link>
          <template v-if="authStore.isStudent">
            <router-link to="/student/tickets" class="nav-link">
              <span class="nav-icon">📋</span>
              <span>My Repairs</span>
            </router-link>
            <router-link to="/student/tickets/create" class="nav-link">
              <span class="nav-icon">➕</span>
              <span>Quick Repair</span>
            </router-link>
          </template>
          <template v-if="authStore.isAdmin">
            <router-link to="/admin/tickets" class="nav-link">
              <span class="nav-icon">🔧</span>
              <span>Repair Management</span>
            </router-link>
            <router-link to="/admin/workers" class="nav-link">
              <span class="nav-icon">👥</span>
              <span>Maintenance Team</span>
            </router-link>
          </template>
          <template v-if="authStore.isWorker">
            <router-link to="/worker/tickets" class="nav-link">
              <span class="nav-icon">📋</span>
              <span>My Repairs</span>
            </router-link>
          </template>
        </nav>
        <div class="user-info">
          <div class="username-box">
            <span class="username">{{ authStore.user?.name }}</span>
          </div>
          <button @click="handleLogout" class="btn btn-primary">Logout</button>
        </div>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'Login' })
}

const handleLogoError = (event: Event) => {
  // Hide logo if image not found
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3px;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon {
  font-size: 18px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username-box {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 8px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.username-box:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background: transparent;
}
</style>
