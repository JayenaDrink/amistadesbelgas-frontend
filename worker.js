export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('OK', {status: 200});
    try {
      const { tokens, notification, data } = await request.json();
      if (!Array.isArray(tokens) || tokens.length === 0) {
        return new Response(JSON.stringify({ ok:false, error:'no tokens' }), { status: 400 });
      }
      const body = {
        registration_ids: tokens.slice(0, 900), // FCM limit
        notification: notification || { title: 'Mensaje', body: '' },
        data: data || {}
      };
      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': 'key=' + env.FCM_SERVER_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      return new Response(text, { status: res.status });
    } catch (e) {
      return new Response(JSON.stringify({ ok:false, error: e.message }), { status: 500 });
    }
  }
};
