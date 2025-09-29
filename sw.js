// sw.js — service worker para Web Push (sin payload)

self.addEventListener("install", (event) => {
  // activa de inmediato la nueva versión
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // toma control de las pestañas abiertas
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  // Como enviamos "sin payload", event.data puede venir vacío
  const text = event.data?.text?.() || "";
  const title = "Nuevo aviso";
  const body = text || "Tienes una nueva notificación.";

  const options = {
    body,
    // Los iconos son opcionales; si no los tienes, quítalos
    //icon: "/icon-192.png",
    //badge: "/badge-72.png",
    //data: { url: "/" }, // a dónde abrir al hacer clic
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      // si hay una pestaña abierta, fócusala
      for (const c of clientsArr) {
        if ("focus" in c) return c.focus();
      }
      // si no hay, abre una nueva
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
