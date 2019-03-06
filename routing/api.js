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
const Queries = require('../models/query.js');
const CONNECTION_STRING = process.env.DB;
const connect = mongoose.connect(CONNECTION_STRING);

connect.then((db) => {
  console.log("We and our database are together now");
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
      
      Queries.create({name: urlParsed.query.query})
      .then( (data) => {
        console.log("Now we know, that you are searching for " + data.name);
      })
      
      let start = 1;
      if(urlParsed.query.offset && Number.isInteger(+urlParsed.query.offset) && +urlParsed.query.offset > 1) {
        start = urlParsed.query.offset * 10 - 10 + 1;
        console.log(start);
      }
      let search = 'https://www.googleapis.com/customsearch/v1?key=' + KEY + '&cx=' + ID +'&searchType=image&alt=json&start=' + start + '&q=' + urlParsed.query.query;      
      
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


apiRouter.route('/latest/imagesearch/')
  .get( (req, res, next) => {
    //res.end('Hello, mortals!');
    Queries.find({}).sort({createdAt: 'desc'}).limit(10)
      .then( (data) => {
        let result = [];      
        for (let item of data) {
          result.push({term: item.name, when: item.createdAt})
        }
      
        res.statusCode = 200;
        res.json(result);
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = apiRouter;