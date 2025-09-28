/* Firebase Messaging SW (Compat) para notificaciones en background */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBPNfGVvTJWEim3qgK3rS2PcEaqpej3Dms",
  authDomain: "barbelga-3f021.firebaseapp.com",
  projectId: "barbelga-3f021",
  storageBucket: "barbelga-3f021.firebasestorage.app",
  messagingSenderId: "111939067233",
  appId: "1:111939067233:web:6af08d6f96a22cb38c3920"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Notificación";
  const options = { body: payload.notification?.body || "", icon: "/favicon.ico", data: payload.data || {} };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
