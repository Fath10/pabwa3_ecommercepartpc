import pool from "../config/db.js";

// ══════════════════════════════════════════════
// SYSTEM PROMPT — Batasan konteks toko e-BuildPC
// ══════════════════════════════════════════════
const SYSTEM_PROMPT_BASE = `Kamu adalah asisten toko komputer "e-BuildPC". Tugasmu HANYA menjawab pertanyaan seputar produk komputer yang dijual di toko ini.

ATURAN UTAMA:
1. DILARANG KERAS MENGARANG PRODUK! Hanya rekomendasikan dan sebutkan produk yang secara eksklusif tertulis di daftar produk di bawah. Jika hanya ada 2 produk di daftar, maka sebutkan HANYA 2 produk tersebut. JANGAN PERNAH menambahkan produk lain dari luar daftar (seperti Cooler Master, Corsair, dll jika tidak terdaftar).
2. Jika pengguna bertanya tentang suatu produk, cari di daftar produk yang namanya paling mendekati/mirip.
3. FORMAT JAWABAN PRODUK: JANGAN PERNAH menyalin format baris/kolom dengan garis tegak (pipe '|') dari daftar produk database. Formatlah setiap produk dengan daftar poin (bullet points) yang rapi seperti berikut:
   - **[Nama Produk]**
     - Harga: [Harga]
     - Stok: [Stok]
     - Deskripsi: [Deskripsi]
4. JANGAN mengatakan produk tidak tersedia jika produk tersebut ada di daftar.
5. Jawablah secara langsung, sopan, ramah, dan to the point. JANGAN PERNAH menyertakan salam pembuka, perkenalan diri, basa-basi, atau kalimat pengantar seperti "Halo! Saya e-BuildPC AI" jika pengguna tidak menyapa terlebih dahulu. Mulailah jawaban langsung ke inti hasil pencarian/rekomendasi produk (misalnya langsung dengan "Berikut adalah...").
6. Pengguna mungkin menggunakan bahasa INFORMAL, SINGKATAN, atau TYPO. Contoh:
   - "prosessor" atau "prosesor" = processor/CPU
   - "vga" = GPU/kartu grafis
   - "mobo" = motherboard
   - "rekom" = rekomendasi
   - "brp hrgnya" = berapa harganya
   - "mding" atau "mnding" = mending/lebih baik
   Selalu pahami KONTEKS dan NIAT pengguna meskipun ada typo atau singkatan.
7. Jika pengguna menyapa (halo, hai, dll), balas dengan ramah dan tawarkan bantuan.
8. Jika pengguna bertanya siapa kamu, perkenalkan diri sebagai asisten e-BuildPC.
9. KOMPARASI PRODUK: Jika pengguna meminta untuk "membandingkan", "apa bedanya", atau "vs" antara dua produk atau lebih, buatlah PERBANDINGAN DALAM BENTUK TABEL Markdown yang rapi (kolom berisi fitur/spesifikasi/harga, dan baris berisi nama produk). Berikan juga kesimpulan singkat mana yang lebih cocok untuk kebutuhan tertentu.
10. DESKRIPSI & KESIMPULAN YANG RELEVAN: JANGAN PERNAH menyalin atau mengulang kalimat template/penutup dari riwayat obrolan sebelumnya secara membabi buta. Selalu sesuaikan deskripsi dan kesimpulan produk secara akurat berdasarkan kategori produk yang sedang dibahas (misalnya casing tidak memiliki kecepatan baca/tulis atau kapasitas penyimpanan).`;

// ══════════════════════════════════════════════
// LAPIS 1: Filter input — deteksi permintaan berbahaya/di luar topik
// ══════════════════════════════════════════════
const BLOCKED_PATTERNS = [
  // Permintaan kode
  /\b(buat(kan)?|tulis(kan)?|kasih|beri(kan)?|generate|create|write|show)\b.{0,30}\b(kode|code|script|html|css|javascript|python|java|php|sql|program|website|web|halaman|page)\b/i,
  /```/,
  /<!DOCTYPE/i,
  /<html/i,
  /<script/i,
  /\bfunction\s*\(/i,
  /\bdef\s+\w+/i,
  /\bSELECT\s+.*FROM/i,
  /\bINSERT\s+INTO/i,
  /\bDROP\s+TABLE/i,
  /\bCREATE\s+TABLE/i,

  // Prompt injection
  /\b(abaikan|ignore|lupakan|forget|skip|override|bypass)\b.{0,30}\b(instruksi|aturan|rules?|prompt|system|perintah|pembatasan|batasan|larangan)\b/i,
  /\b(act|pretend|pura[- ]?pura|berperan|jadilah|kamu\s+(adalah|sekarang))\b.{0,30}\b(sebagai|as|jadi|menjadi)\b/i,
  /\b(tampilkan|show|reveal|print|display)\b.{0,30}\b(system|prompt|instruksi|aturan|rules?)\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b.*\bignore\b/i,

  // Topik berbahaya
  /\b(bom|senjata|narkoba|drugs?|hack(ing)?|exploit|crack(ing)?|virus|malware|weapon|bomb)\b/i,

  // Konten akademis/kreatif
  /\b(tulis(kan)?|buat(kan)?|karang)\b.{0,30}\b(esai|essay|puisi|cerpen|cerita|surat|makalah|skripsi|thesis|laporan|artikel(?!\s+produk))\b/i,

  // Soal pelajaran
  /\b(jawab|kerjakan|selesaikan|solve|answer)\b.{0,30}\b(soal|ujian|tugas|homework|quiz|exam|test)\b/i,
  /\b(hitunglah?|berapa hasil|calculate|rumus)\b/i,
];

const REFUSAL_MESSAGE = "Maaf, saya hanya bisa membantu seputar produk dan layanan toko e-BuildPC. Ada produk komputer yang ingin Anda tanyakan?";

// ══════════════════════════════════════════════
// Deteksi basa-basi / salam — balas dengan ramah tanpa LLM
// ══════════════════════════════════════════════
const GREETING_PATTERNS = [
  /^(halo|halow|hallo|hello|hai|hi|hey|heyyy?|hei)\b/i,
  /^(selamat\s+(pagi|siang|sore|malam|datang))\b/i,
  /^(apa\s+kabar|gimana\s+kabar|how\s+are\s+you)/i,
  /^(siapa\s+(kamu|anda|kau)|kamu\s+siapa|anda\s+siapa)/i,
  /^(kamu\s+bisa\s+apa|anda\s+bisa\s+apa|bisa\s+bantu\s+apa)/i,
  /^(terima\s+kasih|makasih|thanks?|thx|tq|mantap|keren|oke|ok|oks|sip|good|bagus)\b/i,
  /^(boleh\s+tanya|boleh\s+nanya|numpang\s+tanya|excuse\s+me)\b/i,
];

// ══════════════════════════════════════════════
// LAPIS 0.5: Deteksi intent navigasi — arahkan user ke halaman tertentu
// ══════════════════════════════════════════════
const NAVIGATE_INTENTS = [
  {
    // ── Checkout / Bayar ──
    patterns: [
      // Exact & semua variasi typo checkout
      /\b(checkout|check\s*out|chekout|chekcout|chekot|checkut|chekoutt|cheout|checout|cekout|ceckout|chekaut|chekoud|chekout|chekouut|chekoout|cehckout|chcekout|chekotu|chekuot|checokut|checkotu)\b/i,
      // Bahasa Indonesia: bayar, pesan, order
      /\b(bayar|mau\s+bayar|lanjut\s+bayar|proses\s+pembayaran|selesaikan\s+pesanan|konfirmasi\s+pesanan)\b/i,
      /\b(beli\s+sekarang|pesan\s+sekarang|lanjut\s+pesan|order\s+sekarang|mau\s+order|order\s+aja)\b/i,
      /\b(mau\s+checkout|mau\s+chekout|mau\s+cekout|mau\s+pesan|mau\s+beli)\b/i,
      /\b(lanjut\s+ke\s+pembayaran|ke\s+halaman\s+checkout|halaman\s+pembayaran|proses\s+pesanan)\b/i,
      // Partikel informal Indonesia: "kan", "dong", "deh", "nih", "yuk", "aja", "kak"
      /\b(checkout|chekout|cekout|checout)\s*(kan|dong|deh|nih|sekarang|yuk|aja|kak|kuy|donk|dongg|dunk|dungg)?\b/i,
      // Pola: "...kan dong" setelah kata kunci
      /\b(mau\s+)?(checkout|chekout|cekout|checout|bayar|pesan|beli)\s*(kan|dong|deh|nih|yuk|aja|kuy|kak)(\s+dong|\s+deh|\s+nih|\s+kak)?\b/i,
    ],
    url: "/checkout",
    label: "halaman Checkout",
    emoji: "💳",
    reply: "Oke! Saya arahkan kamu ke halaman Checkout sekarang. Silakan lengkapi data pengirimanmu di sana ya! 💳",
  },
  {
    // ── Keranjang / Cart ──
    patterns: [
      /\b(keranjang|keranjangg|kerajang|keranjag|karanjang|kerajangan|kernjang|keranjnag|cart|cartt|crat|crt)\b/i,
      /\b(lihat\s+keranjang|buka\s+keranjang|ke\s+keranjang|halaman\s+keranjang|isi\s+keranjang|cek\s+keranjang)\b/i,
      /\b(shopping\s+cart|mau\s+lihat\s+cart|cek\s+cart|buka\s+cart|mau\s+cart|ke\s+cart|lihat\s+cart)\b/i,
      /\b(belanjaan|belanjaanku|barang\s+belanja|barang\s+di\s+cart|barang\s+di\s+keranjang)\b/i,
      /\b(keranjang|cart)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    url: "/cart",
    label: "halaman Keranjang",
    emoji: "🛒",
    reply: "Oke! Membuka keranjang belanjamu sekarang. Cek produk yang sudah kamu tambahkan ya! 🛒",
  },
  {
    // ── Katalog / Produk ──
    patterns: [
      /\b(katalog|katalok|kataolog|katolog|kataloog|katalg|catalog|katalogue|catalogue)\b/i,
      /\b(lihat\s+produk|semua\s+produk|daftar\s+produk|browse\s+produk|ke\s+katalog|halaman\s+produk|lihat\s+semua)\b/i,
      /\b(tampilkan\s+semua|tampilkan\s+produk|show\s+all|ke\s+toko|buka\s+toko|produk\s+apa\s+saja)\b/i,
      /\b(katalog|toko)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    url: "/katalog",
    label: "halaman Katalog",
    emoji: "🖥️",
    reply: "Siap! Membuka katalog produk e-BuildPC untuk kamu. Temukan komponen PC impianmu di sana! 🖥️",
  },
  {
    // ── Beranda / Home ──
    patterns: [
      /\b(beranda|berandaa|berannda|berandha|home|hoome|hom3|halaman\s+utama|halaman\s+awal)\b/i,
      /\b(ke\s+beranda|ke\s+home|kembali\s+ke\s+beranda|back\s+to\s+home|balik\s+ke\s+home|balik\s+beranda)\b/i,
      /\b(beranda|home)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    url: "/",
    label: "Beranda",
    emoji: "🏠",
    reply: "Baik! Mengarahkanmu ke halaman Beranda e-BuildPC. Selamat berbelanja! 🏠",
  },
  {
    // ── Profil / Pesanan ──
    patterns: [
      /\b(profil|profile|profl|profill|profle|porfile|profil|akun|acount|account)\b/i,
      /\b(pesanan\s+saya|pesananku|riwayat\s+pesanan|order\s+saya|lihat\s+pesanan|riwayat\s+belanja|pesanan\s+ku)\b/i,
      /\b(cek\s+pesanan|status\s+pesanan|my\s+order|my\s+account|my\s+profile|ke\s+profil|halaman\s+profil)\b/i,
      /\b(pesanan|profil|akun)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy|saya|ku)?\b/i,
    ],
    url: "/profile",
    label: "halaman Profil",
    emoji: "👤",
    reply: "Oke! Membuka halaman Profil dan riwayat pesananmu sekarang. 👤",
  },
  {
    // ── Artikel / Blog ──
    patterns: [
      /\b(artikel|articel|artkel|artilkel|artikle|blog|bloog|berita|brita|tips|tutorial)\b/i,
      /\b(ke\s+artikel|halaman\s+artikel|baca\s+artikel|lihat\s+artikel|buka\s+artikel)\b/i,
      /\b(artikel|blog)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    url: "/artikel",
    label: "halaman Artikel",
    emoji: "📰",
    reply: "Siap! Membuka halaman Artikel — banyak tips dan tutorial seputar komponen PC yang bisa kamu baca! 📰",
  },
  {
    // ── Login ──
    patterns: [
      /\b(login|masuk|sign\s*in|log\s*in)\b/i,
      /\b(halaman\s+login|ke\s+login|ke\s+halaman\s+masuk)\b/i,
      /\b(login|masuk)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    url: "/login",
    label: "halaman Login",
    emoji: "🔑",
    reply: "Siap! Mengarahkan kamu ke halaman Login sekarang. 🔑",
  },
  {
    // ── Logout ──
    patterns: [
      /\b(logout|keluar|sign\s*out|log\s*out)\b/i,
      /\b(keluar\s+akun|logout\s+akun|log\s*out\s+akun)\b/i,
      /\b(logout|keluar)\s*(kan|dong|deh|nih|yuk|aja|kak|kuy)?\b/i,
    ],
    action: "logout",
    url: "/login",
    label: "Logout",
    emoji: "🚪",
    reply: "Mengeluarkan kamu dari akun... Sampai jumpa lagi! 🚪",
  },
];

function detectNavigationIntent(message) {
  const lower = message.toLowerCase().trim();
  for (const intent of NAVIGATE_INTENTS) {
    for (const pattern of intent.patterns) {
      if (pattern.test(lower)) {
        return intent;
      }
    }
  }
  return null;
}

const GREETING_REPLIES = [
  "Halo! 👋 Saya **e-BuildPC AI**, asisten virtual toko komponen PC terlengkap. Ada komponen PC yang ingin Anda cari atau tanyakan?",
  "Hai! 😊 Saya e-BuildPC AI. Saya siap membantu Anda menemukan komponen PC yang tepat — mulai dari CPU, GPU, RAM, SSD, dan lainnya. Ada yang bisa saya bantu?",
  "Halo! Selamat datang di e-BuildPC 🖥️ Saya AI asisten toko ini. Mau cari komponen PC apa hari ini?",
];

const IDENTITY_REPLIES = [
  "Saya **e-BuildPC AI** 🤖 — asisten virtual toko e-BuildPC yang siap membantu Anda memilih dan menemukan komponen PC terbaik. Ada yang ingin ditanyakan seputar produk kami?",
  "Nama saya e-BuildPC AI! 😄 Saya dirancang khusus untuk membantu Anda menemukan komponen PC — seperti processor, GPU, RAM, SSD, dan masih banyak lagi. Mau cari apa?",
];

const THANKS_REPLIES = [
  "Sama-sama! 😊 Semoga bisa membantu. Ada lagi yang ingin ditanyakan seputar komponen PC?",
  "Dengan senang hati! 🙌 Kalau ada pertanyaan lain tentang produk kami, jangan sungkan untuk tanya ya.",
  "Terima kasih sudah mengunjungi e-BuildPC! 🖥️ Ada komponen PC lain yang bisa saya bantu carikan?",
];

function getGreetingReply(message) {
  const lower = message.toLowerCase().trim();

  // Ucapan terima kasih
  if (/\b(terima\s*kasih|makasih|thanks?|thx|tq|mantap|keren)\b/i.test(lower)) {
    return THANKS_REPLIES[Math.floor(Math.random() * THANKS_REPLIES.length)];
  }

  // Pertanyaan identitas
  if (/(siapa\s+(kamu|anda|kau)|kamu\s+siapa|anda\s+siapa|kamu\s+bisa\s+apa|anda\s+bisa\s+apa)/i.test(lower)) {
    return IDENTITY_REPLIES[Math.floor(Math.random() * IDENTITY_REPLIES.length)];
  }

  // Salam / basa-basi umum
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(lower)) {
      return GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)];
    }
  }

  return null; // Bukan salam
}

function isBlockedInput(message) {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      return true;
    }
  }
  return false;
}

// ══════════════════════════════════════════════
// LAPIS 3: Sanitasi output — hapus kode/HTML dari jawaban LLM
// ══════════════════════════════════════════════
function sanitizeOutput(text) {
  let cleaned = text;

  // Hapus code blocks (``` ... ```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "[kode dihapus]");

  // Hapus inline code (` ... `)
  cleaned = cleaned.replace(/`[^`]+`/g, "");

  // Hapus tag HTML
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Hapus pola yang terlihat seperti kode
  cleaned = cleaned.replace(/^\s*(function|def|class|import|const|let|var|<!DOCTYPE)\b.*$/gm, "");

  // ── Hapus Markdown formatting ──
  // Bold: **teks** atau __teks__
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.+?)__/g, "$1");

  // Italic: *teks* atau _teks_
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1");
  cleaned = cleaned.replace(/_(.+?)_/g, "$1");

  // Header: ### ## #
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

  // Bullet list: - item atau * item (di awal baris)
  cleaned = cleaned.replace(/^\s*[-*]\s+/gm, "• ");

  // Numbered list: 1. item → tetap, tapi hapus jika ada format aneh
  // Horizontal rule: --- atau ***
  cleaned = cleaned.replace(/^[-*]{3,}\s*$/gm, "");

  // Trim whitespace berlebih
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
}


// ══════════════════════════════════════════════
// Helper: Levenshtein distance (untuk fuzzy matching typo)
// ══════════════════════════════════════════════
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return dp[m][n];
}

// ══════════════════════════════════════════════
// Helper: Deteksi apakah pesan berkaitan dengan produk PC
// Sekarang menggunakan fuzzy matching agar tahan typo
// ══════════════════════════════════════════════
const PRODUCT_KEYWORDS = [
  // Komponen PC
  "ram", "memory", "memori", "ddr", "ddr4", "ddr5",
  "cpu", "processor", "prosesor", "intel", "amd", "ryzen", "core", "i3", "i5", "i7", "i9",
  "gpu", "vga", "rtx", "gtx", "rx", "nvidia", "radeon", "grafis", "graphic",
  "ssd", "hdd", "nvme", "storage", "harddisk", "hardisk",
  "motherboard", "mobo", "mainboard",
  "psu", "power supply",
  "casing", "kabinet",
  "cooler", "cooling", "heatsink", "fan", "kipas", "aio",
  "monitor", "layar", "display",
  "keyboard", "mouse", "headset", "speaker",
  // Kata kunci belanja/toko
  "produk", "product", "harga", "price", "beli", "buy", "stok", "stock",
  "rekomendasi", "rekom", "recommend", "rekomendasikan", "suggest",
  "murah", "mahal", "budget", "gaming", "build", "rakit", "bajet", "dana", "anggaran", "juta", "jt", "ribu", "rb", "rupiah", "rp",
  "spesifikasi", "specs", "spec", "watt", "ghz", "mhz",
  "asus", "msi", "gigabyte", "asrock", "corsair", "kingston", "crucial",
  "seagate", "western", "samsung", "kingspec",
  "komputer", "computer", "pc", "laptop",
];

function isProductRelatedQuery(message) {
  const lower = message.toLowerCase();
  const words = lower.replace(/[^\w\s]/g, " ").split(/\s+/).filter(w => w.length > 1);

  // 1. Exact match dulu (cepat)
  if (PRODUCT_KEYWORDS.some((kw) => lower.includes(kw))) {
    return true;
  }

  // 2. Fuzzy match — cek tiap kata user terhadap product keywords
  //    Toleransi: max 2 typo untuk kata >= 5 huruf, max 1 typo untuk kata 3-4 huruf
  for (const word of words) {
    for (const kw of PRODUCT_KEYWORDS) {
      if (kw.length < 3) continue; // skip keyword terlalu pendek
      const maxDist = kw.length >= 5 ? 2 : 1;
      if (Math.abs(word.length - kw.length) > maxDist) continue; // skip jika beda panjang terlalu jauh
      if (levenshtein(word, kw) <= maxDist) {
        return true;
      }
    }
  }

  return false;
}

// ══════════════════════════════════════════════
// Helper: Parse budget/harga maksimum dari pesan user
// Contoh: "under 3 juta" → 3000000, "dibawah 500rb" → 500000
// ══════════════════════════════════════════════
function parseBudget(message) {
  const lower = message.toLowerCase();

  // Pola: angka + juta/jt (e.g. "3 juta", "2.5jt", "under 3juta")
  const jutaMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/);
  if (jutaMatch) {
    const num = parseFloat(jutaMatch[1].replace(",", "."));
    return Math.round(num * 1_000_000);
  }

  // Pola: angka + ribu/rb (e.g. "500 ribu", "750rb")
  const ribuMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb)/);
  if (ribuMatch) {
    const num = parseFloat(ribuMatch[1].replace(",", "."));
    return Math.round(num * 1_000);
  }

  return null; // Tidak ada budget disebutkan
}

// ══════════════════════════════════════════════
// Helper: Ekstrak kata kunci dari pesan user
// ══════════════════════════════════════════════
// Kata-kata terkait harga/budget yang tidak perlu masuk ke pencarian produk
const PRICE_NOISE_WORDS = new Set([
  "under", "below", "dibawah", "dibawah", "kurang", "maksimal", "max",
  "juta", "jt", "ribu", "rb", "rp", "rupiah", "harga", "price", "budget",
  "murah", "mahal", "terjangkau", "affordable", "cheap",
  "3", "4", "5", "6", "7", "8", "9", "10", "15", "20", "50",
  "100", "200", "300", "400", "500",
  "rekomendasi", "rekomendasikan", "recommend", "suggest", "saran",
  "part", "parts", "pc", "komputer", "computer"
]);

const SYNONYMS = {
  // Sinonim standar
  vga: "gpu",
  mobo: "motherboard",
  mainboard: "motherboard",
  prosesor: "processor",
  heatsink: "cooler",
  cooling: "cooler",
  kipas: "fan",
  hardisk: "hdd",
  harddisk: "hdd",
  memori: "memory",
  layar: "monitor",
  grafis: "gpu",
  // Typo umum
  prossesor: "processor",
  procesor: "processor",
  prosessor: "processor",
  prossecor: "processor",
  proccesor: "processor",
  keyborad: "keyboard",
  keybord: "keyboard",
  kyboard: "keyboard",
  keybard: "keyboard",
  moniter: "monitor",
  montor: "monitor",
  monitr: "monitor",
  monnitor: "monitor",
  nvdia: "nvidia",
  nvidea: "nvidia",
  nividia: "nvidia",
  gforce: "geforce",
  geforse: "geforce",
  geporce: "geforce",
  corsiar: "corsair",
  corsar: "corsair",
  korsair: "corsair",
  kingstone: "kingston",
  kingstn: "kingston",
  samshung: "samsung",
  samsng: "samsung",
  gigatbyte: "gigabyte",
  gigabye: "gigabyte",
  mothrboard: "motherboard",
  motherbord: "motherboard",
  motherboar: "motherboard",
  moterbord: "motherboard",
  // Singkatan chat
  bajet: "budget",
  rekom: "rekomendasi",
  rekom: "rekomendasi",
  rekomen: "rekomendasi",
  mding: "mending",
  mnding: "mending",
  brp: "berapa",
  brpa: "berapa",
  hrg: "harga",
  hrgnya: "harga",
  hrgny: "harga",
  stk: "stok",
  gmn: "bagaimana",
  gmna: "bagaimana",
  giman: "bagaimana",
  bgs: "bagus",
  yg: "yang",
  utk: "untuk",
  dg: "dengan",
  dgn: "dengan",
  krn: "karena",
  klo: "kalau",
  klu: "kalau",
  gk: "tidak",
  ga: "tidak",
  gak: "tidak",
  tdk: "tidak",
  sm: "sama",
  bkn: "bukan",
  lg: "lagi",
  blh: "boleh",
  bs: "bisa",
  sy: "saya",
  ak: "aku",
};

// Fuzzy synonym matching — cari sinonim terdekat jika typo
function fuzzyMatchSynonym(word) {
  // Exact match dulu
  if (SYNONYMS[word]) return SYNONYMS[word];

  // Fuzzy match terhadap kunci SYNONYMS
  let bestMatch = null;
  let bestDist = Infinity;
  for (const key of Object.keys(SYNONYMS)) {
    if (key.length < 3 || Math.abs(word.length - key.length) > 2) continue;
    const dist = levenshtein(word, key);
    const maxDist = key.length >= 5 ? 2 : 1;
    if (dist <= maxDist && dist < bestDist) {
      bestDist = dist;
      bestMatch = SYNONYMS[key];
    }
  }
  return bestMatch; // null jika tidak ada match
}

function extractKeywords(message) {
  const stopWords = new Set([
    "yang", "dan", "di", "ke", "dari", "untuk", "dengan", "adalah", "ini",
    "itu", "atau", "ada", "bisa", "saya", "aku", "kamu", "apa", "bagaimana",
    "mana", "kalau", "jika", "buat", "bikin", "mau", "ingin",
    "tolong", "dong", "ya", "kah", "lah", "punya", "paling", "pake", "pakai",
    "the", "is", "are", "a", "an", "in", "on", "for", "to", "of", "and",
    "what", "how", "which", "can", "do", "have", "has", "i", "you", "me",
    "kasih", "carikan", "bantu", "butuh", "perlu", "cocok", "terbaik", "best",
    "halo", "hai", "hi", "hello", "selamat", "pagi", "siang", "sore", "malam",
    "terima", "makasih", "thanks", "thank",
    "tidak", "bukan", "sama", "lagi", "boleh", "karena", "bagaimana",
    "mending", "lebih", "baik", "bandingin", "banding", "compare",
    "dapat", "dapet", "dpt", "dapatkan", "peroleh", "dapetnya", "dapatnya", "dptnya",
    // Kata kerja/aksi umum
    "berikan", "beri", "tampilkan", "tunjukkan", "lihat", "lihatkan",
    "semua", "seluruh", "setiap", "tiap", "masing",
    "daftar", "list", "kategori", "tipe", "jenis",
    "cari", "carin", "cariin", "kasih", "kasihkan",
    "mana", "dong", "donk", "deh", "nih", "sih",
    "ada", "punya", "jual", "tersedia", "available",
    "termurah", "termahal", "cheapest", "most", "expensive",
  ]);

  // Hapus pola budget agar angka/satuan budget tidak menjadi keyword pencarian
  let cleanMessage = message.toLowerCase();
  cleanMessage = cleanMessage
    .replace(/\d+(?:[.,]\d+)?\s*(?:juta|jt|ribu|rb|rupiah|rp)/g, "")
    .replace(/\b(rp)\s*\d+(?:[.,]\d+)?/g, "");

  const words = cleanMessage
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w) && !PRICE_NOISE_WORDS.has(w))
    .map((w) => {
      // 1. Exact synonym
      if (SYNONYMS[w]) return SYNONYMS[w];
      // 2. Fuzzy synonym (handle typo)
      const fuzzy = fuzzyMatchSynonym(w);
      if (fuzzy) return fuzzy;
      // 3. Return as-is
      return w;
    });

  return [...new Set(words)];
}

// ══════════════════════════════════════════════
// Helper: Ekspansi fuzzy — hasilkan varian substring dari keyword
// Mengatasi typo seperti "kingstone" → cocok dengan "Kingston"
// ══════════════════════════════════════════════
function expandKeywordsFuzzy(keywords) {
  const expanded = new Set(keywords);
  for (const kw of keywords) {
    if (kw.length >= 5) {
      // Tambahkan semua substring dengan panjang minimal 4 karakter
      for (let start = 0; start <= kw.length - 4; start++) {
        for (let end = start + 4; end <= kw.length; end++) {
          expanded.add(kw.slice(start, end));
        }
      }
    }
  }
  return [...expanded];
}

// ══════════════════════════════════════════════
// Helper: Query produk relevan dari database (RAG)
// ══════════════════════════════════════════════
async function fetchRelevantProducts(keywords, maxPrice = null) {
  // Jika tidak ada keyword, jangan tampilkan produk apapun
  if (!keywords || keywords.length === 0) {
    return [];
  }

  // Ekspansi keyword dengan fuzzy variants untuk toleransi typo
  const fuzzyKeywords = expandKeywordsFuzzy(keywords);

  const conditions = fuzzyKeywords.map(
    (_, i) => `(p.product_name ILIKE $${i + 1} OR p.description ILIKE $${i + 1} OR c.category_name ILIKE $${i + 1})`
  );
  const params = fuzzyKeywords.map((k) => `%${k}%`);

  // Tambahkan filter harga jika ada budget
  let priceFilter = "";
  if (maxPrice) {
    params.push(maxPrice);
    priceFilter = `AND p.price <= $${params.length}`;
  }

  const query = `
    SELECT
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      c.category_name,
      COALESCE((SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id LIMIT 1), NULL) AS image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.is_active = TRUE
      AND p.stock > 0
      AND (${conditions.join(" OR ")})
      ${priceFilter}
    ORDER BY p.product_id ASC
    LIMIT 20
  `;

  try {
    const result = await pool.query(query, params);
    const rows = result.rows;
    if (rows.length === 0) return [];

    // Hitung skor berdasarkan keyword ASLI untuk ranking
    const scoredProducts = rows.map((p) => {
      let score = 0;
      const productName = p.product_name.toLowerCase();
      const description = (p.description || "").toLowerCase();
      const categoryName = (p.category_name || "").toLowerCase();

      keywords.forEach((k) => {
        const kl = k.toLowerCase();
        // Bonus tinggi jika keyword cocok dengan category name (paling relevan)
        if (categoryName.includes(kl)) score += 10;
        // Bonus jika keyword cocok dengan nama produk
        if (productName.includes(kl)) score += 5;
        // Bonus kecil jika hanya di deskripsi
        if (description.includes(kl)) score += 1;
      });

      return { ...p, score };
    });

    scoredProducts.sort((a, b) => b.score - a.score);

    // Ambil hanya produk yang skor-nya >= 50% dari skor tertinggi
    // dan skor minimal 5 (artinya harus match di nama produk atau kategori)
    const highestScore = scoredProducts[0].score;
    const threshold = Math.max(5, highestScore * 0.50);
    const bestMatches = scoredProducts.filter((p) => p.score >= threshold);

    return bestMatches; // Kembalikan semua match terbaik agar sorting harga di caller akurat
  } catch (error) {
    console.error("RAG query error:", error.message);
    return [];
  }
}

// ══════════════════════════════════════════════
// Helper: Ambil produk termurah per kategori (fallback untuk query umum)
// ══════════════════════════════════════════════
async function fetchBroadCatalog(maxPrice = null) {
  const priceFilter = maxPrice ? `AND p.price <= $1` : "";
  const params = maxPrice ? [maxPrice] : [];

  const query = `
    SELECT DISTINCT ON (c.category_name)
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.is_active = TRUE AND p.stock > 0
      ${priceFilter}
    ORDER BY c.category_name, p.price ASC
  `;

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Broad catalog query error:", error.message);
    return [];
  }
}

// ══════════════════════════════════════════════
// Helper: Format data produk menjadi konteks teks
// ══════════════════════════════════════════════
function formatProductContext(products) {
  if (!products || products.length === 0) {
    return "Tidak ada data produk yang ditemukan di database saat ini.";
  }

  const formatted = products.map((p) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p.price);

    const stockStatus =
      p.stock > 0 ? `${p.stock} unit` : "HABIS";

    return `- **${p.product_name}**
  - Harga: ${price}
  - Stok: ${stockStatus}
  - Deskripsi: ${p.description || "-"}`;
  });

  return formatted.join("\n\n");
}

// ══════════════════════════════════════════════
// RAKIT PC: Deteksi & alokasi budget per komponen
// ══════════════════════════════════════════════
const RAKIT_PC_PATTERNS = [
  // Eksplisit: rakit/build + pc
  /\b(rakit|build|bangun|susun|bikin|buat)\b.{0,30}\b(pc|komputer|computer|gaming\s*pc|gaming\s*rig|rig)\b/i,
  /\b(pc|komputer|gaming)\b.{0,30}\b(rakit|build|bangun|susun)\b/i,

  // Rekomendasi + komponen/build/pc gaming
  /\b(rekomendasikan?|sarankan?|suggest|recommend|kasih\s+rekom|beri\s+rekom)\b.{0,40}\b(rakitan|komponen|build|pc\s*gaming|spek|part)\b/i,
  /\b(spek|spec|komponen|part|build)\b.{0,20}\b(pc|gaming|komputer)\b.{0,20}\d/i,
  /\b(build|rakit|spek)\b.{0,20}\b(budget|bajet|anggaran)\b/i,

  // "rekomendasi pc X juta" — pola paling umum
  /\b(rekomendasi|rekom|saran|suggest)\b.{0,20}\b(pc|komputer|gaming)\b.{0,20}\d/i,
  /\b(pc|komputer|gaming)\b.{0,10}\d+\s*(juta|jt|rb|ribu)/i,

  // Langsung sebut budget + pc
  /\d+\s*(juta|jt).{0,20}\b(pc|rakit|gaming|komputer|komponen)\b/i,
  /\b(pc|gaming|komputer)\b.{0,10}(bajet|budget|anggaran).{0,10}\d/i,
];

function isRakitPCQuery(message) {
  return RAKIT_PC_PATTERNS.some((p) => p.test(message));
}

// Alokasi budget per kategori (total 100%)
const PC_BUILD_ALLOCATION = [
  { category: "GPU",         pct: 0.30, label: "GPU / Kartu Grafis" },
  { category: "Processor",   pct: 0.20, label: "Processor (CPU)"    },
  { category: "Motherboard", pct: 0.15, label: "Motherboard"        },
  { category: "RAM",         pct: 0.13, label: "RAM"                },
  { category: "Storage",     pct: 0.10, label: "Storage (SSD/HDD)"  },
  { category: "PSU",         pct: 0.05, label: "Power Supply (PSU)" },
  { category: "Casing",      pct: 0.04, label: "Casing"             },
  { category: "Cooling",     pct: 0.03, label: "CPU Cooler"         },
];

// Ambil semua kategori dari database (untuk mapping dinamis)
async function getDBCategories() {
  try {
    const result = await pool.query(
      `SELECT category_id, category_name FROM categories ORDER BY category_id ASC`
    );
    return result.rows; // [{ category_id, category_name }]
  } catch (err) {
    console.error("getDBCategories error:", err.message);
    return [];
  }
}

// Cari nama kategori DB yang paling cocok dengan slot build
function matchCategory(slotCategory, dbCategories) {
  const lower = slotCategory.toLowerCase();

  // Sinonim mapping: slot name → kata kunci untuk mencocokkan kategori DB
  const synonyms = {
    gpu: ["gpu", "vga", "grafis", "graphic", "kartu grafis", "video"],
    processor: ["processor", "prosesor", "cpu", "intel", "amd"],
    motherboard: ["motherboard", "mobo", "mainboard"],
    ram: ["ram", "memory", "memori", "ddr"],
    storage: ["storage", "ssd", "hdd", "nvme", "harddisk"],
    psu: ["psu", "power supply", "power"],
    casing: ["casing", "case", "kabinet", "chassis"],
    cooling: ["cooling", "cooler", "heatsink", "fan", "aio"],
    monitor: ["monitor", "layar", "display"],
    laptop: ["laptop", "notebook"],
  };

  const keywords = synonyms[lower] || [lower];

  // Cari kategori DB yang namanya mengandung salah satu keyword
  for (const kw of keywords) {
    const match = dbCategories.find((c) =>
      c.category_name.toLowerCase().includes(kw)
    );
    if (match) return match.category_name;
  }
  return null; // tidak ditemukan
}

// Ambil produk — algoritma greedy: sebanyak mungkin komponen dalam budget
async function fetchPCBuild(totalBudget) {
  const dbCategories = await getDBCategories();

  // Step 1: Ambil produk TERMURAH per kategori dari DB
  const cheapestPerSlot = [];
  for (const slot of PC_BUILD_ALLOCATION) {
    const realCategoryName = matchCategory(slot.category, dbCategories);
    if (!realCategoryName) continue;

    try {
      const result = await pool.query(
        `SELECT p.product_id, p.product_name, p.description, p.price, p.stock, c.category_name,
           COALESCE((SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id LIMIT 1), NULL) AS image_url
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.category_id
         WHERE p.is_active = TRUE AND p.stock > 0
           AND LOWER(c.category_name) = LOWER($1)
         ORDER BY p.price ASC LIMIT 1`,
        [realCategoryName]
      );
      if (result.rows.length > 0) {
        cheapestPerSlot.push({
          ...result.rows[0],
          slot_label: slot.label,
          slot_category: slot.category,
          realCategoryName,
        });
      }
    } catch (err) {
      console.error(`PC build cheapest fetch [${slot.category}]:`, err.message);
    }
  }

  // Step 2: Urutkan dari termurah ke termahal → greedy pilih yang masuk budget
  const sorted = [...cheapestPerSlot].sort((a, b) => Number(a.price) - Number(b.price));
  let running = 0;
  const selected = new Set();

  for (const item of sorted) {
    const price = Number(item.price);
    if (running + price <= totalBudget) {
      selected.add(item.slot_category);
      item._selected = true;
      running += price;
    }
  }

  // Step 3: Dengan sisa budget, coba upgrade GPU atau CPU (prioritas tertinggi)
  const UPGRADE_PRIORITY = ["GPU", "Processor", "Motherboard", "RAM", "Storage"];
  const remaining = totalBudget - running;

  for (const slotKey of UPGRADE_PRIORITY) {
    const base = cheapestPerSlot.find(
      (s) => s.slot_category.toLowerCase() === slotKey.toLowerCase() && s._selected
    );
    if (!base) continue;

    const upgradeMax = remaining + Number(base.price);
    try {
      const upgraded = await pool.query(
        `SELECT p.product_id, p.product_name, p.description, p.price, p.stock, c.category_name,
           COALESCE((SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id LIMIT 1), NULL) AS image_url
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.category_id
         WHERE p.is_active = TRUE AND p.stock > 0
           AND LOWER(c.category_name) = LOWER($1)
           AND p.price <= $2 AND p.price > $3
         ORDER BY p.price DESC LIMIT 1`,
        [base.realCategoryName, upgradeMax, Number(base.price)]
      );
      if (upgraded.rows.length > 0) {
        // Ganti dengan versi upgrade
        const upgradedPrice = Number(upgraded.rows[0].price);
        running = running - Number(base.price) + upgradedPrice;
        Object.assign(base, upgraded.rows[0]);
        break; // Hanya upgrade satu komponen
      }
    } catch (err) {
      console.error(`PC build upgrade [${slotKey}]:`, err.message);
    }
  }

  // Step 4: Bangun hasil — sertakan semua komponen, tandai yang over budget
  const slotOrder = PC_BUILD_ALLOCATION.map((s) => s.category.toLowerCase());
  const sortBySlot = (a, b) =>
    slotOrder.indexOf(a.slot_category.toLowerCase()) -
    slotOrder.indexOf(b.slot_category.toLowerCase());

  const buildParts = cheapestPerSlot.sort(sortBySlot).map((p) => ({
    ...p,
    overBudget: !p._selected,
  }));

  return buildParts;
}



// Format build summary untuk context LLM
function formatBuildContext(parts, totalBudget) {
  const fmt = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const withinParts = parts.filter(p => !p.overBudget);
  const overParts = parts.filter(p => p.overBudget);

  const totalWithin = withinParts.reduce((s, p) => s + Number(p.price), 0);

  const withinLines = withinParts.map(
    (p) => `- ${p.slot_label}: ${p.product_name} - Harga: ${fmt(p.price)} (Stok: ${p.stock} unit)`
  );

  const overLines = overParts.map(
    (p) => `- ${p.slot_label}: ${p.product_name} - Harga: ${fmt(p.price)}`
  );

  const result = [
    `Budget user: ${fmt(totalBudget)}`,
    "",
  ];

  if (withinLines.length > 0) {
    result.push("Komponen yang BISA DIDAPATKAN dengan budget ini:");
    result.push(...withinLines);
    result.push(`Subtotal: ${fmt(totalWithin)}`);
    result.push(`Sisa budget: ${fmt(totalBudget - totalWithin)}`);
  } else {
    result.push("TIDAK ADA komponen apapun yang bisa didapatkan dengan budget ini. Harga part PC paling murah di toko melebihi budget user.");
  }

  if (overLines.length > 0) {
    result.push("");
    result.push("Komponen yang TIDAK BISA DIDAPATKAN (Melebihi sisa budget):");
    result.push(...overLines);
    
    result.push("");
    result.push("Kekurangan dana untuk membeli masing-masing komponen over-budget:");
    overParts.forEach(p => {
      const needed = Number(p.price) - (totalBudget - totalWithin);
      result.push(`- Untuk membeli [${p.slot_label}] ${p.product_name}, user butuh menambah dana sebesar: ${fmt(needed)}`);
    });
  }

  return result.join("\n");
}

// ══════════════════════════════════════════════
// LAPIS 0.7: Composite Agentic Intent Detection
// Deteksi pesan multi-langkah seperti "cari laptop termurah checkout alamat X pengiriman JNE bayar QRIS"
// ══════════════════════════════════════════════

const COURIER_MAP = {
  jne: "jne", jn: "jne",
  "j&t": "jnt", jnt: "jnt", "j and t": "jnt", "jandt": "jnt",
  sicepat: "sicepat", "si cepat": "sicepat",
  gosend: "gosend", "go send": "gosend", gojek: "gosend",
};

const PAYMENT_MAP = {
  bca: "bca",
  mandiri: "mandiri",
  bri: "bri",
  bni: "bni",
  gopay: "gopay", "go pay": "gopay",
  ovo: "ovo",
  dana: "dana",
  shopeepay: "shopeepay", "shopee pay": "shopeepay", spay: "shopeepay",
  qris: "qris", qr: "qris",
};

// Pola checkout composite: pesan harus mengandung kata pencarian produk + intent checkout/beli
const AGENTIC_PATTERNS = [
  // "cari X ... checkout/beli/pesan"
  /\b(cari|carikan|cariin|carin|tolong\s+carikan)\b.{2,100}\b(checkout|chekout|cekout|bayar|beli|pesan|order)\b/i,
  // "beli X ... checkout/bayar"
  /\b(beli|belikan|beliin)\b.{2,60}\b(checkout|chekout|cekout|bayar|pesan|order|kirim|alamat)\b/i,
  // "checkout ... X" (checkout dulu, baru sebut produk)
  /\b(checkout|chekout|cekout)\b.{2,60}\b(cari|carikan|beli|produk|laptop|gpu|vga|ram|ssd|processor|cpu|motherboard|mobo|psu|casing|monitor|keyboard|mouse)\b/i,
  // "cari X ... alamat/kirim/pengiriman" (tanpa kata checkout eksplisit)
  /\b(cari|carikan|cariin|beli|belikan)\b.{2,60}\b(alamat|kirim|pengiriman|kurir)\b/i,
  // "cari laptop termurah" - Agentic search pattern
  /\b(cari|carikan|bantu\s+cari|lihat)\b.{2,40}\b(termurah|termahal|murah|mahal|bagus|terbaik)\b/i,
];

function isAgenticCheckoutIntent(message) {
  const lower = message.toLowerCase();
  
  // 1. Check for checkout, buy, or payment action keywords
  const hasCheckoutIntent = /\b(checkout|check\s*out|chekout|chekcout|chekot|checkut|chekoutt|cheout|checout|cekout|ceckout|chekaut|chekoud|chekouut|chekoout|cehckout|chcekout|chekotu|chekuot|checokut|checkotu|bayar|beli|pesan|order)\b/i.test(lower);
  
  // 2. Check for shipping or payment details
  const hasAddress = /\b(alamat|jalan|kirim\s+ke|dikirim\s+ke|samboja)\b/i.test(lower);
  const hasCourier = /\b(kurir|jne|jnt|j&t|sicepat|gosend|go-send|gojek)\b/i.test(lower);
  const hasPayment = /\b(bayar|pembayaran|qris|qr|bca|mandiri|bri|bni|gopay|ovo|dana|shopeepay|spay)\b/i.test(lower);

  // 3. Check for add to cart keywords
  const hasAddToCartIntent = /\b(tambah|tambahkan|masuk|masukkan|input)\b.*\b(keranjang|cart)\b/i.test(lower);
  
  if (hasCheckoutIntent && (hasAddress || hasCourier || hasPayment)) {
    return true;
  }

  if (hasCheckoutIntent || hasAddToCartIntent) {
    const afterCheckout = lower.replace(/\b(checkout|check\s*out|chekout|chekcout|chekot|checkut|chekoutt|cheout|checout|cekout|ceckout|chekaut|chekoud|chekouut|chekoout|cehckout|chcekout|chekotu|chekuot|checokut|checkotu|bayar|beli|pesan|order|tambah|tambahkan|masuk|masukkan|input|ke|halaman|dong|deh|nih|yuk|aja|kak|kuy|keranjang|cart)\b/g, "").trim();
    if (afterCheckout.length > 2) {
      return true;
    }
  }

  return AGENTIC_PATTERNS.some((p) => p.test(message));
}

function extractShippingAddress(message) {
  // Pola: "alamat [teks]" atau "kirim ke [teks]" atau "ke alamat [teks]"
  const patterns = [
    /(?:alamat|ke\s+alamat|kirim\s+ke|dikirim\s+ke|pengiriman\s+ke)\s+(.+?)(?:\s*(?:,\s*)?(?:pengiriman|kurir|kirim|pakai|pake|dengan|bayar|pembayaran|metode)|$)/i,
  ];
  for (const p of patterns) {
    const m = message.match(p);
    if (m && m[1]) {
      let addr = m[1].trim();
      // Hapus kata-kata kurir/payment yang mungkin tertangkap
      for (const key of Object.keys(COURIER_MAP)) {
        addr = addr.replace(new RegExp(`\\b${key}\\b`, "gi"), "").trim();
      }
      for (const key of Object.keys(PAYMENT_MAP)) {
        addr = addr.replace(new RegExp(`\\b${key}\\b`, "gi"), "").trim();
      }
      // Bersihkan trailing comma/spasi
      addr = addr.replace(/[,\s]+$/, "").trim();
      if (addr.length >= 3) return addr;
    }
  }
  return null;
}

function extractCourier(message) {
  const lower = message.toLowerCase();
  // Cek setiap key dari COURIER_MAP
  for (const [key, id] of Object.entries(COURIER_MAP)) {
    if (lower.includes(key)) return id;
  }
  return null;
}

function extractPayment(message) {
  const lower = message.toLowerCase();
  // Urutan: cek multi-word dulu, lalu single-word
  const sortedKeys = Object.keys(PAYMENT_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) return PAYMENT_MAP[key];
  }
  return null;
}

function extractSortPreference(message) {
  const lower = message.toLowerCase();
  if (/\b(termurah|paling\s+murah|cheapest|harga\s+terendah|murah)\b/i.test(lower)) return "cheapest";
  if (/\b(termahal|paling\s+mahal|most\s+expensive|harga\s+tertinggi|mahal)\b/i.test(lower)) return "most_expensive";
  return "cheapest"; // Default: termurah
}

async function detectAgenticIntent(message) {
  if (!isAgenticCheckoutIntent(message)) return null;

  // Bersihkan pesan dari info checkout/alamat/kurir/pembayaran agar keyword pencarian lebih akurat
  let cleanMessage = message;

  // 1. Ambil & hapus alamat pengiriman
  const address = extractShippingAddress(message);
  if (address) {
    cleanMessage = cleanMessage.replace(address, "");
  }

  // 2. Ambil kurir & pembayaran
  const courier = extractCourier(message);
  const payment = extractPayment(message);

  // Hapus kurir keywords dari cleanMessage
  for (const key of Object.keys(COURIER_MAP)) {
    cleanMessage = cleanMessage.replace(new RegExp(`\\b${key}\\b`, "gi"), "");
  }
  // Hapus payment keywords dari cleanMessage
  for (const key of Object.keys(PAYMENT_MAP)) {
    cleanMessage = cleanMessage.replace(new RegExp(`\\b${key}\\b`, "gi"), "");
  }

  // Hapus kata kerja/kata khusus checkout dari cleanMessage
  const checkoutVerbs = [
    "checkout", "check out", "chekout", "chekcout", "chekot", "checkut", "chekoutt",
    "cheout", "checout", "cekout", "ceckout", "chekaut", "chekoud", "chekouut", "chekoout",
    "cehckout", "chcekout", "chekotu", "chekuot", "checokut", "checkotu",
    "bayar", "pembayaran", "pesan", "pesanan", "order", "beli", "belikan", "beliin",
    "alamat", "kirim", "kirimkan", "dikirim", "pengiriman", "kurir", "pake", "pakai", "dengan", "dgn"
  ];
  let hasCheckoutKeywords = false;
  for (const verb of checkoutVerbs) {
    if (new RegExp(`\\b${verb}\\b`, "i").test(message)) {
      hasCheckoutKeywords = true;
    }
    cleanMessage = cleanMessage.replace(new RegExp(`\\b${verb}\\b`, "gi"), "");
  }

  // Ekstrak kata kunci dari pesan yang sudah bersih
  const keywords = extractKeywords(cleanMessage);
  const maxPrice = parseBudget(message);
  const sortPref = extractSortPreference(message);

  // Harus ada keyword produk yang bisa dicari
  if (!keywords || keywords.length === 0) return null;

  // Query produk dari database
  let products = await fetchRelevantProducts(keywords, maxPrice);

  if (!products || products.length === 0) {
    return {
      reply: `Maaf, saya tidak menemukan produk yang cocok dengan pencarian "${keywords.join(", ")}" di toko e-BuildPC. Coba gunakan kata kunci lain ya! 😊`,
      action: "none",
      productsFound: 0,
      products: [],
    };
  }

  // Sort primary by score (relevancy) descending, secondary by price preference
  if (sortPref === "cheapest") {
    products.sort((a, b) => (b.score - a.score) || (Number(a.price) - Number(b.price)));
  } else {
    products.sort((a, b) => (b.score - a.score) || (Number(b.price) - Number(a.price)));
  }

  // Ambil 1 produk terbaik untuk checkout
  const selectedProduct = products[0];

  const fmt = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  // Bangun pesan progress
  const sortLabel = sortPref === "cheapest" ? "termurah" : "termahal";
  let replyParts = [];
  replyParts.push(`Saya menemukan ${selectedProduct.product_name} seharga ${fmt(selectedProduct.price)} — produk ${sortLabel} yang cocok dengan pencarian Anda!`);

  if (address || courier || payment || hasCheckoutKeywords) {
    replyParts.push(`Saya akan menambahkan ke keranjang dan mengarahkan ke checkout`);
    const details = [];
    if (address) details.push(`📍 Alamat: ${address}`);
    if (courier) details.push(`🚚 Kurir: ${courier.toUpperCase()}`);
    if (payment) details.push(`💳 Pembayaran: ${payment.toUpperCase()}`);
    if (details.length > 0) {
      replyParts.push(`dengan detail:\n${details.join("\n")}`);
    } else {
      replyParts.push(".");
    }
  } else {
    replyParts.push("Saya akan mengarahkanmu ke katalog untuk melihat detail produk tersebut.");
  }

  // Format products untuk frontend
  const formattedProducts = products.map((p) => ({
    id: p.product_id,
    name: p.product_name,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    image: p.image_url || null,
    category: p.category_name,
  }));

  // Bangun checkoutData
  const checkoutData = {};
  if (address) checkoutData.address = address;
  if (courier) checkoutData.courier = courier;
  if (payment) checkoutData.payment = payment;

  const hasAddToCartIntent = /\b(tambah|tambahkan|masuk|masukkan|input)\b.*\b(keranjang|cart)\b/i.test(message);

  return {
    reply: replyParts.join(" "),
    action: (address || courier || payment || (hasCheckoutKeywords && !hasAddToCartIntent)) ? "agentic_checkout" : "agentic_search",
    products: formattedProducts,
    checkoutData: Object.keys(checkoutData).length > 0 ? checkoutData : null,
    productsFound: products.length,
    sortPref: sortPref,
  };
}

// ══════════════════════════════════════════════
// Helper: Panggil Ollama API dengan Streaming
// ══════════════════════════════════════════════
async function callOllamaStream(messages, res) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2";
  console.log(`Connecting to Ollama at ${baseUrl}/api/chat with model: "${model}"`);

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true, // ← STREAMING ON
      options: {
        temperature: 0.1,   // sangat rendah = lebih akurat, tidak mengarang
        top_p: 0.5,
        num_predict: 1000,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error (${response.status})`);
  }

  let fullText = "";
  const decoder = new TextDecoder();

  for await (const chunk of response.body) {
    const line = decoder.decode(chunk).trim();
    if (!line) continue;

    try {
      const parsed = JSON.parse(line);
      const token = parsed.message?.content || "";
      if (!token) continue; // Skip token kosong

      fullText += token;

      // Kirim token ke frontend via SSE dengan format yang benar
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
      // Paksa kirim ke browser setiap token (jangan di-buffer)
      if (res.flush) res.flush();
    } catch (_) {}
  }

  return fullText;
}

function cleanHistoryForOllama(history, limit = 6) {
  if (!history || !Array.isArray(history)) return [];
  
  const filtered = [];
  // Loop from last item to get the newest first
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const content = msg.text || msg.content || "";
    
    // Ignore autopilot status or system agentic messages
    if (
      content.includes("Mode Agentic AI") ||
      content.includes("Auto-Pilot") ||
      content.includes("Mengambil alih layar") ||
      content.includes("Mengarahkan ke") ||
      content.includes("berhasil ditambahkan") ||
      content.includes("Berikut merupakan") ||
      content.includes("Saya bisa membantu Anda memilih komponen PC") ||
      content.includes("virtual toko komponen PC") ||
      content.includes("Saya siap membantu Anda menemukan komponen PC") ||
      content.includes("Selamat datang di e-BuildPC")
    ) {
      continue;
    }
    
    filtered.unshift({
      role: msg.role === "user" ? "user" : "assistant",
      content: content,
    });
    
    if (filtered.length >= limit) break;
  }
  
  return filtered;
}

// ══════════════════════════════════════════════
// MAIN CONTROLLER: POST /api/chat-ai (Streaming SSE)
// ══════════════════════════════════════════════
export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Pesan tidak boleh kosong" });
    }

    const userMessage = message.trim();

    // ── LAPIS 0: Salam → balas langsung tanpa LLM ──
    const greetingReply = getGreetingReply(userMessage);
    if (greetingReply) {
      return res.status(200).json({
        reply: greetingReply,
        productsFound: 0,
        products: [],
      });
    }

    // ── LAPIS 0.7: Composite Agentic Intent (multi-step checkout) ──
    const agenticResult = await detectAgenticIntent(userMessage);
    if (agenticResult) {
      return res.status(200).json(agenticResult);
    }

    // ── LAPIS 0.5: Navigasi → arahkan user ke halaman tertentu tanpa LLM ──
    const navIntent = detectNavigationIntent(userMessage);
    if (navIntent) {
      return res.status(200).json({
        reply: navIntent.reply,
        action: navIntent.action || "navigate",
        url: navIntent.url,
        label: navIntent.label,
        productsFound: 0,
        products: [],
      });
    }

    // ── LAPIS 1: Input terlarang ──
    if (isBlockedInput(userMessage)) {
      return res.status(200).json({
        reply: REFUSAL_MESSAGE,
        productsFound: 0,
        products: [],
        blocked: true,
      });
    }

    // ── LAPIS 2: Deteksi query rakit PC ──
    const rakitPC = isRakitPCQuery(userMessage);
    const budget = parseBudget(userMessage);

    if (rakitPC && budget) {
      // ── PATH: PC BUILD RECOMMENDATION ──
      const buildParts = await fetchPCBuild(budget);
      const buildContext = formatBuildContext(buildParts, budget);

      const fmt = (n) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

      const hasOverBudgetParts = buildParts.some(p => p.overBudget);

      const buildPrompt = `Kamu adalah asisten toko komputer "e-BuildPC". Tugasmu adalah memberikan kesimpulan rekomendasi rakitan PC berdasarkan data produk.

User meminta rekomendasi rakitan PC dengan budget ${fmt(budget)}.
Berikut adalah rincian komponen yang bisa dan tidak bisa didapatkan dengan budget tersebut:

${buildContext}

ATURAN STRUKTUR JAWABAN (WAJIB DIIKUTI!):
1. Jawablah langsung ke intinya secara singkat (maksimal 3 kalimat). DILARANG menulis salam pembuka, perkenalan diri, basa-basi, atau kalimat pengantar (seperti "Saya sangat senang membantu", "Berikut adalah...", "Halo!", dll).
2. DILARANG KERAS menuliskan atau mendaftar ulang nama komponen, detail harga, stok, spesifikasi, subtotal, atau daftar poin komponen satu per satu di dalam teks balasan Anda (karena detail tersebut sudah tampil secara otomatis di layar pengguna). Cukup sebutkan kesimpulan total biaya rakitan.
3. DILARANG KERAS menyertakan alasan/deskripsi/saran untuk masing-masing komponen secara individual (seperti "Pilih CPU: ... adalah pilihan...", "Motherboard: ... adalah...", dll).
4. DILARANG KERAS menyertakan informasi pengiriman, cara checkout, cara membayar, form alamat (seperti "Nama Penerima:", "Alamat:", "Kurir JNE:", "metode pembayaran Qris", dll).
5. Jika budget CUKUP: Sebutkan bahwa budget cukup untuk semua komponen, sebutkan total biaya ringkas dan sisa budget.
6. Jika budget KURANG (ada komponen over-budget): Sebutkan bahwa budget belum cukup untuk rakitan lengkap, jelaskan secara ringkas bahwa GPU bisa dibeli belakangan, dan sebutkan sisa budget atau tambahan dana yang dibutuhkan untuk membeli GPU tersebut.`;

      const ollamaMessages = [
        { role: "system", content: buildPrompt }
      ];

      const cleanedHistory = cleanHistoryForOllama(history, 4);
      ollamaMessages.push(...cleanedHistory);

      ollamaMessages.push({
        role: "user",
        content: `Pertanyaan user: "${userMessage}"\nJawab sekarang:`,
      });

      // SET SSE HEADERS
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.flushHeaders();

      // Stream AI explanation
      await callOllamaStream(ollamaMessages, res);

      // Format build parts sebagai product cards untuk frontend (hanya yang masuk budget)
      const buildProductCards = buildParts
        .filter((p) => !p.overBudget)
        .map((p) => ({
        id: p.product_id,
        name: p.product_name,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        image: p.image_url || null,
        category: p.category_name,
        badge: p.overBudget ? `${p.slot_label} ⚠️` : p.slot_label,
        badgeColor: p.overBudget ? "red" : "blue",
        overBudget: p.overBudget || false,
      }));

      res.write(
        `data: ${JSON.stringify({
          type: "products",
          products: buildProductCards,
          productsFound: buildProductCards.length,
          isBuild: true,
          done: true,
        })}\n\n`
      );

      return res.end();
    }

    // ── PATH NORMAL: RAG keyword search ──
    const isProductQuery = isProductRelatedQuery(userMessage);

    if (!isProductQuery) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.flushHeaders();
      
      const tokens = REFUSAL_MESSAGE.split(" ");
      for (const t of tokens) {
        res.write(`data: ${JSON.stringify({ token: t + " " })}\n\n`);
        await new Promise(r => setTimeout(r, 30));
      }
      
      res.write(`data: ${JSON.stringify({
        type: "products",
        products: [],
        productsFound: 0,
        done: true,
      })}\n\n`);
      
      return res.end();
    }

    const keywords = extractKeywords(userMessage);
    const maxPrice = budget; // pakai budget yang sudah di-parse

    let relevantProducts = await fetchRelevantProducts(keywords, maxPrice);

    if (isProductQuery && relevantProducts.length === 0) {
      // Jangan gunakan broad catalog jika user mencari keyword spesifik (misal "laptop") tapi tidak ketemu.
      // Hanya gunakan broad catalog jika keyword kosong (misal user cuma nanya "budget 5 juta dapat apa").
      if (keywords.length === 0) {
        relevantProducts = await fetchBroadCatalog(maxPrice);
      }
    }

    if (isProductQuery && relevantProducts.length === 0) {
      const emptyMsg = "Maaf, saat ini kami tidak memiliki produk yang cocok dengan pencarian Anda di toko e-BuildPC. Ada komponen PC lain yang ingin Anda cari?";
      
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.flushHeaders();
      
      const tokens = emptyMsg.split(" ");
      for (const t of tokens) {
        res.write(`data: ${JSON.stringify({ token: t + " " })}\n\n`);
        await new Promise(r => setTimeout(r, 30));
      }
      
      res.write(`data: ${JSON.stringify({
        type: "products",
        products: [],
        productsFound: 0,
        done: true,
      })}\n\n`);
      
      return res.end();
    }

    const productContext = formatProductContext(relevantProducts);
    const budgetNote = maxPrice
      ? `\nPengguna meminta produk dengan harga MAKSIMAL Rp ${maxPrice.toLocaleString("id-ID")}.`
      : "";

    const systemPrompt = `${SYSTEM_PROMPT_BASE}${budgetNote}\n\nBerikut adalah DAFTAR PRODUK yang tersedia saat ini:\n${productContext}\n\nTUGASMU: Jawab HANYA menggunakan produk dari daftar di atas. DILARANG mengarang nama atau spesifikasi produk yang tidak ada di daftar.`;

    const ollamaMessages = [
      { role: "system", content: systemPrompt }
    ];

    const cleanedHistory = cleanHistoryForOllama(history, 6);
    ollamaMessages.push(...cleanedHistory);

    ollamaMessages.push({
      role: "user",
      content: `Pertanyaan Pengguna: "${userMessage}"\nBerikan jawabanmu sekarang:`,
    });

    // ── SET SSE HEADERS ──
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    // Format produk untuk frontend
    const formattedProducts = relevantProducts.map((p) => ({
      id: p.product_id,
      name: p.product_name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image_url || null,
      category: p.category_name,
      badge: p.category_name || "Produk",
      badgeColor: "blue",
    }));

    // ── STREAM AI RESPONSE ──
    let fullReply = await callOllamaStream(ollamaMessages, res);
    fullReply = sanitizeOutput(fullReply);

    // Cek apakah AI menolak (di luar topik)
    const isRefusal = fullReply.includes("Maaf, saya hanya bisa membantu seputar produk");

    // Urutkan produk dari termurah ke termahal
    const sortedProducts = isRefusal
      ? []
      : [...formattedProducts].sort((a, b) => a.price - b.price);

    // Kirim produk SETELAH stream AI selesai
    res.write(
      `data: ${JSON.stringify({
        type: "products",
        products: sortedProducts,
        productsFound: sortedProducts.length,
        done: true,
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("Chat AI Error:", error.message);

    const errorMsg =
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("fetch failed")
        ? "⚠️ Server Ollama tidak terdeteksi. Jalankan `ollama serve` di terminal."
        : "⚠️ Maaf, terjadi kesalahan pada server. Silakan coba lagi.";

    if (!res.headersSent) {
      return res.status(503).json({ reply: errorMsg });
    }

    res.write(`data: ${JSON.stringify({ token: errorMsg, done: true })}\n\n`);
    res.end();
  }
};
