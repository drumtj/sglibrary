var resultDragDrop = [];
var correct = [];
// TODO compare  correct results  with  results drag and drop
function verifyExerciseDragDrop(){

    console.log('Verify');
    console.log(resultDragDrop);
    console.log(correctResult);
    result =  (resultDragDrop == correctResult);  // TODO Implement 
    console.log(result);

}

// Track excercise progreess
function registerDrop(keyDrag, keyDrop)
{
    var droppedElements = $.grep(resultDragDrop, function(e){ return e.keyDrop == keyDrop; });

    // Array de dragKeys en cada drop or empty
    var tmpArrayKey = resultDragDrop[keyDrop]; 

    if(tmpArrayKey != null){
        resultDragDrop[keyDrop].push(keyDrag); 
    }
    else{ // First Element
        var tmpArrayKey = [keyDrop];
        resultDragDrop[keyDrop] = tmpArrayKey; 
    }

   //console.log('kDrag'+keyDrag);
   //console.log('kDrop'+keyDrop);
   //console.log(resultDragDrop);
   //verifyExerciseDragDrop();  // TODO implement
    
}


function proccessDrop(event, ui){

    var DEACTIVATE_DROP  = true;   // bool
    var DEACTIVATE_DRAG  = true;   // bool
    var POSITION_DROP = 'centerAtDrop';  // staticAtDrop, centerAtDrop, original
    var LEAVE_CLONE = true;        // bool

    if(1){
		
		resultDragDrop[$(this).attr('dropkey')] = ui.draggable.attr('dragkey');

		console.log(resultDragDrop);
        if(DEACTIVATE_DRAG) 
            $(ui.draggable).draggable({"disabled":true});
			$(ui.draggable).addClass('desaturate');

        if(DEACTIVATE_DROP) 
            $(this).droppable({"disabled":true});


        if(LEAVE_CLONE){ // Create and position clone of dragged element
            var draggedClone = ui.draggable.clone(true);

            if(POSITION_DROP == 'staticAtDrop'){
                $(this).append(draggedClone.css('position','static')); // postion  of clone
                snapToStart(ui.draggable,$(this)); // return original drag 
            }
            else if(POSITION_DROP == 'centerAtDrop'){
                $(this).append(draggedClone.css({'text-align':'center', 'display':'table', 'margin-left':'auto','margin-right':'auto'}));
                snapToMiddle(draggedClone,$(this)); // center cloned
                snapToStart(ui.draggable,$(this)); // return original drag
            }
            else if(POSITION_DROP == 'original'){ // Makes no sense but .... overlaps 
                snapToStart(ui.draggable,$(this)); // return original drag
                snapToStart(draggedClone,$(this)); // return original drag
            }
        }
        else{ // Original drag object
            if(POSITION_DROP == 'staticAtDrop'){
                $(this).append(ui.draggable.css('position','static'));
                snapToMiddle(ui.draggable,$(this));
            }
            else if(POSITION_DROP == 'centerAtDrop'){
                $(this).append(ui.draggable.css('position','relative'));
                snapToMiddle(ui.draggable,$(this));
            }
            else if(POSITION_DROP == 'original'){
                snapToStart(ui.draggable,$(this)); 
            }
        }
        sg.sound('success-low');
    } // Fin MATCH OK !! 

    else{ console.log('Wrong');
        sg.sound('error');
        snapToStart(ui.draggable,$(this)); // return original drag
    }
    // Function to registrer proccess 
    // registerDrop (ui.draggable.attr('dragkey'), $(this).attr('dropkey'));
}


function initDragDrop(){

    var dragElements = $('.draggable');
    var GRUPO_DRAG = "grupouno";
    var MATCH_KEY = false;
	
    dragElements.each(function(){
        var dragKey = $(this).attr('dragkey');
        var dropPairs =  $('.droppable');
        var scope = GRUPO_DRAG + dragKey;  // Scope must be EQUAL to MATCH DRAG AND DROP

        // Force options of sg-draggable to take control !!
        var dragOpts = {  
            revert: 'invalid',
            revertDuration: 50,
        };
        $(this).draggable(dragOpts);

        dropPairs.each(function(){
           $(this).droppable({
               // scope: scope, 
               // hoverClass: "drop-hover",
                drop: proccessDrop,
				accept: '.draggable',
            });

          /* if(MATCH_KEY){  //  Match dragkey and dropkey
               $(this).droppable("option","accept",'.draggable[dragkey="'+ dragKey +'"]');
           }
           else {
               $(this).droppable("option","accept", '.draggable');
               // BOX SHADOW  CSS STYLE NEEDED 
               $(this).droppable("option","activeClass", 'boxshadow');
           }*/
        });

    })
	//$(".draggable").draggable({helper : 'clone' });
}


function snapToStart(dragger, target){
    dragger.animate({top:0,left:0},{duration:50,easing:'easeOutBack'});
} 

function snapToMiddle(dragObj, target){
	//dragObj.css({'transform':'scale(0.5)','transform-origin':'0 0'});
	dragObj.removeClass('desaturate');
    var topMove = (target.outerHeight(true) - dragObj.outerHeight(true)) / 2;
    var leftMove= (target.outerWidth(true) - dragObj.outerWidth(true)) / 2;

    dragObj.animate({top:topMove,left:leftMove},{duration:10,easing:'easeOutBack'});
	
}
function validate() {	
	correct = [];
	correct[1] = "1";
	correct[2] = "2";
	correct[3] = "3";
	correct[4] = "4";
	correct[5] = "5";
	console.log(correct);
	console.log(resultDragDrop);
	var error;
	for (var k in correct){
		if (correct.hasOwnProperty(k)) {
			 if( correct[k]!=resultDragDrop[k]) {
				 error = 1;
				 }
		}
	} 
	if(error==1){
		sg.sound('error');
			$("div[data-sg-key='10']").trigger("click");
		}else{
			sg.sound('success');
			$("div[data-sg-key='9']").trigger("click");
			}
}
function dragReset() {
	sg.resetDraggable( $('.dragcont').find("[data-sg-draggable]") );
	$('.droppable').html('');
	$('.droppable').droppable({"disabled":false});
	$('.draggable').droppable({"disabled":false});
	$('.draggable').removeClass('desaturate');
	initDragDrop();
	resultDragDrop=[];
	}	
function verificarBt1(){
	$('#txt1').html("<p>Representa: el nivel de energía<br/>Para n: números enteros 1,2,3.</p>")
	$('#txt2').html("<p>Representa: forma de los orbitales los valores de l dependen del valor del número cuáuntico principal.<br/>Para l: números enteros 0 hasta (n-1).</p>")
	$('#txt3').html("<p>Representa: la distribución del orbital en el espacio<br/>Para m: todos los números enteros entre +l y l incluido el 0.</p>")
	$('#txt4').html("<p>Representa: giro del electrón entorno a su propio eje.<br/>Para s: sólo números fraccionarios -1/2 y +1/2.</p>")
	}
	
