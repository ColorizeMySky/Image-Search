'use strict';

const express = require('express');
const apiRouter = express.Router();

const fetch = require('node-fetch');
const url = require('url');
const KEY = process.env.KEY;
const ID = process.env.ID;

const ejs = require('ejs');

const MongoClient = require('mongodb');
const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB;
const connect = mongoose.connect(CONNECTION_STRING);

connect.then((db) => {
  console.log("We managed to connect with database, wow!");
}, (err) => { console.log(err); });


apiRouter.route('/')
  .get(function(req, res, next) {
    res.statusCode = 200;
    res.end('Here is a daemon, he is listening');
})

apiRouter.route('/imagesearch')
  .get(function(req, res, next) {
    let urlParsed = url.parse(req.url, true);  
  
    if(urlParsed.query.query){
      let start = 1;
      if(urlParsed.query.offset && Number.isInteger(+urlParsed.query.offset) && +urlParsed.query.offset > 1) {
        start = urlParsed.query.offset * 10 - 10 + 1;
        console.log(start);
      }
      let search = 'https://www.googleapis.com/customsearch/v1?key=' + KEY + '&cx=' + ID +'&searchType=image&alt=json&start=' + start + '&q=' + urlParsed.query.query;
      console.log(search);
      fetch(search)
      .then( (response) => {
        if (response.status !== 200) {
          console.log("Here is not OK, here is " + response.status)
          return;
        }
        response.json().then( (data) => {
          res.render(process.cwd() + '/views/search', {
            //phrase: 'Hello, mortals!'
            data: data
          });
        });
      }).catch( (err) => {
        console.log('Houston, we have a problem');
      });
    }
    else {
      res.statusCode = 200;
      res.render(process.cwd() + '/views/search', {
          data: undefined
      });
    }
  
})


module.exports = apiRouter;