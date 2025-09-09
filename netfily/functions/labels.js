// SwipeTree Labels Function - Cross-device label storage
exports.handler = async (event, context) => {
  // Set CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // Simple in-memory storage (for development)
    // Note: In production, you'd want to use a database or external storage
    if (!global.labelStorage) {
      global.labelStorage = {};
    }
    
    if (event.httpMethod === 'GET') {
      // GET request - retrieve labels
      const personId = event.queryStringParameters?.personId;
      
      if (personId) {
        // Get labels for specific person
        const labels = global.labelStorage[personId] || [];
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            personId: personId,
            labels: labels
          })
        };
      } else {
        // Get all labels
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            allLabels: global.labelStorage
          })
        };
      }
    }
    
    else if (event.httpMethod === 'POST') {
      // POST request - save/update labels
      const body = JSON.parse(event.body || '{}');
      const { personId, labels, action } = body;
      
      if (!personId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'personId is required'
          })
        };
      }
      
      if (action === 'set') {
        // Set/replace all labels for this person
        global.labelStorage[personId] = labels || [];
      } else if (action === 'add') {
        // Add a single label
        if (!global.labelStorage[personId]) {
          global.labelStorage[personId] = [];
        }
        if (labels && !global.labelStorage[personId].includes(labels)) {
          global.labelStorage[personId].push(labels);
        }
      } else if (action === 'remove') {
        // Remove a single label
        if (global.labelStorage[personId]) {
          global.labelStorage[personId] = global.labelStorage[personId].filter(
            label => label !== labels
          );
        }
      }
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          personId: personId,
          labels: global.labelStorage[personId] || [],
          action: action
        })
      };
    }
    
    else {
      // Unsupported method
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed'
        })
      };
    }
    
  } catch (error) {
    console.error('Labels function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.toString()
      })
    };
  }
};
