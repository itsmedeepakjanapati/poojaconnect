#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# PoojaConnect — Setup Script
# Run: chmod +x scripts/setup.sh && ./scripts/setup.sh
# ═══════════════════════════════════════════════════════════════
set -e

echo "🙏 PoojaConnect Setup"
echo "═══════════════════════"

# 1. Install web dependencies
echo "📦 Installing web dependencies..."
cd web && npm install && cd ..

# 2. Install mobile dependencies
echo "📦 Installing mobile dependencies..."
cd mobile && npm install && cd ..

# 3. Install functions dependencies
echo "📦 Installing Cloud Functions dependencies..."
cd functions && npm install && cd ..

# 4. Firebase setup check
echo ""
echo "✅ Dependencies installed!"
echo ""
echo "═══════════════════════════════════════════"
echo "NEXT STEPS:"
echo "═══════════════════════════════════════════"
echo ""
echo "1. Create Firebase project at https://console.firebase.google.com"
echo "2. Enable Authentication (Email/Password + Google)"
echo "3. Create Firestore database"
echo "4. Enable Cloud Messaging"
echo "5. Copy your Firebase config to shared/config/firebase.js"
echo "6. Run: firebase login && firebase init"
echo "7. Configure SendGrid: firebase functions:config:set sendgrid.key='SG.xxx'"
echo "8. Configure Twilio: firebase functions:config:set twilio.sid='ACxxx' twilio.token='xxx' twilio.from='+1555000'"
echo "9. Seed data: npm run seed"
echo "10. Start web: npm run web:dev"
echo "11. Start mobile: npm run mobile:start"
echo ""
echo "🙏 Setup complete!"
