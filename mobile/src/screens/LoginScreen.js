import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase';
import { loginUser, logAuthEvent } from '../../../shared/services/authService';
import {
  getBiometricInfo, getBiometricLabel, getBiometricIcon,
  isBiometricEnabled, authenticateWithBiometrics, getBiometricCredentials,
} from '../services/biometricService';
import { colors } from '../styles/theme';
import { Platform as RNPlatform } from 'react-native';
import Constants from 'expo-constants';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  // Biometric state
  const [bioInfo,    setBioInfo]    = useState(null);   // { available, type }
  const [bioEnabled, setBioEnabled] = useState(false);  // has user enrolled?

  // Check biometric capability once on mount
  useEffect(() => {
    (async () => {
      const info    = await getBiometricInfo();
      const enabled = await isBiometricEnabled();
      setBioInfo(info);
      setBioEnabled(enabled && info.available);
    })();
  }, []);

  // ── Email / password sign-in ──────────────────────────────────────────────
  const handleLogin = useCallback(async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields.'); return; }
    setLoading(true);
    try {
      const user = await loginUser(auth, email, password);
      await logAuthEvent(db, user.uid, 'email_login', {
        success:  true,
        platform: RNPlatform.OS,
        device:   Constants.deviceName || 'unknown',
      });
    } catch (err) {
      Alert.alert('Login Failed', err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  // ── Biometric sign-in ─────────────────────────────────────────────────────
  const handleBiometricLogin = useCallback(async () => {
    if (!bioInfo?.available) return;
    const label = getBiometricLabel(bioInfo.type);

    setLoading(true);
    try {
      const result = await authenticateWithBiometrics(label);
      if (!result.success) {
        // User cancelled or failed — do not show error for cancellation
        if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
          Alert.alert(`${label} Failed`, 'Authentication was not successful. Please use your password.');
        }
        return;
      }

      // Retrieve stored credentials from OS keychain
      const { email: storedEmail, password: storedPwd, uid } = await getBiometricCredentials();
      if (!storedEmail || !storedPwd) {
        Alert.alert('Setup Required', 'Biometric credentials not found. Please sign in with your password first.');
        return;
      }

      const user = await loginUser(auth, storedEmail, storedPwd);
      await logAuthEvent(db, user.uid, 'biometric_login', {
        success:       true,
        biometricType: bioInfo.type,
        platform:      RNPlatform.OS,
        device:        Constants.deviceName || 'unknown',
      });
    } catch (err) {
      Alert.alert('Error', err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }, [bioInfo]);

  const bioLabel = bioInfo ? getBiometricLabel(bioInfo.type) : '';
  const bioIcon  = bioInfo ? getBiometricIcon(bioInfo.type)  : '';

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../../assets/logo-wordmark.png')}
          style={s.logo}
          resizeMode="contain"
          accessibilityLabel="Samskara"
        />
        <Text style={s.subtitle}>Hindu Religious Services · Serving All of New England</Text>

        <View style={s.card}>
          <Text style={s.heading}>Sign In</Text>

          {/* ── Biometric button (shown only if enrolled) ── */}
          {bioEnabled && (
            <TouchableOpacity
              style={s.bioBtn}
              onPress={handleBiometricLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={s.bioIcon}>{bioIcon}</Text>
              <Text style={s.bioBtnText}>Continue with {bioLabel}</Text>
            </TouchableOpacity>
          )}

          {bioEnabled && (
            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or sign in with email</Text>
              <View style={s.dividerLine} />
            </View>
          )}

          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={s.label}>Password</Text>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.5 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 13, color: colors.light }}>
              Don't have an account?{' '}
              <Text style={{ color: colors.saffron, fontWeight: '700' }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.cream },
  scroll:      { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo:        { width: '80%', height: 80, alignSelf: 'center', marginBottom: 8 },
  subtitle:    { fontSize: 13, textAlign: 'center', color: colors.light, marginBottom: 28 },
  card:        { backgroundColor: colors.white, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  heading:     { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: 18 },
  label:       { fontSize: 13, fontWeight: '600', color: colors.mid, marginBottom: 4, marginTop: 12 },
  input:       { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 14 },
  btn:         { backgroundColor: colors.saffron, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 20 },
  btnText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
  // Biometric
  bioBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a0a00', borderRadius: 10, padding: 14, marginBottom: 4, gap: 10 },
  bioIcon:     { fontSize: 22 },
  bioBtnText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.light },
});
