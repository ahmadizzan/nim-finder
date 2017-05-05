const fs = require('fs');

const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const url = 'mongodb://localhost:27017/myproject';
const nimArray = require('../data/nim_array.json');
const kodeJurusan = require('../data/kode_jurusan.json');

let nimS1 = nimArray.filter((str) => kodeJurusan.hasOwnProperty(str.substring(0, 3)));

let nimFinal = nimS1.map((str) => {
   let prodi = kodeJurusan[str.substring(0, 3)];
   let tahun = '20' + str.substring(3, 5);
   let nama = str.split(';')[1].trim();
   let nim = str.split(';')[0].trim();

   let obj = {nama, nim, prodi, tahun};
   return obj;
});

fs.writeFile('../data/nim_array_parsed.json', JSON.stringify(nimFinal, undefined, 2), (err) => {
   if(err) {
      return console.log('ERROR');
   }
   console.log('SUCCESS');
});


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.collection('nim-data').createIndex({"nama": "text", "nim": "text", "prodi": "text", "tahun": "text"});

  db.collection('nim-data').insertMany(nimFinal, (err, result) => {
     if(err){
        db.close();
        return console.log(err);
     }
     console.log('Successfully saved nim-data!');
     db.close();
  });
});
