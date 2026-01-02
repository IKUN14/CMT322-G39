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
            <span class="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="nav-svg">
                <path d="M4 19h16M7 16V9m5 7V5m5 11v-6" />
              </svg>
            </span>
            <span>Dashboard</span>
          </router-link>
          <template v-if="authStore.isStudent">
            <router-link to="/student/tickets" class="nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="nav-svg">
                  <path d="M8 6h8M8 10h8M8 14h6M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <span>My Repairs</span>
            </router-link>
            <router-link to="/student/tickets/create" class="nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="nav-svg">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span>Quick Repair</span>
            </router-link>
          </template>
          <template v-if="authStore.isAdmin">
            <router-link to="/admin/tickets" class="nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="nav-svg">
                  <path d="M14.7 6.3a4 4 0 1 0 3 3l4.3 4.3-2.4 2.4-4.3-4.3a4 4 0 0 0-3-5.4z" />
                  <path d="M7 17l-3 3" />
                </svg>
              </span>
              <span>Repair Management</span>
            </router-link>
            <router-link to="/admin/workers" class="nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="nav-svg">
                  <path d="M16 11a3 3 0 1 0-2.999-3A3 3 0 0 0 16 11zM8 12a3 3 0 1 0-2.999-3A3 3 0 0 0 8 12z" />
                  <path d="M4 20a4 4 0 0 1 8 0M12 20a4 4 0 0 1 8 0" />
                </svg>
              </span>
              <span>Maintenance Team</span>
            </router-link>
          </template>
          <template v-if="authStore.isWorker">
            <router-link to="/worker/tickets" class="nav-link">
              <span class="nav-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="nav-svg">
                  <path d="M8 6h8M8 10h8M8 14h6M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                </svg>
              </span>
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
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  height: 64px;
  gap: 12px;
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
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav::-webkit-scrollbar {
  display: none;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.18));
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(15, 27, 61, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
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

@media (max-width: 1024px) {
  .header-content {
    height: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 12px 0;
  }

  .nav {
    width: 100%;
    justify-content: center;
    gap: 10px;
  }

  .user-info {
    width: 100%;
    justify-content: center;
  }

  .logo-section {
    width: 100%;
    justify-content: center;
    min-width: 0;
  }
}

@media (max-width: 720px) {
  .header {
    padding: 0 12px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .logo {
    font-size: 16px;
    line-height: 1.2;
  }

  .logo-section {
    justify-content: flex-start;
  }

  .nav {
    width: 100%;
    justify-content: flex-start;
    gap: 10px;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 6px;
    -webkit-overflow-scrolling: touch;
  }

  .nav-link {
    padding: 8px 10px;
    font-size: 13px;
    white-space: nowrap;
    flex: 0 0 auto;
  }

  .nav-icon {
    font-size: 16px;
  }

  .username-box {
    padding: 6px 12px;
  }

  .user-info {
    justify-content: flex-start;
    width: 100%;
  }

  .main-content {
    padding: 16px;
  }
}
</style>
