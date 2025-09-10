exports.handler = async (event, context) => {
  // Enable CORS for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const method = event.httpMethod;
    
    // Simple in-memory storage (will reset on function restart)
    // For production, you'd use a database like Supabase or Netlify's Key-Value store
    let familyData = context.clientContext?.custom?.familyData || {};

    if (method === 'GET') {
      // Get metadata for a specific family member ID
      const id = event.queryStringParameters?.id;
      
      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing id parameter. Use: ?id=100001' 
          })
        };
      }

      const memberData = familyData[id] || { id, name: '', dob: '' };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          id: id,
          name: memberData.name || '',
          dob: memberData.dob || '',
          timestamp: new Date().toISOString()
        })
      };
    }

    if (method === 'POST') {
      // Save metadata for a specific family member
      const data = JSON.parse(event.body || '{}');
      
      if (!data.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing id field. Expected: {id: "100001", name: "John", dob: "1990-01-15"}' 
          })
        };
      }

      // Store the family member data
      familyData[data.id] = {
        id: data.id,
        name: data.name || '',
        dob: data.dob || '',
        lastUpdated: new Date().toISOString()
      };

      // In a real app, you'd save familyData to a database here
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Family member data saved successfully',
          id: data.id,
          name: data.name || '',
          dob: data.dob || '',
          timestamp: new Date().toISOString()
        })
      };
    }

    // Unsupported method
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: `Method ${method} not supported. Use GET with ?id=123 or POST with {id, name, dob}` 
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Function error: ' + error.message 
      })
    };
  }
};
