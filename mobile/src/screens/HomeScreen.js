// mobile/src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { POOJA_CATEGORIES } from '../../../shared/types';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>Namaste! 🙏</Text>
        <Text style={s.heroSub}>Find trusted Hindu priests for poojas, homams, pitru karyams & more across all of New England — MA, CT, NH, RI, VT & ME.</Text>
        <View style={s.heroButtons}>
          <TouchableOpacity style={s.heroBtnPrimary} onPress={() => navigation.navigate('Priests')}>
            <Text style={s.heroBtnPrimaryText}>Find a Priest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.heroBtnSecondary} onPress={() => navigation.navigate('Vendors')}>
            <Text style={s.heroBtnSecondaryText}>Vendors</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <Text style={s.sectionTitle}>Browse by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
        {POOJA_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.name} style={s.catCard} onPress={() => navigation.navigate('Priests')}>
            <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
            <Text style={s.catName}>{cat.name}</Text>
            <Text style={s.catCount}>{cat.types.length} services</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats */}
      <Text style={s.sectionTitle}>Platform Stats</Text>
      <View style={s.statsRow}>
        {[
          { icon: '🙏', num: '12+', label: 'Priests' },
          { icon: '🏪', num: '5+', label: 'Vendors' },
          { icon: '📍', num: '3', label: 'States' },
          { icon: '🔥', num: '40+', label: 'Services' },
        ].map(st => (
          <View key={st.label} style={s.statCard}>
            <Text style={{ fontSize: 22 }}>{st.icon}</Text>
            <Text style={s.statNum}>{st.num}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      {/* Chatbot CTA */}
      <TouchableOpacity style={s.chatCta} onPress={() => navigation.navigate('Chatbot')}>
        <Text style={{ fontSize: 24 }}>💬</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.chatTitle}>Need help? Ask our chatbot</Text>
          <Text style={s.chatSub}>Questions about poojas, priests, pricing & more</Text>
        </View>
        <Text style={{ fontSize: 20, color: colors.saffron }}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  hero: { margin: 16, borderRadius: 16, padding: 24, overflow: 'hidden', backgroundColor: colors.saffron },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20, marginBottom: 16 },
  heroButtons: { flexDirection: 'row', gap: 10 },
  heroBtnPrimary: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  heroBtnPrimaryText: { color: colors.saffronDark, fontWeight: '700', fontSize: 13 },
  heroBtnSecondary: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  heroBtnSecondaryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.dark, marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  catCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14, alignItems: 'center', width: 120, borderWidth: 1, borderColor: colors.border },
  catName: { fontSize: 12, fontWeight: '700', color: colors.dark, marginTop: 4, textAlign: 'center' },
  catCount: { fontSize: 11, color: colors.light },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNum: { fontSize: 18, fontWeight: '700', color: colors.saffron, marginTop: 2 },
  statLabel: { fontSize: 11, color: colors.light },
  chatCta: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 16, backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.saffron },
  chatTitle: { fontSize: 14, fontWeight: '700', color: colors.dark },
  chatSub: { fontSize: 11, color: colors.light, marginTop: 2 },
});
