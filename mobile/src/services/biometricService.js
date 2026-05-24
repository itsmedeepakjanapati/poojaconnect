// mobile/src/services/biometricService.js
// Biometric authentication service — Face ID, Touch ID, Fingerprint
// Credentials stored encrypted in the OS keychain via expo-secure-store

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// ── SecureStore keys ──────────────────────────────────────────────────────────
const KEY_ENABLED  = 'samskara_bio_enabled';
const KEY_EMAIL    = 'samskara_bio_email';
const KEY_PASSWORD = 'samskara_bio_pwd';
const KEY_UID      = 'samskara_bio_uid';

// ── Hardware check ────────────────────────────────────────────────────────────

/**
 * Returns { available: bool, type: 'face'|'fingerprint'|'biometric', reason? }
 */
export async function getBiometricInfo() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return { available: false, reason: 'no_hardware' };

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return { available: false, reason: 'not_enrolled' };

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  let biometricType = 'biometric';
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    biometricType = 'face';
  } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    biometricType = 'fingerprint';
  }

  return { available: true, type: biometricType };
}

/** Human-readable label: "Face ID", "Fingerprint", or "Biometrics" */
export function getBiometricLabel(type) {
  if (type === 'face') return 'Face ID';
  if (type === 'fingerprint') return 'Fingerprint';
  return 'Biometrics';
}

/** Icon for the biometric type */
export function getBiometricIcon(type) {
  if (type === 'face') return '🪪';
  if (type === 'fingerprint') return '👆';
  return '🔐';
}

// ── SecureStore helpers ───────────────────────────────────────────────────────

/** Check if the user has previously enrolled biometric login on this device */
export async function isBiometricEnabled() {
  try {
    const val = await SecureStore.getItemAsync(KEY_ENABLED);
    return val === 'true';
  } catch {
    return false;
  }
}

/**
 * Save credentials to the OS keychain after successful registration/login.
 * SecureStore uses iOS Keychain / Android Keystore — AES-256 encrypted.
 */
export async function saveBiometricCredentials(email, password, uid) {
  await SecureStore.setItemAsync(KEY_ENABLED,  'true');
  await SecureStore.setItemAsync(KEY_EMAIL,    email);
  await SecureStore.setItemAsync(KEY_PASSWORD, password);
  await SecureStore.setItemAsync(KEY_UID,      uid);
}

/** Retrieve stored credentials for biometric sign-in */
export async function getBiometricCredentials() {
  const email    = await SecureStore.getItemAsync(KEY_EMAIL);
  const password = await SecureStore.getItemAsync(KEY_PASSWORD);
  const uid      = await SecureStore.getItemAsync(KEY_UID);
  return { email, password, uid };
}

/** Wipe all stored biometric data (on sign-out or disable) */
export async function clearBiometricCredentials() {
  await SecureStore.deleteItemAsync(KEY_ENABLED);
  await SecureStore.deleteItemAsync(KEY_EMAIL);
  await SecureStore.deleteItemAsync(KEY_PASSWORD);
  await SecureStore.deleteItemAsync(KEY_UID);
}

// ── Authenticate ─────────────────────────────────────────────────────────────

/**
 * Trigger OS biometric prompt.
 * Returns the LocalAuthentication result { success, error? }
 */
export async function authenticateWithBiometrics(biometricLabel = 'Biometrics') {
  return LocalAuthentication.authenticateAsync({
    promptMessage:          `Sign in with ${biometricLabel}`,
    fallbackLabel:          'Use Password',
    cancelLabel:            'Cancel',
    disableDeviceFallback:  false,
  });
}
