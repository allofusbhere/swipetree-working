// Netlify Function: labels.js
export default async (request, context) => {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Handle preflight OPTIONS request
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }
  
  // GET request - retrieve label
  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'missing id' }), { status: 400, headers });
    }
    
    try {
      // Use Netlify Blobs for persistent storage
      const key = `label_${id}`;
      const data = await context.blobs.get(key);
      
      if (!data) {
        // Return empty label if not found
        return new Response(JSON.stringify({ id, name: '', dob: '' }), { headers });
      }
      
      return new Response(data, { headers });
    } catch (error) {
      console.error('GET Error:', error);
      return new Response(JSON.stringify({ error: 'storage error' }), { status: 500, headers });
    }
  }
  
  // POST request - save label
  if (method === 'POST') {
    try {
      const body = await request.json();
      const { id, name = '', dob = '' } = body;
      
      if (!id) {
        return new Response(JSON.stringify({ error: 'missing id' }), { status: 400, headers });
      }
      
      // Store in Netlify Blobs
      const key = `label_${id}`;
      const value = JSON.stringify({ id, name, dob });
      await context.blobs.set(key, value);
      
      return new Response(JSON.stringify({ success: true }), { headers });
    } catch (error) {
      console.error('POST Error:', error);
      return new Response(JSON.stringify({ error: 'save failed' }), { status: 500, headers });
    }
  }
  
  // Method not allowed
  return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers });
};
