// mobile/src/screens/PriestsScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { colors } from '../styles/theme';
import { PRIESTS_SEED } from '../../../shared/data/seedData';

function openWhatsApp(number, priestName) {
  const clean = number.replace(/\D/g, '');
  const msg = encodeURIComponent(`Namaste ${priestName} ji 🙏, I found you on PoojaConnect and would like to enquire about your pooja services.`);
  const url = `whatsapp://send?phone=${clean}&text=${msg}`;
  Linking.canOpenURL(url).then(supported => {
    if (supported) Linking.openURL(url);
    else Linking.openURL(`https://wa.me/${clean}?text=${msg}`);
  });
}

export default function PriestsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const priests = PRIESTS_SEED.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.poojas.some(pj => pj.toLowerCase().includes(s)) || p.location.toLowerCase().includes(s);
  });

  const renderPriest = ({ item: p }) => (
    <TouchableOpacity style={s.card} onPress={() => navigation.navigate('PriestDetail', { priestId: p.id })}>
      <View style={s.cardRow}>
        <View style={s.avatar}><Text style={{ fontSize: 28 }}>🙏</Text></View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={s.name}>{p.name}</Text>
            {p.verified && <Text style={s.verified}>✓</Text>}
          </View>
          <Text style={s.temple}>{p.temple}</Text>
          <Text style={s.meta}>📍 {p.location}  ⭐ {p.rating} ({p.reviews})  {p.experience} yrs</Text>
          <Text style={s.tongue}>Mother Tongue: {p.motherTongue}</Text>
          <View style={s.tags}>
            {p.poojas.slice(0, 3).map(pj => <Text key={pj} style={s.tag}>{pj}</Text>)}
            {p.poojas.length > 3 && <Text style={[s.tag, { backgroundColor: colors.gray100, color: colors.gray400 }]}>+{p.poojas.length - 3}</Text>}
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <Text style={s.price}>{p.priceRange}</Text>
          {p.whatsappNumber && (
            <TouchableOpacity
              style={s.waIcon}
              onPress={e => { e.stopPropagation && e.stopPropagation(); openWhatsApp(p.whatsappNumber, p.name); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 18 }}>💬</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <TextInput style={s.searchInput} value={search} onChangeText={setSearch}
          placeholder="🔍 Search by name, pooja, location..." placeholderTextColor={colors.light} />
      </View>
      <FlatList data={priests} keyExtractor={p => p.id} renderItem={renderPriest}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}
        ListEmptyComponent={<View style={s.empty}><Text style={{ fontSize: 36 }}>🔍</Text><Text style={s.emptyText}>No priests found</Text></View>} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  searchBar: { padding: 16, paddingBottom: 8 },
  searchInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 14 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  cardRow: { flexDirection: 'row', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: colors.saffronLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: colors.dark },
  verified: { fontSize: 11, fontWeight: '700', color: colors.green, backgroundColor: colors.greenLight, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10 },
  temple: { fontSize: 12, color: colors.mid, marginTop: 1 },
  meta: { fontSize: 11, color: colors.light, marginTop: 3 },
  tongue: { fontSize: 11, color: colors.mid, marginTop: 2, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { fontSize: 10, backgroundColor: colors.saffronLight, color: colors.saffron, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  price: { fontSize: 13, fontWeight: '700', color: colors.saffron },
  waIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#25D366', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: colors.light, marginTop: 8 },
});

export default function PriestsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const priests = PRIESTS_SEED.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.poojas.some(pj => pj.toLowerCase().includes(s)) || p.location.toLowerCase().includes(s);
  });

  const renderPriest = ({ item: p }) => (
    <TouchableOpacity style={s.card} onPress={() => navigation.navigate('PriestDetail', { priestId: p.id })}>
      <View style={s.cardRow}>
        <View style={s.avatar}><Text style={{ fontSize: 28 }}>🙏</Text></View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={s.name}>{p.name}</Text>
            {p.verified && <Text style={s.verified}>✓</Text>}
          </View>
          <Text style={s.temple}>{p.temple}</Text>
          <Text style={s.meta}>📍 {p.location}  ⭐ {p.rating} ({p.reviews})  {p.experience} yrs</Text>
          <Text style={s.tongue}>Mother Tongue: {p.motherTongue}</Text>
          <View style={s.tags}>
            {p.poojas.slice(0, 3).map(pj => <Text key={pj} style={s.tag}>{pj}</Text>)}
            {p.poojas.length > 3 && <Text style={[s.tag, { backgroundColor: colors.gray100, color: colors.gray400 }]}>+{p.poojas.length - 3}</Text>}
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.price}>{p.priceRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <TextInput style={s.searchInput} value={search} onChangeText={setSearch}
          placeholder="🔍 Search by name, pooja, location..." placeholderTextColor={colors.light} />
      </View>
      <FlatList data={priests} keyExtractor={p => p.id} renderItem={renderPriest}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}
        ListEmptyComponent={<View style={s.empty}><Text style={{ fontSize: 36 }}>🔍</Text><Text style={s.emptyText}>No priests found</Text></View>} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  searchBar: { padding: 16, paddingBottom: 8 },
  searchInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 14 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  cardRow: { flexDirection: 'row', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: colors.saffronLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: colors.dark },
  verified: { fontSize: 11, fontWeight: '700', color: colors.green, backgroundColor: colors.greenLight, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10 },
  temple: { fontSize: 12, color: colors.mid, marginTop: 1 },
  meta: { fontSize: 11, color: colors.light, marginTop: 3 },
  tongue: { fontSize: 11, color: colors.mid, marginTop: 2, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { fontSize: 10, backgroundColor: colors.saffronLight, color: colors.saffron, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  price: { fontSize: 13, fontWeight: '700', color: colors.saffron },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: colors.light, marginTop: 8 },
});
