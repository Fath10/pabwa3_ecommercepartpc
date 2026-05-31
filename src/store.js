import { reactive, computed } from 'vue'

// Product data
export const products = [
  {
    id: 1,
    name: 'ASUS ROG Strix RX470-E Gaming',
    category: 'Laptop',
    price: 18500000,
    originalPrice: 22000000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&auto=format&fit=crop',
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
    name: 'ASUS TUF Gaming B650M-PLUS',
    category: 'Motherboard',
    price: 3250000,
    originalPrice: 3900000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    badge: 'Recommended',
    badgeColor: 'blue',
    rating: 4.7,
    reviews: 156,
    stock: 18,
    description: 'Motherboard AM5 dengan fitur lengkap untuk build PC gaming modern dan upgrade jangka panjang.',
    specs: ['AM5 Socket', 'DDR5 Support', 'PCIe 5.0', 'M.2 NVMe Slot'],
  },
  {
    id: 8,
    name: 'MSI MAG A650BN 650W 80+ Bronze',
    category: 'Power Supply',
    price: 875000,
    originalPrice: 1100000,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&auto=format&fit=crop',
    badge: 'Hot',
    badgeColor: 'orange',
    rating: 4.6,
    reviews: 142,
    stock: 10,
    description: 'Power supply 650W yang stabil dan efisien untuk kebutuhan PC gaming kelas menengah.',
    specs: ['650W', '80+ Bronze', 'ATX Form Factor', 'Low Noise Fan'],
  },
  {
    id: 9,
    name: 'NZXT H5 Flow Compact ATX Case',
    category: 'Casing',
    price: 1450000,
    originalPrice: 1750000,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop',
    badge: 'New',
    badgeColor: 'green',
    rating: 4.8,
    reviews: 97,
    stock: 5,
    description: 'Casing compact dengan airflow baik, tampilan minimalis, dan ruang cable management yang rapi.',
    specs: ['ATX Support', 'Tempered Glass', 'High Airflow', 'Cable Management'],
  },
  {
    id: 10,
    name: 'Logitech G Pro X Superlight',
    category: 'Peripheral',
    price: 1850000,
    originalPrice: 2200000,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop',
    badge: 'Best Seller',
    badgeColor: 'red',
    rating: 4.9,
    reviews: 264,
    stock: 12,
    description: 'Mouse gaming wireless ringan dengan sensor presisi tinggi untuk pengalaman bermain kompetitif.',
    specs: ['Wireless', 'Ultra Lightweight', 'Hero Sensor', 'Long Battery Life'],
  },
  {
    id: 11,
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    category: 'Peripheral',
    price: 1350000,
    originalPrice: 1650000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
    badge: 'Limited Stock',
    badgeColor: 'yellow',
    rating: 4.7,
    reviews: 188,
    stock: 3,
    description: 'Keyboard mechanical wireless compact yang nyaman untuk mengetik, gaming, dan setup minimalis.',
    specs: ['Wireless Mode', 'Mechanical Switch', 'RGB Backlight', '75% Layout'],
  },
  {
    id: 12,
    name: 'LG UltraGear 27GP850-B 27 Inch',
    category: 'Monitor',
    price: 4750000,
    originalPrice: 5400000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop',
    badge: 'Sale',
    badgeColor: 'purple',
    rating: 4.8,
    reviews: 221,
    stock: 0,
    description: 'Monitor gaming 27 inch dengan refresh rate tinggi, cocok untuk gaming kompetitif dan editing.',
    specs: ['27 Inch', 'QHD Resolution', '165Hz', 'IPS Panel'],
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

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
