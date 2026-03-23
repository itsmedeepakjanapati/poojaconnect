// Firebase Messaging Service Worker
// Handles background push notifications when app is not in foreground
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "poojaconnect-app.firebaseapp.com",
  projectId: "poojaconnect-app",
  storageBucket: "poojaconnect-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'PoojaConnect', {
    body: body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
  });
});
