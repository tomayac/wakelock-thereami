// server.js
// where your node app starts

// init project
const express = require('express');
const cors = require('cors');
const app = express();
const SSE = require('express-sse');
const sse = new SSE();

app.use(cors());

app.use('/', express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/stream', sse.init);

setInterval(() => {
  sse.send('Keep-Alive', 'keepAlive');
}, 5000);


app.get('/keepalive', (req, res) => {
  res.send('OK');
});

app.get('/ping', (req, res) => {
  const query = req.query;
  if (query.userAgent && query.timestamp) {    
    sse.send({
      userAgent: query.userAgent,
      timestamp: query.timestamp,
    }, 'ping');
    return res.send('Success');
  }
  return res.status(400).send('Bad request, specify &userAgent and &timestamp');  
});


app.get('/track', (req, res) => {
  const query = req.query;
  if (query.latitude && query.longitude && query.userAgent && query.timestamp) {    
    sse.send({
      userAgent: query.userAgent,
      timestamp: query.timestamp,
      latitude: query.latitude,
      longitude: query.longitude
    }, 'locationUpdate');
    return res.send('Success');
  }
  return res.status(400).send('Bad request, specify &latitude, &longitude, &userAgent, and &timestamp');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
