<template>
  <main class="min-h-screen pt-24 px-6 pb-10 admin-bg">
    <section class="max-w-7xl mx-auto">
      <div class="admin-header mb-7">
        <div>
          <p class="admin-kicker">Users</p>
          <h1 class="admin-title">Kelola Pengguna</h1>
          <p class="admin-user">Halo, {{ currentUser?.name || userStore.user?.name || 'Admin' }}</p>
        </div>

        <button @click="loadCurrentUser" class="primary-btn">
          Refresh Data
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3"
      >
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card stat-blue">
          <p class="stat-label">User Login</p>
          <h2 class="stat-number">{{ currentUser ? 1 : 0 }}</h2>
        </div>

        <div class="stat-card stat-purple">
          <p class="stat-label">Role</p>
          <h2 class="stat-number">{{ currentUser?.role || '-' }}</h2>
        </div>

        <div class="stat-card stat-green">
          <p class="stat-label">Status</p>
          <h2 class="stat-number">Aktif</h2>
        </div>
      </div>

      <section class="panel overflow-hidden">
        <div class="p-5 border-b border-white/10">
          <h2 class="text-white font-black">
            Data Pengguna
          </h2>
        </div>

        <div v-if="isLoading" class="empty-state">
          Memuat user...
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-400 border-b border-white/10">
                <th class="px-5 py-3">Nama</th>
                <th class="px-5 py-3">Email</th>
                <th class="px-5 py-3">Role</th>
                <th class="px-5 py-3">Tanggal Daftar</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-if="currentUser"
                class="border-b border-white/5 text-gray-300 hover:bg-white/[0.03]"
              >
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      {{ getInitial(currentUser.name) }}
                    </div>

                    <p class="font-bold text-white">
                      {{ currentUser.name }}
                    </p>
                  </div>
                </td>

                <td class="px-5 py-3">
                  {{ currentUser.email }}
                </td>

                <td class="px-5 py-3">
                  <span class="role-badge">
                    {{ currentUser.role }}
                  </span>
                </td>

                <td class="px-5 py-3">
                  {{ formatDate(currentUser.created_at) }}
                </td>
              </tr>

              <tr v-else>
                <td colspan="4" class="px-5 py-8 text-center text-gray-500">
                  User tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userStore } from '../../store.js'

const API_BASE_URL = 'http://localhost:3000'

const currentUser = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadCurrentUser() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil data user')
    }

    currentUser.value = data.user
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?'
}

function formatDate(date) {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  loadCurrentUser()
})
</script>

<style scoped>
.admin-bg {
  background:
    radial-gradient(circle at 12% 10%, rgba(16, 185, 129, 0.12), transparent 28%),
    radial-gradient(circle at 88% 16%, rgba(79, 70, 229, 0.10), transparent 26%),
    #0d1117;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(135deg, rgba(16,185,129,0.10), rgba(79,70,229,0.06)),
    rgba(255,255,255,0.035);
}

.admin-kicker {
  color: #6ee7b7;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.admin-title {
  color: white;
  font-size: 2rem;
  font-weight: 950;
  margin-top: 4px;
}

.admin-user {
  color: #94a3b8;
  margin-top: 4px;
}

.primary-btn {
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(16,185,129,0.13);
  border: 1px solid rgba(16,185,129,0.3);
  color: #a7f3d0;
  font-size: 0.85rem;
  font-weight: 800;
  transition: 0.2s;
}

.primary-btn:hover {
  background: rgba(16,185,129,0.22);
  color: white;
}

.stat-card {
  min-height: 118px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: "";
  position: absolute;
  right: -38px;
  bottom: -52px;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  opacity: 0.16;
}

.stat-blue::after { background: #3b82f6; }
.stat-green::after { background: #22c55e; }
.stat-purple::after { background: #8b5cf6; }

.stat-label {
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 800;
}

.stat-number {
  color: white;
  font-size: 2rem;
  font-weight: 950;
  margin-top: 7px;
}

.panel {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  border-radius: 22px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 15px;
  background: rgba(99,102,241,0.18);
  color: #c7d2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 950;
}

.role-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(99,102,241,0.14);
  color: #c7d2fe;
  font-size: 0.75rem;
  font-weight: 900;
}

.empty-state {
  padding: 32px 10px;
  color: #64748b;
  text-align: center;
}
</style>