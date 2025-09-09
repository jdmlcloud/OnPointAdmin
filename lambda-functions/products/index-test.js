exports.handler = async (event) => {
  console.log('🔍 Test Event:', JSON.stringify(event, null, 2));
  
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Max-Age': '86400'
    },
    body: JSON.stringify({
      success: true,
      message: 'Test function working',
      method: event.httpMethod,
      body: event.body
    })
  };
  
  console.log('📤 Response:', JSON.stringify(response, null, 2));
  return response;
};
