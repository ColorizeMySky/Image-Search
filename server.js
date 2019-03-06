const express = require('express');
const app = express();
const apiRouter = require('./routing/api.js');
const mongoose = require('mongoose');


app.set('view engine', 'ejs');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use('/api', apiRouter);


//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('We was looking for this page, but didn\'t fint it');
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
