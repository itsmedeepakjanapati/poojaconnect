// Firebase Messaging Service Worker
// Handles background push notifications when app is not in foreground
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCmSKb2yGMTXC5YT7NwzH41MLV2lpAAlGU",
  authDomain: "pooja-connect-fd709.firebaseapp.com",
  projectId: "pooja-connect-fd709",
  storageBucket: "pooja-connect-fd709.firebasestorage.app",
  messagingSenderId: "863489802443",
  appId: "1:863489802443:web:5ad9d73cdcf943ef701b4e",
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
