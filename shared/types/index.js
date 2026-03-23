// ═══════════════════════════════════════════════════════════════
// shared/types/index.js
// Shared type definitions & constants for web + mobile
// ═══════════════════════════════════════════════════════════════

export const USER_ROLES = {
  USER: 'user',
  PRIEST: 'priest',
  VENDOR: 'vendor',
  ADMIN: 'admin',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

export const STATES = [
  { value: 'Massachusetts', label: 'Massachusetts' },
  { value: 'Connecticut', label: 'Connecticut' },
  { value: 'New Hampshire', label: 'New Hampshire' },
];

export const LANGUAGES = [
  'Telugu', 'Tamil', 'Kannada', 'Hindi', 'Sanskrit',
  'English', 'Gujarati', 'Malayalam', 'Marathi', 'Bengali',
];

export const POOJA_CATEGORIES = [
  {
    name: 'Homam / Havan',
    icon: '🔥',
    emoji: 'fire',
    types: [
      'Ganapathi Homam', 'Navagraha Homam', 'Chandi Homam',
      'Vastu Homam', 'Rudra Homam', 'Sudharshana Homam',
      'Gayathri Homam', 'Mruthyunjaya Homam', 'Maha Ganapathy Homam',
    ],
  },
  {
    name: 'Pooja / Vratam',
    icon: '🙏',
    emoji: 'pray',
    types: [
      'Satyanarayana Vratam', 'Lakshmi Pooja', 'Durga Pooja',
      'Ganapathi Pooja', 'Archana', 'Abhishekham',
      'Rudrabhishekham', 'Shiv Pooja', 'Kalasarpa Shanti',
    ],
  },
  {
    name: 'Pitru Karyam',
    icon: '🙏',
    emoji: 'pray',
    types: ['Pitru Karyam', 'Pitru Tarpana', 'Shraddha', 'Shanti Pooja'],
  },
  {
    name: 'Samskaras',
    icon: '✨',
    emoji: 'sparkles',
    types: [
      'Namakaranam', 'Annaprasana', 'Mundan',
      'Upanayanam', 'Wedding Ceremony', 'Shastipoorthi',
    ],
  },
  {
    name: 'Griha',
    icon: '🏠',
    emoji: 'house',
    types: ['Grihapravesham', 'Vaastu Puja', 'Car Pooja'],
  },
];

// Maps pooja type to required items for vendor suggestions
export const POOJA_ITEMS_MAP = {
  'Ganapathi Homam': ['Modak/Laddoo', 'Durva Grass', 'Red Flowers', 'Coconut', 'Havan Samagri', 'Ghee', 'Camphor', 'Kumkum', 'Turmeric'],
  'Navagraha Homam': ['Nine Types of Grains', 'Nine Colors Cloth', 'Havan Samagri', 'Ghee', 'Sesame Seeds', 'Flowers', 'Fruits'],
  'Satyanarayana Vratam': ['Banana Leaves', 'Fruits', 'Flowers', 'Poha/Flattened Rice', 'Sugar', 'Ghee', 'Coconuts', 'Betel Leaves', 'Turmeric'],
  'Rudrabhishekham': ['Milk', 'Curd', 'Honey', 'Ghee', 'Sugar', 'Bilva Leaves', 'Vibhuti', 'Flowers', 'Coconut'],
  'Grihapravesham': ['Milk', 'Rice', 'Coconut', 'Mango Leaves', 'Turmeric', 'Kumkum', 'Flowers', 'New Cloth', 'Havan Samagri'],
  'Wedding Ceremony': ['Mangalsutra', 'Flower Garlands', 'Rice', 'Coconut', 'Turmeric', 'Kumkum', 'Havan Samagri', 'Ghee', 'New Clothes'],
  'Pitru Karyam': ['Black Sesame Seeds', 'Rice', 'Darbha Grass', 'Milk', 'Ghee', 'Honey', 'Water Pot', 'Flowers', 'Sacred Thread'],
  'Pitru Tarpana': ['Black Sesame Seeds', 'Barley', 'Water', 'Darbha Grass', 'White Flowers', 'Rice'],
  'Shraddha': ['Rice', 'Black Sesame Seeds', 'Ghee', 'Darbha Grass', 'Silver Coin', 'New Cloth', 'Fruits', 'Flowers'],
  'Lakshmi Pooja': ['Lotus Flowers', 'Coins', 'Turmeric', 'Kumkum', 'Rice', 'Ghee', 'Camphor', 'Fruits', 'Sweets'],
  'Chandi Homam': ['Red Flowers', 'Kumkum', 'Havan Samagri', 'Ghee', 'Honey', 'Coconut', 'Fruits', 'Camphor'],
  'Vastu Homam': ['Havan Samagri', 'Ghee', 'Nine Grains', 'Coconut', 'Flowers', 'Camphor', 'Turmeric'],
  default: ['Flowers', 'Coconut', 'Fruits', 'Camphor', 'Incense', 'Kumkum', 'Turmeric', 'Ghee', 'Betel Leaves'],
};

export function getItemsForPooja(poojaType) {
  return POOJA_ITEMS_MAP[poojaType] || POOJA_ITEMS_MAP.default;
}
