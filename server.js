const express = require('express');
const bodyParser = require('body-parser')

var app = express();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/myproject';

app.use(bodyParser.json())
app.use(express.static('public'));

function messy(x, arr, callback){
   console.log(x);
   x.forEach((doc, err) => {
     arr.push(doc);
   });
   callback();
}

app.get('/get-data/:id', function(req, res) {
   MongoClient.connect(url, function(err, db) {
     assert.equal(null, err);

     let param = req.params.id;

     db.collection('nim-data')
      .find({ $text: { $search: `\"${param}\"`} })
      .toArray()
      .then((docs) => {
         console.log(docs);
         res.send(docs);
      }, (err) => {
         console.log('Unable to fetch todos ', err);
         res.send('yah error');
      });

      db.close();

  });
});

app.listen(1201, (err) => {
   if(err){
      return console.log('Server Error');
   }
   console.log('Connected to port 1201');
});
