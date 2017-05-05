const Crawler = require("crawler");
const url = require('url');
const _ = require('lodash');
const fs = require('fs');

var NIM = [];

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            var page = res.body;
            var reg = page.match(/\d{8};.+/g);
            if(reg !== null){
               NIM = _.uniq(_.concat(NIM, reg));
               console.log(NIM.length , ' ', c.queueSize);
               if(NIM.length > 18000){
                  var dataq = JSON.stringify(NIM, undefined, 2);
                  fs.writeFile('../data/nim_array.json', dataq, function(err) {
                     if(err){
                        return console.log('SALT', err);
                     }
                     console.log('DATA WRITE SUCCESS, ', NIM.length, ' entry');
                  });
               }
            }
        }

        if(typeof $ == 'function'){
          $('a').each((i, elem) => {
             if(elem.attribs.href !== 'displayprodikelas.php?semester=2&tahun=2016&th_kur=2013'){
                 c.queue(`https://six.akademik.itb.ac.id/publik/${elem.attribs.href}`);
              }
          });
         }

        done();
    }
});

c.queue('https://six.akademik.itb.ac.id/publik/displayprodikelas.php?semester=2&tahun=2016&th_kur=2013');
