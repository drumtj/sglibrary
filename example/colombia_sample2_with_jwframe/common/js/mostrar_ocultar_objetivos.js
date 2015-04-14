// JavaScript Document
var initList = initList || [];
initList.push(function (){
	$( "#objetivos2" ).hide();
	
	$( "#objetivosMouse" ).css({
			  'background-color':'#ff814a',
			  'opacity':0.4
			  });
	
	$( "#objetivosMouse" ).click(function() {
	  $( "#objetivos1" ).fadeOut("slow", function () {
		  $( "#objetivos2" ).fadeIn("slow")
		  $( "#objetivosMouse" ).css({
			  'background-color':'#efc94c',
			  'opacity':1
			  });
		  $( "#objetivosTeclado" ).css({
			  'background-color':'#ff814a',
			  'opacity':0.4
			  });
	  });
	});
	
	$( "#objetivosTeclado" ).click(function() {
	  $( "#objetivos2" ).fadeOut("slow", function () {
		  $( "#objetivos1" ).fadeIn("slow")
		  $( "#objetivosTeclado" ).css({
			  'background-color':'#efc94c',
			  'opacity':1
			  });
		  $( "#objetivosMouse" ).css({
			  'background-color':'#ff814a',
			  'opacity':0.4
			  });
	  });
	});
});


/*var obj1 = document.getElementById("objetivos1");
var obj2 = document.getElementById("objetivos2");
var botonTeclado = document.getElementById("objetivosTeclado");
var botonMouse = document.getElementById("objetivosMouse");

botonTeclado.style.backgroundColor="#efc94c";

obj2.style.display="none";

objetivosMouse.onclick=function(){
	obj2.style.display="block";
	obj1.style.display="none";
	botonMouse.style.backgroundColor="#efc94c";
	botonTeclado.style.backgroundColor="#ff814a";
};

objetivosTeclado.onclick=function(){
	obj1.style.display="block";
	obj2.style.display="none";
	botonTeclado.style.backgroundColor="#efc94c";
	botonMouse.style.backgroundColor="#ff814a";
};
*/