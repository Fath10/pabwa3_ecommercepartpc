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

