import https from 'https';
import fs from 'fs';

const actionId = '40f015174b1bcf0829ce4fbd3e277f462e34d8cc5b';

const payload = JSON.stringify([{
  email: 'juliasouzamartins71@gmail.com',
  password: 'Araujo89@',
  next: '/app'
}]);

console.log('Sending server action payload:', payload);

const req = https.request('https://fluxoleadai.com.br/entrar', {
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/x-component',
    'Next-Action': actionId,
    'Content-Type': 'text/plain;charset=UTF-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response body:', data);
    fs.writeFileSync('login_response.txt', data);
    if (res.headers['set-cookie']) {
      fs.writeFileSync('cookies.json', JSON.stringify(res.headers['set-cookie'], null, 2));
      console.log('Saved cookies!');
    }
  });
});

req.on('error', console.error);
req.write(payload);
req.end();

