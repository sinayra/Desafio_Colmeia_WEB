Parse.initialize("SU0myMIe1AUitLKar0mum8My8RbQ87lEaRjjKDgh","GtvnNXChRLZRYBbWxNy9fM0LPloMfpYICCtMdJIL");
Parse.serverURL = 'https://parseapi.back4app.com/';

var Professores = Parse.Object.extend("Professores");

$.fn.stars = function() {
    return $(this).each(function() {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}

$( "#busca" ).submit(function( event ) {
  event.preventDefault();
});

$( "#menu" ).click(function( event ) {
  var target = $(event.target);
    if (target.is('a')) {
      $(".resultados").html('<img src="./img/loader.gif">');

      event.stopPropagation();               
      event.preventDefault();

      var nome = target.html();

      if(nome.length > 1)
        busca("");
      else if(nome.length == 1)
        busca(nome);
    }
});


$("#busca :input[name='nomeprof']").bind('input', function() {
  var nome = $(this).val();

  $(".resultados").html('<img src="./img/loader.gif">');
  
  if(nome.length != 0){
    nome = nome.toLowerCase();
    nome =  nome.charAt(0).toUpperCase() + nome.slice(1);

    busca(nome);
  }
  else{
    $( ".prof" ).remove();
    $(".resultados").html("");
  }

});

function busca(nome){
  var html = "";

  var Professores = Parse.Object.extend("Professores");
  var query = new Parse.Query(Professores);
  query.startsWith("nome", nome);
  query.ascending("nome");

  query.find({
    beforeSend: function(){
      $(".resultados").html('<img src="./img/loader.gif">');
    },
    success: function (results) {
      $(".resultados").html("");

      if(results.length <= 0){
        html += '<table class="prof">';
        html += '<tr><th>Não foi encontrado nenhum resultado</th></tr>';
        html += '</table>';

        $(".resultados").html(html);
      }
      else{
        for (var i = 0; i < results.length; i++){
          var prof = results[i];
          var img = prof.get('imagem');

          /*
          console.log('Nome: ' + prof.get('nome'));
          console.log('Img: ' + prof.get('imagem'));
          console.log('Currículo: ' + prof.get('curriculo'));
          console.log('Matéria: ' + prof.get('materia'));
          console.log('Nota: ' + prof.get('nota'));
          */

          html += '<table class="prof">';

          html += '<tr>';
          html += '<td rowspan=3 style="width: 20%">';
          html += '<img class="avatar" src="' + img.url() + '">';
          html += '</td>';
          html += '</tr>';


          html += '<tr>';
          html += '<th style="color: #FFA24F">' + prof.get('nome') + '</th>';
          html += '<th>Currículo</th>';
          html += '</tr>';

          html += '<tr>';
          html += '<td class="estrelas">';
          html += '<b>' + prof.get('materia') + '</b></br >';

          //console.log("Nota: " + prof.get('nota'));
          html += '<span class="stars" title="' + prof.get('nota')  + '">' + prof.get('nota') + '</span>';
          html += '</td>';

          html += '<td>' + prof.get('curriculo') + '</td>';
          html += '</tr>';

          html += '</table>'

        }
        $(".resultados").html(html);

        $('span.stars').stars();
      }
    },
    error: function (error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
}
