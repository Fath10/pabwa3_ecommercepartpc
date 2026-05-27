<template>
  <main class="pt-16" style="background: #f8fafc; min-height: 100vh;">
    <!-- Hero Banner -->
    <section class="py-12 text-white" style="background: #111827; position: relative;">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold mb-2">Tentang <span style="color: #60a5fa;">e-BuildPC</span></h1>
        <p class="text-sm" style="color: #9ca3af;">Platform PC Komponen Terpercaya di Indonesia</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Mission & Vision -->
      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <div class="p-7 rounded-xl" style="background: #fff; border: 1px solid #e5e7eb;">
          <div class="text-4xl mb-4">🚀</div>
          <h2 class="text-xl font-bold mb-3" style="color: #111827;">Visi Kami</h2>
          <p style="color: #6b7280; font-size: 0.875rem;" class="leading-relaxed">
            Menjadi platform e-commerce komponen PC terkemuka di Asia Tenggara yang memberikan pengalaman belanja terbaik, produk asli, dan harga yang kompetitif untuk setiap pengguna.
          </p>
        </div>
        <div class="p-7 rounded-xl" style="background: #fff; border: 1px solid #e5e7eb;">
          <div class="text-4xl mb-4">🎯</div>
          <h2 class="text-xl font-bold mb-3" style="color: #111827;">Misi Kami</h2>
          <p style="color: #6b7280; font-size: 0.875rem;" class="leading-relaxed">
            Memudahkan setiap orang untuk merakit PC impian mereka dengan menyediakan komponen berkualitas tinggi, layanan pelanggan terbaik, dan panduan yang komprehensif.
          </p>
        </div>
      </div>

      <!-- Story -->
      <div class="text-center mb-16 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-5" style="color: #111827;">Cerita <span style="color: #4f46e5;">Kami</span></h2>
        <p class="leading-relaxed mb-3" style="color: #6b7280; font-size: 0.875rem;">
          e-BuildPC didirikan pada tahun 2020 oleh sekelompok penggemar PC yang frustasi dengan sulitnya menemukan komponen PC original dengan harga terjangkau di Indonesia. Kami memulai dari sebuah toko kecil dan kini telah berkembang menjadi platform digital dengan ribuan produk.
        </p>
        <p class="leading-relaxed" style="color: #6b7280; font-size: 0.875rem;">
          Dengan lebih dari 50.000 pelanggan yang puas dan ribuan transaksi sukses, e-BuildPC terus berkomitmen untuk memberikan pengalaman belanja PC terbaik di Indonesia.
        </p>
      </div>

      <!-- Team -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-center mb-8" style="color: #111827;">Tim <span style="color: #4f46e5;">Kami</span></h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="member in team"
            :key="member.name"
            class="group p-5 rounded-xl text-center transition-all duration-200 hover:-translate-y-1"
            style="background: #fff; border: 1px solid #e5e7eb;"
          >
            <div class="w-20 h-20 rounded-full bg-gradient-to-br mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-xl group-hover:scale-110 transition-transform"
              :class="member.gradient"
            >
              {{ member.name[0] }}
            </div>
              <p class="font-bold mb-0.5 text-sm" style="color: #111827;">{{ member.name }}</p>
              <p class="text-xs font-medium mb-1" style="color: #4f46e5;">{{ member.role }}</p>
              <p class="text-xs leading-relaxed" style="color: #6b7280;">{{ member.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="p-5 rounded-xl text-center"
          style="background: #fff; border: 1px solid #e5e7eb;"
        >
          <div class="text-3xl font-bold mb-1" style="color: #4f46e5;">{{ stat.value }}</div>
          <div class="text-xs" style="color: #6b7280;">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Contact CTA -->
        <div class="rounded-2xl p-8 text-center" style="background: #111827;">
          <h2 class="text-2xl font-bold text-white mb-3">Ada Pertanyaan?</h2>
          <p class="mb-6 text-sm" style="color: #9ca3af;">Tim kami siap membantu Anda 24/7. Hubungi kami sekarang!</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="mailto:hello@e-buildpc.id" id="email-contact-btn"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all"
            style="background: #2563eb;"
          >
            📧 Email Kami
          </a>
          <a href="https://wa.me/6281234567890" id="whatsapp-contact-btn"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all"
            style="background: #16a34a;"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const team = [
  {
    name: 'Ahmad Fauzi',
    role: 'Founder & CEO',
    desc: 'Penggemar PC gaming dengan 10+ tahun pengalaman di industri teknologi.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Budi Hartono',
    role: 'CTO & Lead Dev',
    desc: 'Full-stack developer berpengalaman yang membangun platform e-commerce.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Sari Wulandari',
    role: 'Head of Marketing',
    desc: 'Digital marketing expert dengan spesialisasi di e-commerce dan branding.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Dito Prasetyo',
    role: 'Product Manager',
    desc: 'Berpengalaman dalam kurasi produk PC dan mengelola vendor relationship.',
    gradient: 'from-green-500 to-emerald-600',
  },
]

const stats = [
  { value: '2020', label: 'Tahun Berdiri' },
  { value: '50K+', label: 'Pelanggan Aktif' },
  { value: '5000+', label: 'Produk Tersedia' },
  { value: '99%', label: 'Kepuasan Pelanggan' },
]
</script>
