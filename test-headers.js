const https = require('https');
https.get('https://viral-scope-4zqe.onrender.com/sitemap-live.xml', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
});
