<template>
  <main class="min-h-screen" style="background: #0d1117; padding-top: 64px;">
    <section class="relative overflow-hidden py-24 text-white" style="background: linear-gradient(135deg, #0e1524 0%, #1a1040 50%, #0e1524 100%);">
      <div class="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(79,70,229,0.2), transparent 70%); filter: blur(60px);"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%); filter: blur(60px);"></div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">


        <h1 class="font-black mb-4 leading-tight" style="font-size: clamp(2rem, 5vw, 3.5rem);">
          Tentang
          <span style="background: linear-gradient(135deg, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            e-BuildPC
          </span>
        </h1>

        <p class="text-lg mb-2" style="color: #94a3b8;">
          Platform E-Commerce Komponen PC Terpercaya di Indonesia
        </p>

        <p class="text-sm font-medium" style="color: #6366f1;">
          Pemrograman Aplikasi Berbasis Web dan Aplikasi
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div class="rounded-3xl p-10 relative overflow-hidden" style="background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,27,75,0.7)); border: 1px solid rgba(79,70,229,0.2);">
        <div class="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%); filter: blur(50px);"></div>

        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style="background: rgba(79,70,229,0.2);">
              💡
            </div>

            <h2 class="text-2xl font-black text-white">
              Tentang <span style="color: #818cf8;">Kami</span>
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <p class="leading-relaxed text-sm" style="color: #94a3b8;">
                <strong style="color: #c7d2fe;">e-BuildPC</strong>
                adalah platform e-commerce komponen PC yang dibangun sebagai proyek tugas akhir mata kuliah
                <strong style="color: #c7d2fe;">Pemrograman Aplikasi Berbasis Web dan Aplikasi (PABWA3)</strong>.
                Platform ini dirancang untuk memudahkan siapa saja dalam menemukan dan membeli komponen PC berkualitas tinggi dengan harga yang kompetitif.
              </p>

              <p class="leading-relaxed text-sm" style="color: #94a3b8;">
                Kami hadir sebagai solusi bagi para
                <strong style="color: #c7d2fe;">PC builder</strong>
                — dari pemula hingga enthusiast — yang ingin merakit PC impian mereka tanpa kebingungan. Mulai dari prosesor, GPU, RAM, storage, hingga aksesoris, semuanya tersedia dalam satu platform yang bersih dan mudah digunakan.
              </p>
            </div>

            <div class="space-y-4">
              <p class="leading-relaxed text-sm" style="color: #94a3b8;">
                Proyek ini dikerjakan oleh
                <strong style="color: #c7d2fe;">9 anggota kelompok</strong>
                dengan pembagian tugas yang merata, mencakup desain UI/UX, pengembangan frontend dengan
                <strong style="color: #c7d2fe;">Vue.js 3</strong>,
                pengelolaan state, routing, dan dokumentasi teknis.
              </p>

              <p class="leading-relaxed text-sm" style="color: #94a3b8;">
                Kami berkomitmen untuk menghadirkan pengalaman belanja yang
                <strong style="color: #c7d2fe;">aman, nyaman, dan terpercaya</strong>
                — didukung oleh antarmuka modern, informasi produk yang jelas, dan panduan artikel yang bermanfaat bagi komunitas PC Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1" style="background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.05)); border: 1px solid rgba(79,70,229,0.25);">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6" style="background: rgba(79,70,229,0.2);">
            🚀
          </div>

          <h2 class="text-xl font-black text-white mb-4">
            Visi Kami
          </h2>

          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.8;">
            Menjadi platform e-commerce komponen PC terkemuka di Indonesia yang memberikan pengalaman belanja terbaik, produk original berkualitas, dan harga kompetitif untuk setiap builder PC.
          </p>
        </div>

        <div class="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1" style="background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.05)); border: 1px solid rgba(124,58,237,0.25);">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6" style="background: rgba(124,58,237,0.2);">
            🎯
          </div>

          <h2 class="text-xl font-black text-white mb-4">
            Misi Kami
          </h2>

          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.8;">
            Memudahkan setiap orang merakit PC impian mereka dengan menyediakan komponen berkualitas tinggi, layanan pelanggan responsif, panduan komprehensif, dan antarmuka belanja yang intuitif.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);"
        >
          <div class="text-2xl mb-1">
            {{ stat.icon }}
          </div>

          <div class="text-2xl font-black mb-1" style="background: linear-gradient(135deg, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            {{ stat.value }}
          </div>

          <div class="text-xs font-medium" style="color: #64748b;">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <div>
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black text-white mb-2">
            Anggota <span style="color: #818cf8;">Kelompok</span>
          </h2>

          <p class="text-sm" style="color: #64748b;">
            PABWA3 — Semester Genap 2025/2026
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div
            v-for="member in team"
            :key="member.nim"
            class="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
            style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);"
          >
            <div
              class="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              :style="{ background: member.gradient }"
            >
              {{ member.name.split(' ').map(w => w[0]).slice(0, 2).join('') }}
            </div>

            <div class="min-w-0">
              <p class="font-bold text-white text-sm leading-snug truncate">
                {{ member.name }}
              </p>

              <p class="text-xs font-mono mt-0.5" style="color: #6366f1;">
                {{ member.nim }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <div
            v-for="role in roles"
            :key="role.title"
            class="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            :style="{ background: role.bg, border: role.border }"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                :style="{ background: role.iconBg }"
              >
                {{ role.icon }}
              </div>

              <div>
                <p class="font-black text-white text-base leading-none">
                  {{ role.title }}
                </p>

                <p class="text-xs mt-1" :style="{ color: role.accent }">
                  {{ role.count }} orang
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl p-8" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);">
        <h2 class="text-xl font-black text-white mb-6 text-center">
          Tech Stack yang Digunakan
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 cursor-default"
            style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);"
          >
            <img
              :src="tech.logo"
              :alt="tech.name"
              class="w-10 h-10 object-contain"
            />

            <span class="text-xs font-bold text-white">
              {{ tech.name }}
            </span>

            <span class="text-xs text-center" style="color: #64748b;">
              {{ tech.desc }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const team = [
  { nim: '11211035', name: 'Edis Nabila Ramadhani', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { nim: '11221037', name: 'Muhammad Akmal Al Fathan', gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
  { nim: '11221071', name: 'Cinta Satila', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { nim: '11221079', name: 'Andy Cole', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
  { nim: '11231007', name: 'Alief Rachmattul Islam', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { nim: '11231031', name: 'Imam Dzulvan Muffid', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { nim: '11231045', name: 'Muhamad Faisal', gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  { nim: '11231055', name: 'Muhammad Fatwa Al Choiri', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { nim: '11231073', name: 'Nurfauzan Gymnastiar', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
]

const stats = [
  { icon: '🎓', value: '2026', label: 'Tahun Pengerjaan' },
  { icon: '👥', value: '5', label: 'Tim Frontend' },
  { icon: '📦', value: '4', label: 'Tim Backend + LLM' },
  { icon: '📚', value: 'PABW', label: 'Mata Kuliah' },
]

const roles = [
  {
    icon: '🎨',
    title: 'Frontend',
    count: 5,
    accent: '#a5b4fc',
    bg: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(99,102,241,0.05))',
    border: '1px solid rgba(99,102,241,0.25)',
    iconBg: 'rgba(99,102,241,0.2)',
  },
  {
    icon: '🧠',
    title: 'Backend',
    count: 2,
    accent: '#93c5fd',
    bg: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(37,99,235,0.05))',
    border: '1px solid rgba(59,130,246,0.25)',
    iconBg: 'rgba(59,130,246,0.2)',
  },
  {
    icon: '🤖',
    title: 'LLM',
    count: 2,
    accent: '#c4b5fd',
    bg: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.05))',
    border: '1px solid rgba(168,85,247,0.25)',
    iconBg: 'rgba(168,85,247,0.2)',
  },
]

const techStack = [
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg', name: 'Vue.js 3', desc: 'Framework' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg', name: 'Vite', desc: 'Build Tool' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', name: 'Tailwind', desc: 'Styling' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg', name: 'Vue Router', desc: 'Routing' },
  { logo: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg', name: 'PostgreSQL', desc: 'Database' },
  { logo: 'https://neon.tech/favicon/favicon.svg', name: 'Neon', desc: 'Host DB' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg', name: 'Node.js', desc: 'Runtime' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png', name: 'Express', desc: 'Backend' },
]
</script>