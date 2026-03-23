import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';

export default function AdminScreen() {
  const [pending, setPending] = useState([]);

  const approve = (item) => {
    setPending(p => p.filter(x => x.id !== item.id));
    Alert.alert('Approved ✅', `${item.name} is now live on the platform.`);
  };
  const reject = (item) => {
    setPending(p => p.filter(x => x.id !== item.id));
    Alert.alert('Rejected', `${item.name} has been rejected.`);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { icon: '🙏', num: PRIESTS_SEED.length, label: 'Priests', c: colors.saffron },
          { icon: '🏪', num: VENDORS_SEED.length, label: 'Vendors', c: colors.gold },
          { icon: '⏳', num: pending.length, label: 'Pending', c: colors.blue },
        ].map(st => (
          <View key={st.label} style={s.statCard}>
            <Text style={{ fontSize: 20 }}>{st.icon}</Text>
            <Text style={[s.statNum, { color: st.c }]}>{st.num}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      <Text style={s.heading}>Pending Approvals</Text>
      {pending.length === 0 ? (
        <View style={s.emptyCard}><Text style={s.emptyText}>No pending approvals.</Text></View>
      ) : (
        pending.map(item => (
          <View key={item.id} style={s.pendingCard}>
            <Text style={s.pendingType}>{item._type?.toUpperCase()}</Text>
            <Text style={s.pendingName}>{item.name}</Text>
            <Text style={s.pendingMeta}>{item.location} · {item.phone}</Text>
            <View style={s.actions}>
              <TouchableOpacity style={s.approveBtn} onPress={() => approve(item)}>
                <Text style={s.actionText}>✓ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.rejectBtn} onPress={() => reject(item)}>
                <Text style={s.actionText}>✕ Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNum: { fontSize: 22, fontWeight: '700', marginTop: 2 },
  statLabel: { fontSize: 11, color: colors.light },
  heading: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 10 },
  emptyCard: { backgroundColor: colors.white, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyText: { color: colors.light },
  pendingCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: colors.saffron, marginBottom: 10 },
  pendingType: { fontSize: 10, fontWeight: '700', color: colors.saffron, backgroundColor: colors.saffronLight, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  pendingName: { fontSize: 15, fontWeight: '700', color: colors.dark, marginTop: 4 },
  pendingMeta: { fontSize: 11, color: colors.light, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  approveBtn: { flex: 1, backgroundColor: colors.green, borderRadius: 8, padding: 8, alignItems: 'center' },
  rejectBtn: { flex: 1, backgroundColor: colors.red, borderRadius: 8, padding: 8, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
