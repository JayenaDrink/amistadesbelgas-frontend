# Notificaciones bidireccionales (gratis)

## Objetivo
- **Admin** recibe aviso de **nuevo pedido** (browser abierto; en-app + opcional push).
- **Cliente (front)** recibe **"Pedido listo"** aunque **no tenga la página abierta** (Web Push).

## Piezas
1. `index.html` (front): obtiene token FCM, guarda `clientToken` en el pedido y notifica a **adminTokens** vía un **Cloudflare Worker**.
2. `admin-v3.html` (backend): muestra toast + beep en nuevos pedidos; botón **Completar** envía push al `clientToken` del pedido usando el **Worker**. Incluye botón **🔔 Activar avisos** para registrar el token del admin en `adminTokens`.
3. `firebase-messaging-sw.js`: Service Worker para notificaciones en background.
4. `worker.js`: **Cloudflare Worker** gratuito que reenvía los mensajes a FCM (usa la **Legacy Server Key** guardada como secreto).

## Configuración

### A) Firebase Console
1. En **Cloud Messaging → Web Push certificates**, pulsa **Generate key pair** y **copia la clave pública (VAPID)**.
2. En **Project settings → Cloud Messaging → Cloud Messaging API (Legacy)**, copia tu **Server key** (Legacy).

### B) Reemplazos en código
- En `index.html` y `admin-v3.html`:
  - `VAPID_PUBLIC_KEY = "TU_VAPID_PUBLIC_KEY"` → pega tu VAPID pública.
  - `WORKER_SEND_URL = "https://TU-WORKER.workers.dev/send"` → URL de tu Worker (ver paso C).
- Usa tus credenciales Firebase (ya incluidas).

### C) Desplegar Cloudflare Worker (gratis)
1. Crea un Worker desde dashboard o con `wrangler` y pega `worker.js`.
2. En **Settings → Variables → Secrets**, crea `FCM_SERVER_KEY` y pega la **Server key (Legacy)** de FCM.
3. Publícalo. Supón que queda en `https://tu-nombre.workers.dev`. Opcionalmente crea una ruta `/send`.

### D) Subir archivos al repo
- Sube `index.html`, `admin-v3.html` y `firebase-messaging-sw.js` a la **misma carpeta** (raíz de Pages).
- Sube `worker.js` al proyecto de Cloudflare (no al repo).

## Uso
- **Admin** abre `admin-v3.html`, pulsa **🔔 Activar avisos** (opcional). Verá toasts+beep en tiempo real siempre (incluso sin push).
- **Cliente** abre `index.html` una vez y concede permiso. A partir de ahí, aunque cierre la página:
  - Cuando el admin marque **Completar**, se envía un push **"✅ Pedido listo"** a su dispositivo.

## Notas
- Android/Windows: Web Push funciona con navegador cerrado.  
- iOS: requiere que el sitio esté **instalado a pantalla de inicio** para recibir push en background.
- Todo es **gratis**: Firestore (volumen bajo), Cloudflare Worker (plan gratuito) y FCM.

