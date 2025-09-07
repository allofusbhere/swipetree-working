// netlify/functions/labels.js
// Ultra-simple test function

export default async (request, context) => {
  return new Response(
    JSON.stringify({ 
      message: "Function is working!",
      timestamp: new Date().toISOString()
    }), 
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};
