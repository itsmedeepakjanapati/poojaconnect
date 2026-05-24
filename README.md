# 🙏 PoojaConnect

**Hindu Religious Services Marketplace — Serving All of New England**

A Thumbtack-style platform specifically for Hindu devotees to find priests for poojas, homams, pitru karyams, and samskaras. Built with a unified codebase for **Web (React PWA)** and **Mobile (React Native / Expo)** sharing the same Firebase backend.

---

## 📁 Project Structure

```
poojaconnect/
├── shared/                    # Shared code between web & mobile
│   ├── config/firebase.js     # Firebase configuration
│   ├── types/index.js         # Constants, enums, pooja item maps
│   ├── data/seedData.js       # 12 priests + 5 vendors seed data
│   └── services/
│       ├── authService.js     # Login, register, profile management
│       ├── priestService.js   # Priest CRUD + admin approval
│       ├── vendorService.js   # Vendor CRUD + admin approval
│       ├── bookingService.js  # Booking lifecycle + notifications
│       ├── chatbotService.js  # Built-in chatbot NLP logic
│       └── notificationService.js  # FCM, email templates, SMS templates
│
├── web/                       # React web app (Vite + Tailwind)
│   ├── src/
│   │   ├── App.jsx            # Routes, auth provider, toast system
│   │   ├── firebase.js        # Web Firebase init
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PriestsPage.jsx      # Search, filter, booking
│   │   │   ├── PriestDetailPage.jsx  # Full profile + book
│   │   │   ├── VendorsPage.jsx
│   │   │   ├── BookingsPage.jsx      # User's bookings + cancel
│   │   │   ├── AdminPage.jsx         # Approve/reject + stats
│   │   │   └── NotificationsPage.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── BookingModal.jsx   # Booking form + item suggestions
│   │       ├── Chatbot.jsx        # Floating chatbot widget
│   │       └── Toast.jsx          # Push notification toasts
│   └── public/
│       ├── firebase-messaging-sw.js  # Background push handler
│       └── manifest.json             # PWA manifest
│
├── mobile/                    # React Native app (Expo)
│   ├── App.js                 # Entry point, auth state
│   ├── app.json               # Expo configuration
│   └── src/
│       ├── firebase.js        # Mobile Firebase init (AsyncStorage)
│       ├── navigation/
│       │   ├── AppNavigator.js    # Bottom tabs + stacks
│       │   └── AuthNavigator.js   # Login/Register stack
│       ├── screens/
│       │   ├── LoginScreen.js
│       │   ├── RegisterScreen.js
│       │   ├── HomeScreen.js
│       │   ├── PriestsScreen.js       # Search + list
│       │   ├── PriestDetailScreen.js  # Profile + inline booking
│       │   ├── VendorsScreen.js
│       │   ├── BookingsScreen.js
│       │   ├── NotificationsScreen.js
│       │   ├── AdminScreen.js
│       │   └── ChatbotScreen.js       # Full-screen chat
│       ├── hooks/
│       │   └── usePushNotifications.js  # Expo push setup
│       └── styles/theme.js
│
├── functions/                 # Firebase Cloud Functions (Node.js)
│   ├── index.js               # Firestore triggers for email/push/SMS
│   ├── seedData.js            # Server-side seed data
│   └── package.json
│
├── firebase.json              # Firebase project config
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Composite indexes
├── storage.rules              # Storage security rules
├── package.json               # Root scripts
└── scripts/setup.sh           # One-command setup
```

---

## ☁️ Architecture — Firebase (Most Cost-Optimized)

| Service | Technology | Cost |
|---------|-----------|------|
| **Authentication** | Firebase Auth (email, Google, phone) | Free (50K MAU) |
| **Database** | Cloud Firestore (NoSQL, real-time) | Free (1GB + 50K reads/day) |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | **Free (unlimited)** |
| **Email** | Cloud Functions + SendGrid | Free (100/day) |
| **SMS** | Cloud Functions + Twilio | $0.0079/msg |
| **Hosting** | Firebase Hosting + CDN | Free (10GB) |
| **Functions** | Cloud Functions (Node.js) | Free (2M/mo) |
| **Storage** | Firebase Storage | Free (5GB) |
| **Analytics** | Firebase Analytics | Free (unlimited) |
| **TOTAL** | | **~$0–25/month** |

### Why Firebase over AWS/Azure?

- FCM push notifications are **completely free** (AWS SNS charges per message)
- All services integrated in one SDK — no glue code
- Firestore has built-in real-time sync (no WebSocket setup)
- Simpler pricing, predictable costs for small-medium apps
- Single `firebase deploy` deploys everything

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Expo CLI: `npm install -g expo-cli`
- Firebase project at https://console.firebase.google.com

### 1. Setup

```bash
git clone <repo>
cd poojaconnect
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Firebase

1. Create a Firebase project in the console
2. Enable **Authentication** → Email/Password + Google
3. Create **Cloud Firestore** database
4. Enable **Cloud Messaging**
5. Copy config to `shared/config/firebase.js`

### 3. Configure Notifications

```bash
# SendGrid (free 100 emails/day)
firebase functions:config:set sendgrid.key="SG.your-key"

# Twilio SMS
firebase functions:config:set twilio.sid="ACxxx" twilio.token="xxx" twilio.from="+15550000"
```

### 4. Seed Database

```bash
firebase deploy --only functions
npm run seed
```

### 5. Run

```bash
# Web app (localhost:5173)
npm run web:dev

# Mobile app (Expo)
npm run mobile:start
```

### 6. Deploy

```bash
# Deploy everything
npm run deploy:all

# Or individually
npm run deploy:web
npm run deploy:functions
npm run deploy:rules
```

---

## 📱 Features

### For Devotees (Users)
- Browse 12+ verified priests across MA, CT, NH
- Filter by state, language, mother tongue, pooja type
- Book any pooja — request goes to the priest
- Auto-suggested pooja items with vendor recommendations
- Real-time booking status (pending → confirmed → completed)
- Email + Push + SMS notifications on confirm/cancel
- Built-in chatbot for questions about rituals

### For Priests
- Self-register with profile (admin approval required)
- Receive booking requests via push notification
- Confirm date and set price
- Manage bookings dashboard

### For Vendors (Flower Shops, Pooja Supplies)
- Self-register (admin approval required)
- Listed as suggested vendor when users book matching poojas

### For Admins
- Review and approve/reject priest & vendor registrations
- Monitor all bookings and platform stats
- Full dashboard with real-time data

### Built-in Chatbot
- Answers questions about pooja types, rituals, items needed
- Helps find priests by language, location, or service
- Pricing guidance
- Can be upgraded to Dialogflow CX for NLU

---

## 🔔 Notification Flow

```
User Books Pooja
    ↓
Cloud Function triggers → Push notification to Priest
    ↓
Priest Confirms (sets date + price)
    ↓
Cloud Function triggers:
  → Push notification to User (FCM — free)
  → Email to User (SendGrid — free tier)
  → SMS to User (Twilio — $0.0079)
    ↓
If Cancelled:
  → Same 3 channels fire cancellation alerts
```

---

## 🙏 Priest Database (Pre-loaded)

| State | Priests | Key Temples |
|-------|---------|------------|
| Massachusetts | 5 | NESSP Groton, Chinmaya Maruti, Sri Siddhi Vinayaka |
| Connecticut | 6 | CVHTS Middletown, Shirdi Sai Temple, Durga Mandir |
| New Hampshire | 1 | Hindu Temple of NH, Nashua |

Languages covered: Telugu, Tamil, Kannada, Hindi, Sanskrit, English, Gujarati

---

## 📄 License

Private project. All rights reserved.
