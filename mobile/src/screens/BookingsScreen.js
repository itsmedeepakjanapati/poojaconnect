import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

const statusStyle = {
  pending:   { bg: '#FFF3EB', color: '#E8712A' },
  confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
  completed: { bg: '#E3F2FD', color: '#1565C0' },
};

export default function BookingsScreen() {
  // In production, fetch from Firestore using getUserBookings()
  const [bookings, setBookings] = useState([]);

  const handleCancel = (id) => {
    Alert.alert('Cancel Booking?', 'Cancellation email & push notification will be sent.', [
      { text: 'No' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => {
        setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'cancelled' } : bk));
        Alert.alert('Cancelled', 'Cancellation email + push + SMS sent.');
      }},
    ]);
  };

  if (bookings.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={{ fontSize: 40 }}>📅</Text>
        <Text style={s.emptyText}>No bookings yet</Text>
        <Text style={s.emptyHint}>Find a priest and book a pooja to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList data={bookings} keyExtractor={b => b.id} style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item: b }) => {
        const sc = statusStyle[b.status] || statusStyle.pending;
        return (
          <View style={s.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Text style={s.pooja}>{b.poojaType}</Text>
              <Text style={[s.status, { backgroundColor: sc.bg, color: sc.color }]}>{b.status.toUpperCase()}</Text>
            </View>
            <Text style={s.priest}>Priest: {b.priestName}</Text>
            <Text style={s.meta}>📅 {b.requestedDate}  📍 {b.address}</Text>
            {b.confirmedPrice && <Text style={s.price}>Confirmed: {b.confirmedPrice}</Text>}

            {b.status === 'confirmed' && (
              <View style={[s.alert, { backgroundColor: colors.saffronLight }]}>
                <Text style={{ fontSize: 11, color: colors.saffron, fontWeight: '600' }}>📧 Confirmation sent · 🔔 Push delivered</Text>
              </View>
            )}
            {b.status === 'cancelled' && (
              <View style={[s.alert, { backgroundColor: colors.redLight }]}>
                <Text style={{ fontSize: 11, color: colors.red, fontWeight: '600' }}>📧 Cancellation sent · 🔔 Push + SMS delivered</Text>
              </View>
            )}
            {b.suggestedItems?.length > 0 && b.status !== 'cancelled' && (
              <View style={s.itemsBox}>
                <Text style={{ fontSize: 11, fontWeight: '700', marginBottom: 4 }}>🛒 Suggested Items</Text>
                <View style={s.tags}>
                  {b.suggestedItems.map(it => <Text key={it} style={s.itemTag}>{it}</Text>)}
                </View>
              </View>
            )}
            {b.status === 'confirmed' && (
              <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(b.id)}>
                <Text style={s.cancelText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }} />
  );
}

const s = StyleSheet.create({
  empty: { flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.dark, marginTop: 10 },
  emptyHint: { fontSize: 13, color: colors.light, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  pooja: { fontSize: 15, fontWeight: '700', color: colors.dark },
  status: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  priest: { fontSize: 13, color: colors.mid, marginTop: 2 },
  meta: { fontSize: 11, color: colors.light, marginTop: 3 },
  price: { fontSize: 13, fontWeight: '700', color: colors.green, marginTop: 6 },
  alert: { borderRadius: 8, padding: 8, marginTop: 8 },
  itemsBox: { backgroundColor: colors.goldLight, borderRadius: 8, padding: 8, marginTop: 8, borderWidth: 1, borderColor: colors.gold },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  itemTag: { fontSize: 10, backgroundColor: colors.white, color: colors.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '600', overflow: 'hidden' },
  cancelBtn: { backgroundColor: colors.red, borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
