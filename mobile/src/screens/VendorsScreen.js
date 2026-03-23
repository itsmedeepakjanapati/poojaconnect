import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { VENDORS_SEED } from '../../../shared/data/seedData';

export default function VendorsScreen() {
  const vendors = VENDORS_SEED.filter(v => v.status === 'approved');
  return (
    <FlatList data={vendors} keyExtractor={v => v.id} style={s.list}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item: v }) => (
        <View style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <View style={s.icon}><Text style={{ fontSize: 20 }}>🏪</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{v.name}</Text>
              <Text style={s.type}>{v.type}</Text>
            </View>
            {v.verified && <Text style={s.check}>✓</Text>}
          </View>
          <Text style={s.meta}>📍 {v.location}  ⭐ {v.rating}</Text>
          <View style={s.tags}>
            {v.items.slice(0, 5).map(it => <Text key={it} style={s.tag}>{it}</Text>)}
            {v.items.length > 5 && <Text style={[s.tag, { backgroundColor: '#F3F4F6', color: '#9CA3AF' }]}>+{v.items.length - 5}</Text>}
          </View>
          <Text style={s.phone}>📞 {v.phone}</Text>
        </View>
      )} />
  );
}
const s = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.cream },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.goldLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.dark },
  type: { fontSize: 11, color: colors.light },
  check: { fontSize: 11, fontWeight: '700', color: colors.green, backgroundColor: colors.greenLight, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, overflow: 'hidden' },
  meta: { fontSize: 11, color: colors.light, marginBottom: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tag: { fontSize: 10, backgroundColor: colors.goldLight, color: colors.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '600', overflow: 'hidden' },
  phone: { fontSize: 12, color: colors.mid },
});
