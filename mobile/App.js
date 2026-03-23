// mobile/App.js
// Main entry point for PoojaConnect mobile app (Expo / React Native)
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './src/firebase';
import { getUserProfile } from '../shared/services/authService';
import usePushNotifications from './src/hooks/usePushNotifications';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Push notifications
  const { expoPushToken, notification } = usePushNotifications(user?.uid);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const prof = await getUserProfile(db, firebaseUser.uid);
          setProfile(prof);
        } catch (e) {
          console.warn('Profile fetch error:', e);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEFCF6' }}>
        <ActivityIndicator size="large" color="#E8712A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? (
        <AppNavigator userRole={profile?.role} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
