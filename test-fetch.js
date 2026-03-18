import https from 'https';

https.get('https://docs.google.com/spreadsheets/d/1SrJex63ilv6tpSNVKvvlYWwvkzr9vG_RciN-6-BKnR0/gviz/tq?tqx=out:csv&sheet=Indo', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 500));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
