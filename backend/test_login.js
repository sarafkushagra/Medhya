import http from 'http';

const postData = JSON.stringify({
  supplierId: 'SUP001',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/suppliers/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
    } catch (e) {
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(postData);
req.end();