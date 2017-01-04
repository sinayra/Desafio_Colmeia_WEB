/****************************
 * Inicialização
 ****************************/
Parse.initialize("SU0myMIe1AUitLKar0mum8My8RbQ87lEaRjjKDgh","GtvnNXChRLZRYBbWxNy9fM0LPloMfpYICCtMdJIL");
Parse.serverURL = 'https://parseapi.back4app.com/';
var Professores = Parse.Object.extend("Professores"); 
var query = new Parse.Query(Professores);


/****************************
 * Estilo
 ****************************/

//Ajustar avatares dos professores para ficarem sempre redondos
$(window).on('resize', function(){
  $( "img.avatar" ).each(function( index ) {
    $( this ).css({'height': $(this).width() + 'px'});
  });
});

//Evitar que a ação de <enter> no formulário faça ação
$( "#busca" ).submit(function( event ) {
  event.preventDefault();
});

/****************************
 * Busca
 ****************************/

//Buscar clicando links do menu
$( "#menu" ).click(function( event ) {
  var target = $(event.target);
  $("#busca :input[name='nomeprof']").val("");
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

//Enquanto o usuário está digitando, exiba carregando para melhor feedback
$("#busca :input[name='nomeprof']").keydown(function(e) {
  var inp = String.fromCharCode(e.keyCode);

  if (/[a-zA-Z0-9-_ ]/.test(inp) || e.keyCode == 8)
    $(".resultados").html('<img src="./img/loader.gif">');

});

//Buscar ao parar de digitar
$("#busca :input[name='nomeprof']").keyup(function(e) {
  var nome = $(this).val();

  var inp = String.fromCharCode(e.keyCode);

  if (/[a-zA-Z0-9-_ ]/.test(inp))
    $(".resultados").html('<img src="./img/loader.gif">');
  
  if(nome.length != 0){
    nome = nome.toLowerCase();
    nome =  nome.charAt(0).toUpperCase() + nome.slice(1);

    busca(nome);
  }
  else{
    $(".resultados").empty();
  }

});

//Realiza busca. Retorna quando encerrou execução
function busca(nome){

  query.startsWith("nome", nome);
  query.ascending("nome");

  query.find().then(function (results){
    escreveProf(results);
  }, function(error){
    console.log("Error: " + error.code + " " + error.message);
  });
}

//Escreve em .resultados
function escreveProf(results){
  var html = "";

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
    $( "img.avatar" ).each(function( index ) {
      $( this ).css({'height': $(this).width() + 'px'});
    });
  }
}
