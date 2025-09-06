// Netlify Function: labels
exports.handler = async (event, context) => {
  const url = new URL(event.url);
  const method = event.httpMethod.toUpperCase();
  const blobs = context?.blobs;
  const KEY = (id) => `labels:${id}`;
  
  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'missing id' }) };
    
    try {
      if (blobs) {
        const text = await blobs.get(KEY(id), { type: 'text' });
        if (!text) return { statusCode: 200, body: JSON.stringify({ id, name: '', dob: '' }) };
        return { statusCode: 200, body: text };
      } else {
        globalThis.__labels ||= new Map();
        const v = globalThis.__labels.get(KEY(id)) || { id, name: '', dob: '' };
        return { statusCode: 200, body: JSON.stringify(v) };
      }
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
    }
  }
  
  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const { id, name = '', dob = '' } = body;
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'missing id' }) };
    
    const value = JSON.stringify({ id, name, dob });
    try {
      if (blobs) {
        await blobs.set(KEY(id), value, { type: 'text' });
      } else {
        globalThis.__labels ||= new Map();
        globalThis.__labels.set(KEY(id), { id, name, dob });
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
    }
  }
  
  return { statusCode: 405, body: JSON.stringify({ error: 'method not allowed' }) };
};
