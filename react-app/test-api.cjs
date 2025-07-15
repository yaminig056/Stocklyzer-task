const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/realtime/prices',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const prices = JSON.parse(data);
      console.log('\nReal-time Prices:');
      console.log(JSON.stringify(prices, null, 2));
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end(); 