// mobile/src/screens/PriestDetailScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, Linking } from 'react-native';
import { colors } from '../styles/theme';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { getItemsForPooja } from '../../../shared/types';

function openWhatsApp(number, priestName) {
  const clean = number.replace(/\D/g, '');
  const msg = encodeURIComponent(`Namaste ${priestName} ji 🙏, I found you on Samskara and would like to enquire about your pooja services.`);
  const url = `whatsapp://send?phone=${clean}&text=${msg}`;
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      // Fall back to web WhatsApp
      Linking.openURL(`https://wa.me/${clean}?text=${msg}`);
    }
  });
}

export default function PriestDetailScreen({ route }) {
  const { priestId } = route.params;
  const priest = PRIESTS_SEED.find(p => p.id === priestId);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({ poojaType: '', date: '', address: '', notes: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!priest) return <View style={s.container}><Text>Priest not found</Text></View>;

  const items = form.poojaType ? getItemsForPooja(form.poojaType) : [];

  const handleBook = () => {
    if (!form.poojaType || !form.date || !form.address) {
      Alert.alert('Missing Info', 'Please fill pooja type, date, and address.');
      return;
    }
    Alert.alert('Request Sent! 🙏', `Your ${form.poojaType} request has been sent to ${priest.name}. You'll get a push notification when they respond.`);
    setBooking(false);
    setForm({ poojaType: '', date: '', address: '', notes: '' });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.avatar}><Text style={{ fontSize: 40 }}>🙏</Text></View>
        <Text style={s.name}>{priest.name}</Text>
        <Text style={s.temple}>{priest.temple}</Text>
        <Text style={s.meta}>📍 {priest.location}  ⭐ {priest.rating} ({priest.reviews})  {priest.experience} yrs</Text>
        {/* WhatsApp CTA in header */}
        {priest.whatsappNumber && (
          <TouchableOpacity style={s.waBtn} onPress={() => openWhatsApp(priest.whatsappNumber, priest.name)}>
            <Text style={s.waBtnText}>💬 Chat on WhatsApp</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contact */}
      <View style={s.section}>
        <Text style={s.secTitle}>Contact</Text>
        <Text style={s.secText}>📞 {priest.phone}</Text>
        <Text style={s.secText}>✉️ {priest.email}</Text>
        {priest.whatsappNumber && (
          <TouchableOpacity onPress={() => openWhatsApp(priest.whatsappNumber, priest.name)}
            style={[s.waInline]}>
            <Text style={s.waInlineText}>
              <Text style={{fontSize:15}}>💬 </Text>WhatsApp: {priest.whatsappNumber}  →  Tap to open WhatsApp
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Mother Tongue</Text>
        <Text style={[s.badge, { backgroundColor: colors.saffronLight, color: colors.saffron }]}>{priest.motherTongue}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Languages</Text>
        <View style={s.tagRow}>{priest.languages.map(l => <Text key={l} style={[s.badge, { backgroundColor: colors.blueLight, color: colors.blue }]}>{l}</Text>)}</View>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Poojas & Services ({priest.poojas.length})</Text>
        <View style={s.tagRow}>{priest.poojas.map(p => <Text key={p} style={[s.badge, { backgroundColor: colors.saffronLight, color: colors.saffron }]}>{p}</Text>)}</View>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Price Range</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.saffron }}>{priest.priceRange}</Text>
      </View>

      {!booking ? (
        <View style={{flexDirection:'row',gap:10,marginHorizontal:16,marginTop:20}}>
          <TouchableOpacity style={[s.bookBtn,{flex:1}]} onPress={() => setBooking(true)}>
            <Text style={s.bookBtnText}>Book This Priest</Text>
          </TouchableOpacity>
          {priest.whatsappNumber && (
            <TouchableOpacity style={s.waBookBtn} onPress={() => openWhatsApp(priest.whatsappNumber, priest.name)}>
              <Text style={{fontSize:22}}>💬</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={s.bookingForm}>
          <Text style={s.secTitle}>Book {priest.name}</Text>

          <Text style={s.label}>Pooja Type *</Text>
          <View style={s.tagRow}>
            {priest.poojas.map(p => (
              <TouchableOpacity key={p} onPress={() => u('poojaType', p)}
                style={[s.badge, { backgroundColor: form.poojaType === p ? colors.saffron : colors.saffronLight }]}>
                <Text style={{ color: form.poojaType === p ? '#fff' : colors.saffron, fontSize: 12, fontWeight: '600' }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {items.length > 0 && (
            <View style={s.itemsBox}>
              <Text style={{ fontSize: 12, fontWeight: '700', marginBottom: 4 }}>🛒 Items needed:</Text>
              <View style={s.tagRow}>
                {items.map(it => <Text key={it} style={[s.badge, { backgroundColor: colors.white, color: colors.gold }]}>{it}</Text>)}
              </View>
              <Text style={{ fontSize: 10, color: colors.light, marginTop: 4 }}>🏪 {VENDORS_SEED.slice(0, 2).map(v => v.name).join(', ')}</Text>
            </View>
          )}

          <Text style={s.label}>Date * (YYYY-MM-DD)</Text>
          <TextInput style={s.input} value={form.date} onChangeText={v => u('date', v)} placeholder="2026-04-15" />

          <Text style={s.label}>Address *</Text>
          <TextInput style={s.input} value={form.address} onChangeText={v => u('address', v)} placeholder="Full address" />

          <Text style={s.label}>Notes</Text>
          <TextInput style={[s.input, { height: 60 }]} value={form.notes} onChangeText={v => u('notes', v)} placeholder="Special requirements..." multiline />

          <TouchableOpacity style={s.bookBtn} onPress={handleBook}>
            <Text style={s.bookBtnText}>Send Request to Priest</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: colors.blue, textAlign: 'center', marginTop: 8 }}>
            📬 You'll get email + push notification + SMS when the priest responds.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { alignItems: 'center', padding: 24, backgroundColor: colors.saffronLight },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(232,113,42,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700', color: colors.dark },
  temple: { fontSize: 13, color: colors.mid, marginTop: 2 },
  meta: { fontSize: 12, color: colors.light, marginTop: 4 },
  waBtn: { marginTop: 14, backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center' },
  waBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  waInline: { marginTop: 6, backgroundColor: '#F0FFF4', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#86EFAC' },
  waInlineText: { fontSize: 12, color: '#166534', fontWeight: '600' },
  waBookBtn: { width: 52, borderRadius: 12, backgroundColor: '#25D366', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  secTitle: { fontSize: 14, fontWeight: '700', color: colors.dark, marginBottom: 6 },
  secText: { fontSize: 13, color: colors.mid, marginBottom: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontWeight: '600', overflow: 'hidden' },
  bookBtn: { backgroundColor: colors.saffron, borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 16, marginTop: 20 },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bookingForm: { margin: 16, backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.saffron },
  label: { fontSize: 13, fontWeight: '600', color: colors.mid, marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 14 },
  itemsBox: { backgroundColor: colors.goldLight, borderRadius: 10, padding: 10, marginTop: 8, borderWidth: 1, borderColor: colors.gold },
});
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { getItemsForPooja } from '../../../shared/types';

export default function PriestDetailScreen({ route }) {
  const { priestId } = route.params;
  const priest = PRIESTS_SEED.find(p => p.id === priestId);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({ poojaType: '', date: '', address: '', notes: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!priest) return <View style={s.container}><Text>Priest not found</Text></View>;

  const items = form.poojaType ? getItemsForPooja(form.poojaType) : [];

  const handleBook = () => {
    if (!form.poojaType || !form.date || !form.address) {
      Alert.alert('Missing Info', 'Please fill pooja type, date, and address.');
      return;
    }
    Alert.alert('Request Sent! 🙏', `Your ${form.poojaType} request has been sent to ${priest.name}. You'll get a push notification when they respond.`);
    setBooking(false);
    setForm({ poojaType: '', date: '', address: '', notes: '' });
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.avatar}><Text style={{ fontSize: 40 }}>🙏</Text></View>
        <Text style={s.name}>{priest.name}</Text>
        <Text style={s.temple}>{priest.temple}</Text>
        <Text style={s.meta}>📍 {priest.location}  ⭐ {priest.rating} ({priest.reviews})  {priest.experience} yrs</Text>
      </View>

      {/* Details */}
      <View style={s.section}>
        <Text style={s.secTitle}>Contact</Text>
        <Text style={s.secText}>📞 {priest.phone}</Text>
        <Text style={s.secText}>✉️ {priest.email}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Mother Tongue</Text>
        <Text style={[s.badge, { backgroundColor: colors.saffronLight, color: colors.saffron }]}>{priest.motherTongue}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Languages</Text>
        <View style={s.tagRow}>{priest.languages.map(l => <Text key={l} style={[s.badge, { backgroundColor: colors.blueLight, color: colors.blue }]}>{l}</Text>)}</View>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Poojas & Services ({priest.poojas.length})</Text>
        <View style={s.tagRow}>{priest.poojas.map(p => <Text key={p} style={[s.badge, { backgroundColor: colors.saffronLight, color: colors.saffron }]}>{p}</Text>)}</View>
      </View>
      <View style={s.section}>
        <Text style={s.secTitle}>Price Range</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.saffron }}>{priest.priceRange}</Text>
      </View>

      {!booking ? (
        <TouchableOpacity style={s.bookBtn} onPress={() => setBooking(true)}>
          <Text style={s.bookBtnText}>Book This Priest</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.bookingForm}>
          <Text style={s.secTitle}>Book {priest.name}</Text>

          <Text style={s.label}>Pooja Type *</Text>
          <View style={s.tagRow}>
            {priest.poojas.map(p => (
              <TouchableOpacity key={p} onPress={() => u('poojaType', p)}
                style={[s.badge, { backgroundColor: form.poojaType === p ? colors.saffron : colors.saffronLight }]}>
                <Text style={{ color: form.poojaType === p ? '#fff' : colors.saffron, fontSize: 12, fontWeight: '600' }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {items.length > 0 && (
            <View style={s.itemsBox}>
              <Text style={{ fontSize: 12, fontWeight: '700', marginBottom: 4 }}>🛒 Items needed:</Text>
              <View style={s.tagRow}>
                {items.map(it => <Text key={it} style={[s.badge, { backgroundColor: colors.white, color: colors.gold }]}>{it}</Text>)}
              </View>
              <Text style={{ fontSize: 10, color: colors.light, marginTop: 4 }}>🏪 {VENDORS_SEED.slice(0, 2).map(v => v.name).join(', ')}</Text>
            </View>
          )}

          <Text style={s.label}>Date * (YYYY-MM-DD)</Text>
          <TextInput style={s.input} value={form.date} onChangeText={v => u('date', v)} placeholder="2026-04-15" />

          <Text style={s.label}>Address *</Text>
          <TextInput style={s.input} value={form.address} onChangeText={v => u('address', v)} placeholder="Full address" />

          <Text style={s.label}>Notes</Text>
          <TextInput style={[s.input, { height: 60 }]} value={form.notes} onChangeText={v => u('notes', v)} placeholder="Special requirements..." multiline />

          <TouchableOpacity style={s.bookBtn} onPress={handleBook}>
            <Text style={s.bookBtnText}>Send Request to Priest</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: colors.blue, textAlign: 'center', marginTop: 8 }}>
            📬 You'll get email + push notification + SMS when the priest responds.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { alignItems: 'center', padding: 24, backgroundColor: colors.saffronLight },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(232,113,42,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700', color: colors.dark },
  temple: { fontSize: 13, color: colors.mid, marginTop: 2 },
  meta: { fontSize: 12, color: colors.light, marginTop: 4 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  secTitle: { fontSize: 14, fontWeight: '700', color: colors.dark, marginBottom: 6 },
  secText: { fontSize: 13, color: colors.mid, marginBottom: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontWeight: '600', overflow: 'hidden' },
  bookBtn: { backgroundColor: colors.saffron, borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 16, marginTop: 20 },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bookingForm: { margin: 16, backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.saffron },
  label: { fontSize: 13, fontWeight: '600', color: colors.mid, marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 14 },
  itemsBox: { backgroundColor: colors.goldLight, borderRadius: 10, padding: 10, marginTop: 8, borderWidth: 1, borderColor: colors.gold },
});
