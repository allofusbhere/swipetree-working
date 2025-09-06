exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    const id = event.queryStringParameters?.id || '100000';
    return {
      statusCode: 200,
      body: JSON.stringify({ id, name: '', dob: '' })
    };
  }
  
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'method not allowed' })
  };
};
