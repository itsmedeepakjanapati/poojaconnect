import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

const prefs = [
  { key: 'bookingConfirm', label: 'Booking Confirmations', desc: 'When a priest confirms your booking', def: true },
  { key: 'bookingCancel', label: 'Booking Cancellations', desc: 'When a booking is cancelled', def: true },
  { key: 'email', label: 'Email Notifications', desc: 'Booking details via email', def: true },
  { key: 'sms', label: 'SMS Notifications', desc: 'Text alerts for important updates', def: true },
  { key: 'push', label: 'Push Notifications', desc: 'Real-time mobile push alerts', def: true },
  { key: 'promo', label: 'Promotional Updates', desc: 'Festival specials & new listings', def: false },
];

export default function NotificationsScreen() {
  const [settings, setSettings] = useState(Object.fromEntries(prefs.map(p => [p.key, p.def])));
  const toggle = (k) => setSettings(s => ({ ...s, [k]: !s[k] }));

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      <View style={s.card}>
        <Text style={s.heading}>🔔 Notification Preferences</Text>
        {prefs.map(p => (
          <View key={p.key} style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{p.label}</Text>
              <Text style={s.desc}>{p.desc}</Text>
            </View>
            <Switch value={settings[p.key]} onValueChange={() => toggle(p.key)}
              trackColor={{ true: colors.green, false: '#D1D5DB' }} thumbColor="#fff" />
          </View>
        ))}
      </View>

      <View style={s.infoBox}>
        <Text style={s.infoTitle}>📱 Push Notification Architecture</Text>
        <Text style={s.infoText}>
          Firebase Cloud Messaging (FCM) powers all push notifications — completely free with unlimited messages.
          Email via SendGrid, SMS via Twilio. Triggered by Cloud Functions on booking events.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  card: { backgroundColor: colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
  heading: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { fontSize: 14, fontWeight: '600', color: colors.dark },
  desc: { fontSize: 11, color: colors.light, marginTop: 1 },
  infoBox: { marginTop: 16, backgroundColor: colors.blueLight, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.blue },
  infoTitle: { fontSize: 14, fontWeight: '700', color: colors.blue, marginBottom: 6 },
  infoText: { fontSize: 12, color: colors.mid, lineHeight: 18 },
});
