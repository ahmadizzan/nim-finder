$(document).ready(function(){
   // fetch data on keypress
   $( "#target" ).keyup(function() {
      var param = this.value;

      $('#list').empty();
      $.get(`/get-data/${param}`, function(data, status) {
         console.log(typeof data);
         var results = data.map((doc) => `<li>${doc.nim} / ${doc.nama} / ${doc.prodi} / ${doc.tahun}</li>`);
         $('#list').append(results.join(''));
      });
   });
});
