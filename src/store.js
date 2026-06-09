import { reactive, computed } from 'vue'

// Product data
export const products = [
  {
    id: 1,
    name: 'ASUS ROG Strix RX470-E Gaming',
    category: 'Laptop',
    price: 18500000,
    originalPrice: 22000000,
    image: '/asus_rog_laptop.png',
    badge: 'Best Seller',
    badgeColor: 'red',
    rating: 4.8,
    reviews: 128,
    stock: 15,
    description: 'Laptop gaming premium dengan GPU RX470-E, performa tinggi untuk gaming dan kreativitas.',
    specs: ['AMD Ryzen 9', 'RTX 4070 8GB', '16GB DDR5', '1TB NVMe SSD'],
  },
  {
    id: 2,
    name: 'AMD Ryzen 9 7950X 16-Core Processor',
    category: 'Processor',
    price: 8750000,
    originalPrice: 10500000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Hot',
    badgeColor: 'orange',
    rating: 4.9,
    reviews: 89,
    stock: 22,
    description: 'Prosesor flagship AMD dengan 16 core untuk performa multitasking dan rendering terdepan.',
    specs: ['16 Core / 32 Thread', 'Max Boost 5.7GHz', 'TDP 170W', 'AM5 Socket'],
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4080 16GB',
    category: 'GPU',
    price: 15200000,
    originalPrice: 18000000,
    image: '/nvidia_rtx_gpu.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.9,
    reviews: 201,
    stock: 8,
    description: 'GPU terbaru NVIDIA dengan arsitektur Ada Lovelace untuk ray tracing dan AI yang luar biasa.',
    specs: ['16GB GDDR6X', 'DLSS 3.0', 'Ray Tracing', 'PCIe 4.0'],
  },
  {
    id: 4,
    name: 'Corsair Vengeance RGB 32GB (2x16GB)',
    category: 'RAM',
    price: 2250000,
    originalPrice: 2800000,
    image: '/corsair_ram.png',
    badge: 'Sale',
    badgeColor: 'purple',
    rating: 4.7,
    reviews: 315,
    stock: 45,
    description: 'RAM DDR5 dengan RGB lighting dan performa tinggi, ideal untuk gaming dan workstation.',
    specs: ['DDR5 6000MHz', '32GB (2x16GB)', 'CL36', 'RGB Lighting'],
  },
  {
    id: 5,
    name: 'Samsung 990 Pro 2TB NVMe SSD',
    category: 'Storage',
    price: 3450000,
    originalPrice: 4200000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Popular',
    badgeColor: 'blue',
    rating: 4.8,
    reviews: 178,
    stock: 30,
    description: 'SSD NVMe Gen 4 dengan kecepatan baca 7450MB/s untuk boot dan loading yang super cepat.',
    specs: ['PCIe Gen 4x4', 'Read 7450MB/s', 'Write 6900MB/s', '2TB Capacity'],
  },
  {
    id: 6,
    name: 'Cooler Master Hyper 212 RGB',
    category: 'Cooling',
    price: 650000,
    originalPrice: 850000,
    image: '/corsair_ram.png',
    badge: 'Budget Pick',
    badgeColor: 'cyan',
    rating: 4.6,
    reviews: 423,
    stock: 60,
    description: 'CPU cooler terpopuler dengan 4 heatpipe dan RGB yang kompatibel dengan berbagai socket.',
    specs: ['TDP 150W', 'RGB Fan 120mm', 'AM4/AM5/LGA1700', 'Silent Mode'],
  },
  {
    id: 7,
    name: 'NVIDIA GeForce RTX 4060 Ti 16GB',
    category: 'GPU',
    price: 8900000,
    originalPrice: 10500000,
    image: '/nvidia_rtx_gpu.png',
    badge: 'Sale',
    badgeColor: 'purple',
    rating: 4.7,
    reviews: 156,
    stock: 14,
    description: 'GPU kelas menengah-atas dengan DLSS 3 dan 16GB VRAM untuk gaming 1440p yang mulus.',
    specs: ['16GB GDDR6', 'DLSS 3.0', 'PCIe 4.0', 'AV1 Encode'],
  },
  {
    id: 8,
    name: 'Intel Core i7-14700K',
    category: 'Processor',
    price: 6200000,
    originalPrice: 7400000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Hot',
    badgeColor: 'orange',
    rating: 4.8,
    reviews: 112,
    stock: 18,
    description: 'Prosesor Intel generasi ke-14 dengan 20 core hybrid untuk gaming dan produktivitas tinggi.',
    specs: ['20 Core (8P+12E)', 'Max Boost 5.6GHz', 'TDP 125W', 'LGA1700'],
  },
  {
    id: 9,
    name: 'G.Skill Trident Z5 RGB 64GB (2x32GB)',
    category: 'RAM',
    price: 4100000,
    originalPrice: 5200000,
    image: '/corsair_ram.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.8,
    reviews: 88,
    stock: 25,
    description: 'RAM DDR5 kapasitas besar untuk workstation, rendering, dan multitasking ekstrem.',
    specs: ['DDR5 6400MHz', '64GB (2x32GB)', 'CL32', 'RGB Lighting'],
  },
  {
    id: 10,
    name: 'WD Black SN850X 4TB NVMe SSD',
    category: 'Storage',
    price: 6800000,
    originalPrice: 8000000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Popular',
    badgeColor: 'blue',
    rating: 4.9,
    reviews: 203,
    stock: 11,
    description: 'SSD NVMe Gen 4 kapasitas 4TB untuk gamer dan kreator yang butuh ruang penyimpanan besar.',
    specs: ['PCIe Gen 4x4', 'Read 7300MB/s', 'Write 6600MB/s', '4TB Capacity'],
  },
  {
    id: 11,
    name: 'Noctua NH-D15 Chromax Black',
    category: 'Cooling',
    price: 1450000,
    originalPrice: 1750000,
    image: '/corsair_ram.png',
    badge: 'Best Seller',
    badgeColor: 'red',
    rating: 4.9,
    reviews: 531,
    stock: 32,
    description: 'Air cooler dual-tower premium dengan performa setara AIO 240mm dan keandalan jangka panjang.',
    specs: ['TDP 250W', 'Dual NF-A15 Fan', 'AM4/AM5/LGA1700', 'Chromax.Black'],
  },
  {
    id: 12,
    name: 'Seasonic Focus GX-850 80+ Gold',
    category: 'PSU',
    price: 1850000,
    originalPrice: 2200000,
    image: '/corsair_ram.png',
    badge: 'Hot',
    badgeColor: 'orange',
    rating: 4.8,
    reviews: 298,
    stock: 40,
    description: 'PSU fully modular 850W dengan sertifikasi 80 Plus Gold dan garansi 10 tahun.',
    specs: ['850W', '80+ Gold', 'Fully Modular', '10 Year Warranty'],
  },
  {
    id: 13,
    name: 'Lian Li PC-O11 Dynamic EVO',
    category: 'Casing',
    price: 2100000,
    originalPrice: 2500000,
    image: '/corsair_ram.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.8,
    reviews: 187,
    stock: 20,
    description: 'Casing Mid-Tower ikonik dengan panel kaca tempered ganda dan manajemen kabel premium.',
    specs: ['Mid-Tower ATX', 'Dual Tempered Glass', 'E-ATX Support', 'USB-C Front'],
  },
  {
    id: 14,
    name: 'AMD Radeon RX 7900 XTX 24GB',
    category: 'GPU',
    price: 16500000,
    originalPrice: 19000000,
    image: '/nvidia_rtx_gpu.png',
    badge: 'Sale',
    badgeColor: 'purple',
    rating: 4.8,
    reviews: 143,
    stock: 6,
    description: 'GPU flagship AMD dengan 24GB GDDR6 untuk gaming 4K dan rendering profesional.',
    specs: ['24GB GDDR6', 'DisplayPort 2.1', 'PCIe 4.0', 'FSR 3.0'],
  },
  {
    id: 15,
    name: 'ASUS ROG Maximus Z790 Hero',
    category: 'Motherboard',
    price: 7200000,
    originalPrice: 8500000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Best Seller',
    badgeColor: 'red',
    rating: 4.7,
    reviews: 94,
    stock: 9,
    description: 'Motherboard enthusiast LGA1700 dengan VRM 20+1 fase dan konektivitas lengkap untuk overclocking.',
    specs: ['LGA1700', 'DDR5 Support', 'PCIe 5.0 x16', 'Wi-Fi 6E'],
  },
  {
    id: 16,
    name: 'Kingston Fury Beast 32GB DDR4',
    category: 'RAM',
    price: 1350000,
    originalPrice: 1700000,
    image: '/corsair_ram.png',
    badge: 'Budget Pick',
    badgeColor: 'cyan',
    rating: 4.6,
    reviews: 612,
    stock: 75,
    description: 'RAM DDR4 terjangkau dengan heatspreader low-profile, kompatibel luas dengan platform lama.',
    specs: ['DDR4 3200MHz', '32GB (2x16GB)', 'CL16', 'XMP Support'],
  },
  {
    id: 17,
    name: 'Seagate Barracuda HDD 8TB',
    category: 'Storage',
    price: 1900000,
    originalPrice: 2300000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Popular',
    badgeColor: 'blue',
    rating: 4.5,
    reviews: 389,
    stock: 50,
    description: 'HDD 8TB dengan kecepatan 5400RPM ideal untuk penyimpanan arsip, backup, dan NAS.',
    specs: ['8TB Capacity', '5400 RPM', 'SATA III 6Gb/s', '256MB Cache'],
  },
  {
    id: 18,
    name: 'be quiet! Dark Rock Pro 5',
    category: 'Cooling',
    price: 1650000,
    originalPrice: 1950000,
    image: '/corsair_ram.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.9,
    reviews: 176,
    stock: 22,
    description: 'Air cooler ultra-senyap dengan 7 heatpipe dan dua fan Shadow Wings 3 140mm.',
    specs: ['TDP 270W', 'Dual 140mm Fan', 'AM5/LGA1700', 'Silent Wings'],
  },
  {
    id: 19,
    name: 'Corsair RM1000x Shift 80+ Gold',
    category: 'PSU',
    price: 2800000,
    originalPrice: 3300000,
    image: '/corsair_ram.png',
    badge: 'Hot',
    badgeColor: 'orange',
    rating: 4.8,
    reviews: 211,
    stock: 28,
    description: 'PSU 1000W modular dengan desain kabel side-port unik dan Zero RPM mode untuk operasi senyap.',
    specs: ['1000W', '80+ Gold', 'Fully Modular', 'Side-Port Design'],
  },
  {
    id: 20,
    name: 'Fractal Design North XL',
    category: 'Casing',
    price: 1750000,
    originalPrice: 2100000,
    image: '/corsair_ram.png',
    badge: 'Popular',
    badgeColor: 'blue',
    rating: 4.7,
    reviews: 134,
    stock: 17,
    description: 'Casing Full-Tower bergaya Scandinavian dengan panel depan kayu alami dan airflow optimal.',
    specs: ['Full-Tower ATX', 'Mesh + Wood Front', 'E-ATX Support', 'USB-C Front'],
  },
  {
    id: 21,
    name: 'ASUS ProArt Studiobook 16 OLED',
    category: 'Laptop',
    price: 32000000,
    originalPrice: 38000000,
    image: '/asus_rog_laptop.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.9,
    reviews: 67,
    stock: 5,
    description: 'Laptop kreator premium dengan layar OLED 4K, GPU RTX 4070, dan akurasi warna DCI-P3 100%.',
    specs: ['OLED 4K 120Hz', 'RTX 4070 8GB', '32GB DDR5', '2TB NVMe'],
  },
  {
    id: 22,
    name: 'MSI MEG Aegis Ti5 Gaming PC',
    category: 'Laptop',
    price: 45000000,
    originalPrice: 52000000,
    image: '/asus_rog_laptop.png',
    badge: 'Best Seller',
    badgeColor: 'red',
    rating: 4.7,
    reviews: 43,
    stock: 3,
    description: 'PC gaming all-in-one pre-built dengan RTX 4090 dan Intel Core i9 untuk performa absolut.',
    specs: ['Core i9-14900K', 'RTX 4090 24GB', '64GB DDR5', '4TB NVMe'],
  },
  {
    id: 23,
    name: 'AMD Ryzen 5 7600X',
    category: 'Processor',
    price: 3200000,
    originalPrice: 4000000,
    image: '/amd_ryzen_cpu.png',
    badge: 'Budget Pick',
    badgeColor: 'cyan',
    rating: 4.8,
    reviews: 278,
    stock: 35,
    description: 'Prosesor mid-range terbaik untuk gaming — performa single-core luar biasa dengan harga terjangkau.',
    specs: ['6 Core / 12 Thread', 'Max Boost 5.3GHz', 'TDP 105W', 'AM5 Socket'],
  },
  {
    id: 24,
    name: 'ASUS ROG Swift OLED PG27AQDP',
    category: 'Monitor',
    price: 14500000,
    originalPrice: 17000000,
    image: '/asus_rog_laptop.png',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.9,
    reviews: 89,
    stock: 7,
    description: 'Monitor gaming OLED 27" 2560×1440 dengan refresh rate 480Hz untuk pengalaman kompetitif tertinggi.',
    specs: ['OLED 27" QHD', '480Hz', '0.03ms GTG', 'G-Sync Compatible'],
  },
]

// Cart store
export const cartStore = reactive({
  items: [],

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },

  addItem(product) {
    const existing = this.items.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      this.items.push({ ...product, quantity: 1 })
    }
  },

  removeItem(productId) {
    const index = this.items.findIndex(i => i.id === productId)
    if (index !== -1) this.items.splice(index, 1)
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.id === productId)
    if (item) {
      if (quantity <= 0) this.removeItem(productId)
      else item.quantity = quantity
    }
  },

  clearCart() {
    this.items = []
  }
})

// User session store reaktif
export const userStore = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  get isLoggedIn() {
    return !!this.user
  },

  login(userData, tokenData) {
    this.user = userData
    this.token = tokenData
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
  },

  logout() {
    this.user = null
    this.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
})

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

