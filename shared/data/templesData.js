// ═══════════════════════════════════════════════════════════════
// shared/data/templesData.js
// Curated directory of Hindu temples across New England (MA, CT, NH, RI, VT, ME)
// Sources: Wikipedia "List of Hindu temples in the United States" + temple websites.
// Each temple may include an `events` array — upcoming rituals/poojas/festivals
// (sample data; in production this should be synced from each temple's calendar
// or maintained by temple admins).
// ═══════════════════════════════════════════════════════════════

export const TEMPLES = [
  // ───────────── MASSACHUSETTS ─────────────
  {
    id: 't-ma-srilakshmi', name: 'Sri Lakshmi Temple', city: 'Ashland', state: 'Massachusetts',
    address: '117 Waverly St, Ashland, MA 01721', deity: 'Lakshmi / Vishnu', tradition: 'South Indian',
    website: 'https://srilakshmi.org', phone: '(508) 881-5775',
    events: [
      { name: 'Sahasranama Archana', date: 'Every Friday', type: 'Pooja' },
      { name: 'Satyanarayana Vratam', date: 'Full Moon Days', type: 'Vratam' },
      { name: 'Lakshmi Kubera Homam', date: 'Monthly', type: 'Homam' },
    ],
  },
  {
    id: 't-ma-mahindutemple', name: 'Hindu Temple of Massachusetts (Sri Vishnu Durga Mandir)', city: 'Acton', state: 'Massachusetts',
    address: '129 Main St, Acton, MA 01720', deity: 'Vishnu / Durga', tradition: 'Multi-tradition',
    website: 'https://www.mahindutemple.org', phone: '(978) 263-1234',
    events: [
      { name: 'Abhishekam', date: 'Every Sunday', type: 'Pooja' },
      { name: 'Durga Homam', date: 'Navaratri', type: 'Homam' },
      { name: 'Hanuman Chalisa', date: 'Every Tuesday & Saturday', type: 'Bhajan' },
    ],
  },
  {
    id: 't-ma-nessp', name: 'New England Shirdi Sai Temple (NESSP)', city: 'Groton', state: 'Massachusetts',
    address: '101 Lowell Rd, Groton, MA 01450', deity: 'Shirdi Sai Baba', tradition: 'Sai tradition',
    website: 'https://www.nessp.org', phone: '(978) 276-9724',
    events: [
      { name: 'Sai Abhishekham', date: 'Every Thursday', type: 'Pooja' },
      { name: 'Chandi Homam', date: 'Quarterly', type: 'Homam' },
      { name: 'Guru Poornima', date: 'July', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-nest', name: 'New England Siva Temple (NEST)', city: 'Groton', state: 'Massachusetts',
    address: '101 Lowell Rd, Groton, MA 01450', deity: 'Shiva / Parvati', tradition: 'Shaiva',
    website: 'https://nesivatemple.org', phone: '(978) 276-9724',
    events: [
      { name: 'Rudrabhishekham', date: 'Every Monday', type: 'Pooja' },
      { name: 'Maha Shivaratri', date: 'February/March', type: 'Festival' },
      { name: 'Rudra Homam', date: 'Monthly', type: 'Homam' },
    ],
  },
  {
    id: 't-ma-chinmayamaruti', name: 'Sri Chinmaya Maruti Temple', city: 'Andover', state: 'Massachusetts',
    address: '1 Union St, Andover, MA 01810', deity: 'Hanuman / Ganesha', tradition: 'Multi-tradition',
    website: 'https://srichinmayamaruti.org', phone: '(978) 470-2661',
    events: [
      { name: 'Hanuman Chalisa', date: 'Every Saturday', type: 'Bhajan' },
      { name: 'Maha Ganapathy Homam', date: 'Monthly', type: 'Homam' },
      { name: 'Hanuman Jayanti', date: 'April', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-chinmayaboston', name: 'Chinmaya Mission Boston', city: 'Andover', state: 'Massachusetts',
    address: '1 Union St, Andover, MA 01810', deity: 'Vedanta Center', tradition: 'Advaita Vedanta',
    website: 'https://chinmaya-boston.org', phone: '(978) 470-2661',
    events: [
      { name: 'Bala Vihar (children)', date: 'Every Sunday', type: 'Class' },
      { name: 'Gita Study', date: 'Weekly', type: 'Class' },
      { name: 'Gurudev Jayanti', date: 'May', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-baps-boston', name: 'BAPS Shri Swaminarayan Mandir (Boston)', city: 'Lowell', state: 'Massachusetts',
    address: '187 Princeton Blvd, Lowell, MA 01851', deity: 'Swaminarayan', tradition: 'Swaminarayan',
    website: 'https://www.baps.org/Global-Network/North-America/Boston.aspx', phone: '(978) 970-3300',
    events: [
      { name: 'Mangala Aarti', date: 'Daily 7:30am', type: 'Aarti' },
      { name: 'Annakut', date: 'November', type: 'Festival' },
      { name: 'Janmashtami', date: 'August', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-baps-westborough', name: 'BAPS Shri Swaminarayan Mandir (Westborough)', city: 'Westborough', state: 'Massachusetts',
    address: '2 Friberg Pkwy, Westborough, MA 01581', deity: 'Swaminarayan', tradition: 'Swaminarayan',
    website: 'https://www.baps.org/Global-Network/North-America/Westborough.aspx', phone: '(508) 366-4500',
    events: [
      { name: 'Sunday Sabha', date: 'Every Sunday', type: 'Assembly' },
      { name: 'Diwali Celebration', date: 'October/November', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-shivalaya', name: 'Shivalaya Temple of Greater Boston', city: 'Medford', state: 'Massachusetts',
    address: '15 Locust St, Medford, MA 02155', deity: 'Shiva', tradition: 'Shaiva',
    website: 'https://www.shivalayaboston.com', phone: '(781) 396-7700',
    events: [
      { name: 'Rudrabhishekham', date: 'Every Monday', type: 'Pooja' },
      { name: 'Maha Shivaratri', date: 'February/March', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-kalikambal', name: 'Boston Sri Kalikambal Shiva Temple', city: 'Bellingham', state: 'Massachusetts',
    address: '74 Hartford Ave, Bellingham, MA 02019', deity: 'Kalikambal / Shiva', tradition: 'South Indian Shaiva',
    website: 'http://www.bskst.org', phone: '(508) 966-1100',
    events: [
      { name: 'Friday Lalitha Sahasranama', date: 'Every Friday', type: 'Pooja' },
      { name: 'Navaratri Golu', date: 'October', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-ramakrishna', name: 'Ramakrishna Vedanta Society', city: 'Boston', state: 'Massachusetts',
    address: '58 Deerfield St, Boston, MA 02215', deity: 'Sri Ramakrishna', tradition: 'Vedanta',
    website: 'https://vedantasociety.net', phone: '(617) 536-5320',
    events: [
      { name: 'Sunday Lecture', date: 'Every Sunday 11am', type: 'Lecture' },
      { name: 'Durga Pooja', date: 'October', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-haridham', name: 'Shree Haridham Temple', city: 'Norwood', state: 'Massachusetts',
    address: '855 Universal Dr, Norwood, MA 02062', deity: 'Krishna / Radha', tradition: 'Vaishnava',
    website: 'https://www.shreeharidham.org', phone: '(781) 769-9000',
    events: [
      { name: 'Sunday Satsang', date: 'Every Sunday', type: 'Assembly' },
      { name: 'Janmashtami', date: 'August', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-sarvadev', name: 'Sarva Dev Mandir', city: 'Oxford', state: 'Massachusetts',
    address: '6 Coppage Dr, Oxford, MA 01540', deity: 'Multi-deity', tradition: 'North Indian',
    website: 'https://www.sarvadevmandir.org', phone: '(508) 987-1234',
    events: [
      { name: 'Sunday Aarti', date: 'Every Sunday', type: 'Aarti' },
      { name: 'Holi', date: 'March', type: 'Festival' },
      { name: 'Navaratri', date: 'October', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-shirdisai-northborough', name: 'Sri Shirdi Sai Baba Temple', city: 'Northborough', state: 'Massachusetts',
    address: '500 W Main St, Northborough, MA 01532', deity: 'Shirdi Sai Baba', tradition: 'Sai tradition',
    website: 'https://shirdisaiboston.org', phone: '(508) 251-9100',
    events: [
      { name: 'Sai Abhishekam', date: 'Every Thursday', type: 'Pooja' },
      { name: 'Guru Poornima', date: 'July', type: 'Festival' },
    ],
  },
  {
    id: 't-ma-umiyadham', name: 'Shree Umiya Dham', city: 'Foxborough', state: 'Massachusetts',
    address: '40 Mechanic St, Foxborough, MA 02035', deity: 'Maa Umiya', tradition: 'Gujarati',
    website: 'http://sanskarusa.org', phone: '(508) 543-0200',
    events: [
      { name: 'Aarti', date: 'Daily', type: 'Aarti' },
      { name: 'Navaratri Garba', date: 'October', type: 'Festival' },
    ],
  },

  // ───────────── CONNECTICUT ─────────────
  {
    id: 't-ct-cvhts', name: 'Connecticut Valley Hindu Temple Society (CVHTS)', city: 'Middletown', state: 'Connecticut',
    address: '111 Long Hill Rd, Middletown, CT 06457', deity: 'Multi-deity', tradition: 'Multi-tradition',
    website: 'https://www.cvhts.org', phone: '(860) 346-8675',
    events: [
      { name: 'Daily Pooja', date: 'Every day', type: 'Pooja' },
      { name: 'Satyanarayana Vratam', date: 'Full Moon Days', type: 'Vratam' },
      { name: 'Navagraha Homam', date: 'Monthly', type: 'Homam' },
      { name: 'Diwali', date: 'October/November', type: 'Festival' },
    ],
  },
  {
    id: 't-ct-shirdisai', name: 'Shri Shirdi Sai Temple of Connecticut', city: 'Middletown', state: 'Connecticut',
    address: '1010 Newfield St, Middletown, CT 06457', deity: 'Shirdi Sai Baba', tradition: 'Sai tradition',
    website: 'https://shirdisaict.org', phone: '(860) 740-1212',
    events: [
      { name: 'Sai Abhishekam', date: 'Every Thursday', type: 'Pooja' },
      { name: 'Ram Navami', date: 'April', type: 'Festival' },
    ],
  },
  {
    id: 't-ct-hccc', name: 'Hindu Cultural Center of Connecticut', city: 'Middletown', state: 'Connecticut',
    address: '1 Industrial Park Rd, Middletown, CT 06457', deity: 'Multi-deity', tradition: 'Multi-tradition',
    website: 'https://hccc-ct.org', phone: '(860) 358-9100',
    events: [
      { name: 'Sunday Bhajans', date: 'Every Sunday', type: 'Bhajan' },
      { name: 'Holi', date: 'March', type: 'Festival' },
    ],
  },
  {
    id: 't-ct-baps-norwalk', name: 'BAPS Shri Swaminarayan Mandir (Norwalk)', city: 'Norwalk', state: 'Connecticut',
    address: '81 Fairfield Ave, Norwalk, CT 06854', deity: 'Swaminarayan', tradition: 'Swaminarayan',
    website: 'https://www.baps.org/Global-Network/North-America/Stamford.aspx', phone: '(203) 866-4747',
    events: [
      { name: 'Mangala Aarti', date: 'Daily', type: 'Aarti' },
      { name: 'Diwali Annakut', date: 'November', type: 'Festival' },
    ],
  },
  {
    id: 't-ct-satyanarayan', name: 'Satyanarayan Mandir', city: 'Stratford', state: 'Connecticut',
    address: '50 Avon St, Stratford, CT 06615', deity: 'Vishnu / Satyanarayan', tradition: 'Vaishnava',
    website: '', phone: '(203) 380-1234',
    events: [
      { name: 'Satyanarayan Katha', date: 'Full Moon Days', type: 'Pooja' },
    ],
  },

  // ───────────── NEW HAMPSHIRE ─────────────
  {
    id: 't-nh-hindutemplenh', name: 'Hindu Temple of New Hampshire', city: 'Nashua', state: 'New Hampshire',
    address: '14B Cote Ave, Goffstown, NH 03045', deity: 'Multi-deity', tradition: 'Multi-tradition',
    website: 'https://www.hindutempleofnh.org', phone: '(603) 935-9474',
    events: [
      { name: 'Daily Pooja', date: 'Every day', type: 'Pooja' },
      { name: 'Satyanarayana Vratam', date: 'Full Moon Days', type: 'Vratam' },
      { name: 'Navaratri', date: 'October', type: 'Festival' },
      { name: 'Maha Shivaratri', date: 'February/March', type: 'Festival' },
    ],
  },
  {
    id: 't-nh-mananchira', name: 'Shree Krishna Sanatana Dharma Mandir', city: 'Manchester', state: 'New Hampshire',
    address: '380 Webster St, Manchester, NH 03104', deity: 'Krishna', tradition: 'Vaishnava',
    website: '', phone: '(603) 627-9999',
    events: [
      { name: 'Sunday Satsang', date: 'Every Sunday', type: 'Assembly' },
      { name: 'Janmashtami', date: 'August', type: 'Festival' },
    ],
  },

  // ───────────── RHODE ISLAND ─────────────
  {
    id: 't-ri-vidya', name: 'Vidya Mandir of Rhode Island', city: 'East Greenwich', state: 'Rhode Island',
    address: '5800 Post Rd, East Greenwich, RI 02818', deity: 'Multi-deity', tradition: 'Multi-tradition',
    website: 'https://vidyamandirri.org', phone: '(401) 884-1115',
    events: [
      { name: 'Sunday Aarti', date: 'Every Sunday', type: 'Aarti' },
      { name: 'Ganesh Chaturthi', date: 'September', type: 'Festival' },
      { name: 'Navaratri', date: 'October', type: 'Festival' },
    ],
  },
  {
    id: 't-ri-ricc', name: 'Rhode Island India Association & Cultural Center', city: 'Providence', state: 'Rhode Island',
    address: '720 Reservoir Ave, Cranston, RI 02910', deity: 'Cultural / Multi-deity', tradition: 'Multi-tradition',
    website: 'https://www.riindiaassociation.org', phone: '(401) 942-8888',
    events: [
      { name: 'Diwali Mela', date: 'October/November', type: 'Festival' },
      { name: 'Holi', date: 'March', type: 'Festival' },
    ],
  },

  // ───────────── VERMONT ─────────────
  {
    id: 't-vt-vthindu', name: 'Vermont Hindu Temple & Cultural Center', city: 'South Burlington', state: 'Vermont',
    address: '102 Allen Rd, South Burlington, VT 05403', deity: 'Multi-deity', tradition: 'Multi-tradition',
    website: '', phone: '(802) 658-1234',
    events: [
      { name: 'Sunday Pooja', date: 'Every Sunday', type: 'Pooja' },
      { name: 'Diwali', date: 'October/November', type: 'Festival' },
    ],
  },

  // ───────────── MAINE ─────────────
  {
    id: 't-me-maineindia', name: 'Maine India Association (Hindu Cultural Center)', city: 'Portland', state: 'Maine',
    address: '1 Mussey St, South Portland, ME 04106', deity: 'Cultural / Multi-deity', tradition: 'Multi-tradition',
    website: 'https://maineindia.org', phone: '(207) 939-4567',
    events: [
      { name: 'Monthly Satsang', date: '1st Sunday of each month', type: 'Assembly' },
      { name: 'Diwali', date: 'October/November', type: 'Festival' },
      { name: 'Holi', date: 'March', type: 'Festival' },
    ],
  },
];

// Helpers
export const TEMPLE_TRADITIONS = [
  'Multi-tradition', 'South Indian', 'Shaiva', 'Vaishnava',
  'Vedanta', 'Sai tradition', 'Swaminarayan', 'Gujarati',
  'North Indian', 'Advaita Vedanta', 'South Indian Shaiva',
];

export const EVENT_TYPES = ['Pooja', 'Homam', 'Vratam', 'Aarti', 'Bhajan', 'Festival', 'Assembly', 'Class', 'Lecture'];
