 /*
	user strict 명령은 엄격하게 JavaScript 룰을 적용하라는 의미이다.
	일부 브라우저의 경우 use strict 명령을 통해 보다 빠르게 동작하는 경우도 존재하는 것 같다.
	잘못된 부분에 대한 검증도 보다 엄격하게 동작한다.
	하지만, 일부 라이브러리의 경우 use strict 명령을 사용하면 동작하지 않는 경우도 있으므로 주의해야 한다.
 */
'use strict';


/*
---custom tag and attribute list---
*
	sg-init
	sg-click
	sg-draggable
	sg-drop-selector
	sg-drop-success
	sg-drop-fail
sg-btn-dhide
	sg-onimg
    sg-swapimg
    sg-init
    sg-click
    sg-call
    sg-sound
    sg-key
sg-btn-hide
	sg-onimg
    sg-swapimg
    sg-init
    sg-click
    sg-call
    sg-sound
    sg-key
sg-btn-cover
	sg-onimg
    sg-swapimg
    sg-init
    sg-click
    sg-call
    sg-sound
    sg-key
sg-btn-popup
    sg-init
    sg-click
    sg-call
    sg-sound
    sg-key
sg-btn-page
    sg-init
    sg-click
    sg-call
    sg-sound
    sg-key
	sg-group

sg-item-page
    sg-init
    sg-call
    sg-sound
    sg-key
	sg-group
sg-item-popup
    sg-init
    sg-call
    sg-sound
    sg-key
--------------------
*/

document.addEventListener("DOMContentLoaded", function(e){
	var body = document.body;
	body.style.visibility = "hidden";
	var html = body.innerHTML;
	
	/**************btn*************/
	//console.log(document.querySelectorAll("div")[0]);
	
	if( document.querySelector("sg-btn-dhide")){
		html = html.replace(/<sg-btn-dhide/g, '<div data-sg-id="btn-hide" ').replace(/<\/sg-btn-dhide>/g, '</div>');
	}
	if(document.querySelector("sg-btn-hide")){
		html = html.replace(/<sg-btn-hide/g, '<span data-sg-id="btn-hide" ').replace(/<\/sg-btn-hide>/g, '</span>');
	}
	if(document.querySelector("sg-btn-cover")){
		html = html.replace(/<sg-btn-cover/g, '<div data-sg-id="btn-cover" ').replace(/<\/sg-btn-cover>/g, '</div>');
	}
	if(document.querySelector("sg-btn-popup-close")){
		html = html.replace(/<sg-btn-popup-close/g, '<div data-sg-id="btn-popup-close" ').replace(/<\/sg-btn-popup-close>/g, '</div>');
	}
	if(document.querySelector("sg-btn-popup")){
		html = html.replace(/<sg-btn-popup/g, '<div data-sg-id="btn-popup" ').replace(/<\/sg-btn-popup>/g, '</div>');
	}
	if(document.querySelector("sg-btn-page")){
		html = html.replace(/<sg-btn-page/g, '<div data-sg-id="btn-page" ').replace(/<\/sg-btn-page>/g, '</div>');
	}
	
	
	/*************item*************/
	if(document.querySelector("sg-item-popup")){
		html = html.replace(/<sg-item-popup/g, '<div data-sg-id="item-popup" ').replace(/<\/sg-item-popup>/g, '</div>');
	}
	if(document.querySelector("sg-item-page")){
		html = html.replace(/<sg-item-page/g, '<div data-sg-id="item-page" ').replace(/<\/sg-item-page>/g, '</div>');
	}
	
		
	/*************attr*************/
	//속성에 data- 프리픽스가 없다면 추가
	var sgAttrNameReg = /\ssg([\-][\w]*){1,5}(\s)?=/gi;
	//console.log(html);
	var s1 = html.split('<');
	var s2;
	var matchArr;
	var r2 = [];
	for(var i=0; i<s1.length; i++){
		s2 = s1[i].split('>');
		for(var j=0; j<s2.length; j++){
			if(j%2==0){
				//console.log("s2", s2[j]);
				matchArr = s2[j].match(sgAttrNameReg);
				//console.log(matchArr);
				if(matchArr){
					for(var k=0; k<matchArr.length; k++){
						//console.log(k, matchArr[k]);
						s2[j] = s2[j].replace(matchArr[k], " data-" + matchArr[k].substr(1));
					}
				}
			}
		}
		//console.log("s22",s2.join('>'));
		r2.push(s2.join('>'));
	}
	//console.log(r2.join('<'));
	html = r2.join('<');
	
	body.innerHTML = html;
	body.style.visibility = "visible";
	
	var stage = document.getElementById("stage");
	var progressImg = new Image();
	progressImg.id = "progressImg";
	progressImg.src = sg.relativeRootPath + "/img/progress_circle.gif";
	progressImg.style.position = "absolute";
	progressImg.style.left = ((window.innerWidth-32)*0.5) + "px";
	progressImg.style.top = ((window.innerHeight-32)*0.5) + "px";
	document.body.appendChild(progressImg);
});



var initList = initList || [];

var sg = window.sg = sg || {};
sg.relativeRootPath = sg.relativeRootPath || "../../common";
sg.skinPath = sg.skinPath || "";
var soundUrlList = {
	"success": sg.relativeRootPath + "/sounds/success.mp3",
	"success-low": sg.relativeRootPath + "/sounds/success-low.mp3",
	"error": sg.relativeRootPath + "/sounds/error.mp3"
};



requirejs.config({
	//html파일 기준으로
	baseUrl:sg.relativeRootPath,
	paths:{
		'text': 'lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
		'jquery': 'lib/jquery/jquery-1.11.1.min',
		'jquery-ui': 'lib/jquery/jquery-ui-1.10.4.custom.min',//jquery-ui-1.10.2.min',
		'jquery-ui-touchpunch': 'lib/jquery/jquery.ui.touch-punch.min',
		'jquery-regex': 'lib/jquery/jquery.regex',
		'jquery-drag': 'lib/jquery/jquery.event.drag-2.2',
		'jquery-hittest': 'lib/jquery/e-smart-hittest-jquery',
		'jquery-easytabs': 'lib/jquery/jquery.easytabs.custom',//jquery.easytabs.min',
		'jquery-fancybox': 'lib/jquery/fancybox/jquery.fancybox',
		'jquery-scrollLock': 'lib/jquery/jquery.scrollLock',
		//'jquery-cycle': 'lib/jquery/jquery.cycle2.min',
		'jquery-ionsound': 'lib/jquery/ion.sound',
		//'jquery-spin': 'lib/jquery/jquery.spin',
		//'angular': 'lib/angular/angular.min',
		//'spin': 'lib/utils/spin.min',
		'json': 'lib/json3/json3',
		//'app': 'js/app',
		'util': 'lib/tj/tj.utils'
		
		//'progress': 'lib/progress/ProgressCircle.min'
	},
	
/*
	shim:
	AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
	참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
*/
	shim:{
		/*
		'angular':{
			deps:['jquery'],
			exports:'angular'
		},
		*/
		'jquery-regex':{
			deps:['jquery']
		},
		'jquery-ui':{
			deps:['jquery']
		},
		'jquery-ui-touchpunch':{
			deps:['jquery-ui']
		},
		'jquery-fancybox':{
			deps:['jquery']
		},
		'jquery-drag':{
			deps:['jquery']
		},
		'jquery-hittest':{
			deps:['jquery']
		},
		/*,
		'jquery-cycle':{
			deps:['jquery']
		},
		*/
		'jquery-scrollLock':{
			deps:['jquery']
		},
		'jquery-easytabs':{
			deps:['jquery']
		},
		'jquery-ionsound':{
			deps:['jquery']
		}
		/*
		'app':{
			deps:['angular']
		}
		*/
	}
});



/*
var hit = targetObject.hitTestObject({"object":otherObject, "transparency":true});
var hit = $('#mouseImgHittest').hitTestPoint({"x":e.pageX,"y":e.pageY, "transparency":true});
*/


//for use angular
//requirejs( ['jquery', 'json', 'angular',  'app', 'jquery-regex', 'jquery-ui', 'jquery-snd', 'jquery-drag', 'util'], function ($, JSON, angular, app) {
	//'jquery-cycle'
requirejs( ['jquery', 'json', 'jquery-regex', 'jquery-ui', 'jquery-drag', 'jquery-hittest', 'jquery-ui-touchpunch', 'jquery-easytabs',  'jquery-ionsound', 'jquery-fancybox', 'jquery-scrollLock', 'util'], function ($, JSON3) {
	/*
	requirejs(['js/kit/inputKitComp.js'], function(ikit){
		app.controller('inputTypeController', ['$scope', '$element', function($scope, $element){
			$scope.answer = [];
			$scope.answerStr = "";
			$scope.getAnswer = function(){
				$scope.answerString = $scope.answer.join(',');
			};
			$scope.checkAnswer = function(){
				alert(ikit.check($scope.answer, ['a','b','c'], {freeOrderJudge: ["0,1"]}));
			};
			$scope.inputAnswer = function(){
				$scope.answer = $scope.answerString.split(',');
			};
			
			
			
			console.log($element.attr("ng-controller"));
			console.log($element.scope());
			
			//최상위 부모 컨트롤러인 CommonController에서 하위의 컨트롤러들을 잡아낼수 있으면, 그렇게 하는것이 편하고 옳은방법일듯.
			//그게 아니라면, jQuery셀렉터에서 ng-controller가 특정 유형이름인것들을 모두 잡아내야 하나..
			
		}]);
		angular.bootstrap(document, ['myApp']);
	});
	*/
	
	
	//console.log("?");
	
	//angular.bootstrap(document, ['myApp']);
	
	$(document).ready(function () {
		//$(document).bind("startdrag", function(e){return false;});
		
		var JSON = JSON || JSON3;
		var $body = window.$body = $("body");
		var $stage = window.$stage = $("#stage");
		var $content = window.$content = $("#content");
		var $window = $(window);
		
		//console.log("ready");
		
		////scale mode////
		//scrollbar w,h 20
		sg.zidx = 1;
		
		//console.log($stage[0].style.transform);
		function getStageScale(){
			var matrixStr = $stage.css("transform");
			if(matrixStr){
				var matrix = JSON.parse($stage.css("transform").replace("matrix(","[").replace(")","]"));
				//console.log(matrix);
				sg.scaleX = matrix[0];
				sg.scaleY = matrix[3];
			}else{
				sg.scaleX = sg.scaleY = 0;
			}
		}
		
		function setScaleStyle($target, scalemode){
			var ww = window.innerWidth;
			var hh = window.innerHeight;
			
			switch(scalemode){
				case "showall":
					var msc = Math.min(ww / sg.sw, hh / sg.sh);
					
						$target.css({
							"transform":"scale("+msc+")",
							"transform-origin":"0 0",
							"left":((ww-sg.sw*msc)*0.5)+"px",
							"top":((hh-sg.sh*msc)*0.5)+"px"
						});

					
					
					//$target.parent().height($target.height()*msc);
				break;
				
				case "noscale":
				break;
				
				case "exactfit":
					$target.css({
						"transform":"scale("+(ww / sg.sw)+","+(hh / sg.sh)+")",
						"transform-origin":"0 0"
					});
				break;
			}
		};
		
		function setStageScaleStyle($target, scalemode){
			var ww = window.innerWidth;
			var hh = window.innerHeight;
			var ch = $content.height() + pxToNum($content.css("margin-top")) + pxToNum($content.css("margin-bottom"));
			//console.log($content.height() , pxToNum($content.css("margin-top")) , pxToNum($content.css("margin-bottom")));
			switch(scalemode){
				case "showall":
				
					var msc = Math.min(ww / sg.sw, hh / sg.sh);
					
					//stage높이보다 content높이가 크다면, 컨텐츠의 일부가 보여질때는 top 0 부터 정렬하면서 스크롤가능하게하고,
					//컨텐츠의 전부가 보여질때는 세로 가운데정렬 하면서 스크롤을 없애자
					//console.log(ch, sg.sh);
					//if(ch>=sg.sh){
					if(ch-sg.sh <= 1){//오차 1허용
						if(ch*msc>hh){
							//console.log("top 0, overflow:visible");
							$target.css({
								"transform":"scale("+msc+")",
								"transform-origin":"0 0",
								"left":((ww-sg.sw*msc)*0.5)+"px",
								"top":0
							});
							
							
							
							$target.parent().css({
								"overflow-y":"visible"
							});
							$.scrollLock(false);
							
						}else{
							//console.log("top center, overflow:hidden");
							$target.css({
								"transform":"scale("+msc+")",
								"transform-origin":"0 0",
								"left":((ww-sg.sw*msc)*0.5)+"px",
								"top":((hh-ch*msc)*0.5)+"px"
							});
							
							$target.parent().css({
								"overflow-y":"hidden"
							});
							$.scrollLock(true);
						}
					}else{
						//console.log("top center, overflow:auto");
						$target.css({
							"transform":"scale("+msc+")",
							"transform-origin":"0 0",
							"left":((ww-sg.sw*msc)*0.5)+"px",
							"top":((hh-sg.sh*msc)*0.5)+"px"
						});
						
						$target.parent().css({
							"overflow-y":"auto"
						});
						$.scrollLock(false);
					}
					
					
					//$target.parent().height($target.height()*msc);
				break;
				
				case "noscale":
				break;
				
				case "exactfit":
					$target.css({
						"transform":"scale("+(ww / sg.sw)+","+(hh / sg.sh)+")",
						"transform-origin":"0 0"
					});
				break;
			}
		};
		
		
		/*************************************** 컨텐츠 제작시.. html 페이지에서 사용할만한 것들 **********************************************/
		
		sg.enabled = function enabled(elementOrSelector){
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","pointer");
				var options = $this.data("options") || {};
				options.enabled = true;
				$this.data("options", options);
			});
		}
		
		sg.disabled =function disabled(elementOrSelector){		
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","default");
				var options = $this.data("options") || {};
				options.enabled = false;
				$this.data("options", options);
			});
		}
		
		sg.hide = function(elementOrSelector){
			$(elementOrSelector).hide();
		}
		sg.show = function(elementOrSelector){
			$(elementOrSelector).show();
		}
		sg.fadeIn = function(elementOrSelector){
			$(elementOrSelector).fadeIn("slow");
		}
		sg.fadeOut = function(elementOrSelector){
			$(elementOrSelector).fadeOut("slow");
		}
		
		
		/****************************************  전처리   ******************************************/
		
		
		//---------------------------------------------클래스 이름 처리----------------------------------------
		function ccp(className){
			//끝에 붙은 숫자만 제거하면 key
			 var key = className.replace(/-?[0-9]{0,4}%?$/, '');
			 var value = className.replace(key, '');
			 switch(key){
				 case "sg-font": return {"font-size": value + "pt"};
				 case "sg-mg":
				 case "sg-margin": return {"margin": value + "px"};
				 case "sg-mgL":
				 case "sg-marginL": return {"margin-left": value + "px"};
				 case "sg-mgT":
				 case "sg-marginT": return {"margin-top": value + "px"};
				 case "sg-mgR":
				 case "sg-marginR": return {"margin-right": value + "px"};
				 case "sg-mgB":
				 case "sg-marginB": return {"margin-bottom": value + "px"};
				 case "sg-pd":
				 case "sg-padding": return {"padding": value + "px"};
				 case "sg-pdL":
				 case "sg-paddingL": return {"padding-left": value + "px"};
				 case "sg-pdT":
				 case "sg-paddingT": return {"padding-top": value + "px"};
				 case "sg-pdR":
				 case "sg-paddingR": return {"padding-right": value + "px"};
				 case "sg-pdB":
				 case "sg-paddingB": return {"padding-bottom": value + "px"};
				 
				 case "sg-w":
				 case "sg-width": return {"width": value + ((value.indexOf("%") > -1) ? "" : "px")};
				 case "sg-h":
				 case "sg-height": return {"height": value + ((value.indexOf("%") > -1) ? "" : "px")};
				 case "sg-x": return {"left": value + ((value.indexOf("%") > -1) ? "" : "px")};
				 case "sg-y": return {"top": value + ((value.indexOf("%") > -1) ? "" : "px")};
				 
				 case "sg-scaleX": return {"transform": "scale(" + (value/100) + ")"};
				 case "sg-scaleY": return {"transform": "scaleX(" + (value/100) + ")"};
				 case "sg-scale": return {"transform": "scale(" + (value/100) + "," + (value/100) + ")"};
				 
				 case "sg-offsetX": return {"margin-left": value + "px"};
				 case "sg-offsetY": return {"margin-right": value + "px"};
				 case "sg-r":
				 case "sg-radius": return {"border-radius": value + "px"};
				 case "sg-rLT":
				 case "sg-radiusLT": return {"border-top-left-radius": value + "px"};
				 case "sg-rLB":
				 case "sg-radiusLB": return {"border-bottom-left-radius": value + "px"};
				 case "sg-rRT":
				 case "sg-radiusRT": return {"border-top-right-radius": value + "px"};
				 case "sg-rRB":
				 case "sg-radiusRB": return {"border-bottom-right-radius": value + "px"};
				 case "sg-b":
				 case "sg-bold": return value.length ? {"font-weight": value} : {"font-weight": "bold"};
				 case "sg-alpha":
				 case "sg-opacity": return {"opacity": value/100};
				 
				 default: return null;
			 }
		}
		
		$("[class]").each(function(i, e){
			var $me = $(this);
			var cns = this.className.split(' ');
			var rcns = [];
			var cn;
			var cssObj;
			
			while(cns.length){
				//왼쪽 class부터 실행
				cn = cns.shift();
				cssObj = ccp(cn);
				if(cssObj){
					$me.css(cssObj);
				}else{
					rcns.push(cn);
				}
			}
			this.className = rcns.join(' ');
		});
		//---------------------------------------------------------------------------------------------------------
		
		
		//----------------------------------------------------------------------------------------------------------
		
		//img>id:popupBtn
		//img태그로 만들어 글자들과 섞여진상태로 쓰는 팝업 버튼에대해서, src경로를 html에 박히게 하지 않기 위해..
		/*
		var $imgPopbtn = $("img[id=popupBtn]");
		if($imgPopbtn.attr("src") == undefined){
			$imgPopbtn.attr("src",sg.skinPath + "/img/tip_icon.png");
		}
		*/
		
		/////overlap.. 겹치는 요소 셋팅
		//자식들을 첫번째 요소만 남기고 숨기자. 첫번째요소는 보여져야할 기본요소.
		
		//$(":regex(data-sg-id,\\b"+"overlap"+"[0-9]{0,2}\\b)")
		$("[data-sg-id=overlap]")
		.each(function(i,e){
			$(this).children(":not(:eq(0))").hide();
		});
		
		
		
		//속성에 sg-click이 있는 태그들의 버튼동작 설정
		
		
		
		$("[data-sg-init]")
		.each(function(i,e){
			var com = $(this).attr("data-sg-init");
			if(com) eval(com);
		});
		
		
		///////////////////////////////drag attr func/////////////////////
		function calculatePosition(objElement, strOffset){
			var iOffset = 0;
			if (objElement.offsetParent){
				do{
					iOffset += objElement[strOffset];
					objElement = objElement.offsetParent;
				} while (objElement);
			}
			return iOffset;
		}
		
		sg.setDraggable = function (selector, options){
				
			/*
			var defaultOption = {
				revert: null,
				success: null,
				fail: null,
				dropSelector:null
			}
			*/
			//console.log(options);
			var options = options || {};
			//console.log(options);
			//var cloneVal;
			$(selector)
			.each(function(i,e){
				var $this = $(this);
				var draggableOptions = {
					dropSelector: options.dropSelector || $this.attr("data-sg-drop-selector"),
					revert: (function(){
						var r = options.revert || $this.attr("data-sg-revert");
						return typeof r === "string" ? JSON.parse(r) : r;
					})(),
					fail: options.fail || $this.attr("data-sg-drop-fail"),
					success: options.success || $this.attr("data-sg-drop-success"),
					clone: (function(){
						//console.log(options.clone);
						var r = options.clone || $this.attr("data-sg-clone");
						//console.log(r, typeof r === "string");
						return typeof r === "string" ? JSON.parse(r) : r;
					})()
				};
				
				//cloneVal = draggableOptions.clone ? "clone" : undefined;
				//console.log(cloneVal);
				//console.log(draggableOptions);
				
				$this.attr("data-sg-drop-selector", draggableOptions.dropSelector);
				$this.attr("data-sg-revert", draggableOptions.revert);
				$this.attr("data-sg-drop-fail", typeof draggableOptions.fail === "string" ? draggableOptions.fail : "");
				$this.attr("data-sg-drop-success", typeof draggableOptions.success === "string" ? draggableOptions.success : "");
				$this.attr("data-sg-clone", draggableOptions.clone);
				//console.log(draggableOptions.clone ? "clone" : undefined);
				$this.data("draggableOptions", draggableOptions);
				
				$this.data("originPos",{
					left: this.offsetLeft,
					top: this.offsetTop
				});
				
				//잔상 제거효과있음
				$this.css("overflow", "hidden");
				
				///////////////////////////draggable////////////////////////////////////
				$this.draggable( {
					
					helper: (function(){
						return draggableOptions.clone ? "clone" : undefined;
					})(),
					cursor: 'pointer',
					revert: function(){
						//console.log(this);
						$.scrollLock(false);
						var options = this.data("draggableOptions");
						//console.log(options);
						var failAction = options.fail;
						var successAction = options.success;
						var dropselector = options.dropSelector;
						var bool = options.revert;
						var isClone = options.clone;
						
						/*
						bool = (options.revert == undefined) ? 
							(this.attr("data-sg-revert") == "true" ? true : false)
							:options.revert;
						failAction = options.fail || this.attr("data-sg-drop-fail");
						successAction = options.success || this.attr("data-sg-drop-success");
						dropselector = options.dropSelector || this.attr("data-sg-drop-selector");
						
						bool = options.revert == "true" ? true : false;
						*/
						
						var hit = false;
						//console.log($(this).data("cloneTarget"));
						var rect = (this.data("cloneTarget") || this).getRect();
						if(dropselector){
							//드랍체크.  드래그 대상의 가운데 좌표가 드랍대상안에 들어오는지 확인
							$(dropselector).each(function(i, e){
								if(hit) return;
								
								hit = $(this).hitTestPoint({
									x:rect.x + rect.width * 0.5 * sg.scaleX,
									y:rect.y + rect.height * 0.5 * sg.scaleY,
									transparency:false,
									scaleX: sg.scaleX,
									scaleY: sg.scaleY
								});
								/*
								hit = $(this).hitTestObject({
									selector: this,
									transparency: false,
									scaleX: sg.scaleX,
									scaleY: sg.scaleY
								});
								*/
							});
							
							//console.log(hit);
						}
						
						/*
						스케일이 줄어든 상태에서 jQuery의 offset이 제대로 동작하지 않는다.
						드래그객체의 복사본을 만들고, 절대 좌표값으로 드랍대상의 가운데에 위치하도록 하자.
						
						절대좌표값을 갖는 복사본을 만드는 이유는, relative상태로 드랍대상의 위치를 계산하기 힘들기 때문.
						현재 드래그객체를 absolute로 바꾸면 빈자리를 체우기위해 이하 DOM요소들이 올라온다.
						*/
						
						
						if(hit){
							//bool = false;
							
							var soff = $stage.offset();
							var $clone = this.clone()
							.css("position", "absolute")
							.appendTo($stage).css({
								left:calculatePosition(hit[0],"offsetLeft") + ( hit.width() - this.width() ) * 0.5 - soff.left,
								top:calculatePosition(hit[0],"offsetTop") + ( hit.height() - this.height() ) * 0.5 - soff.top
							});
							//console.log(hit);
							$clone.data("hit", hit);
							hit.data("dragObj", $clone);
							
							//#140721
							var cloneObjs = this.data("cloneObjs") || [];
							cloneObjs.push($clone);
							this.data("cloneObjs", cloneObjs);
							//#######
							
							if(!isClone){
								this.css("visibility", "hidden");//.draggable("disable");
							}
							
							if(successAction){
								if(typeof successAction == "function"){
									successAction.apply($clone[0]); 
								}else{
									eval(successAction);
								}
							}
						}else if(!hit && failAction){
							if(typeof failAction == "function"){
								failAction.apply(this[0]); 
							}else{
								eval(failAction);
							}
						}
						
						if(bool && this.css("position") == "absolute"){
							bool = false;
							this.animate(this.data("originPos"));
						}
						return bool;
					},
					start : function(e, ui){
						$.scrollLock(true);
						//console.log(ui.helper);
						if($(this).css("position") != "absolute"){
							ui.position.left *= sg.scaleX;
							ui.position.top *= sg.scaleY;
						}
						
						$(this)
						.data("disPos", {
							left: ui.position.left - e.clientX,
							top: ui.position.top - e.clientY
						}).css("z-index", sg.zidx++);
						
						var op = $(this).data("draggableOptions");
						if(op && op.clone){
							$(this).data("cloneTarget", ui.helper);
						}
					},
					drag: function(e, ui){
						var disPos = $(this).data("disPos");
						ui.position = {
							left: (disPos.left + e.clientX) / sg.scaleX,
							top: (disPos.top + e.clientY) / sg.scaleY
						};
						
					}
				});
				
			})
			
		}
		
		sg.setDraggable("[data-sg-draggable]");
		
		//#140721
		sg.resetDraggable = function( selector ){
			//console.log(selector);
			$(selector).each(function(i,e){
				var $this = $(this);
				var dragObjs = $this.data("cloneObjs");
				//console.log(dragObjs);
				for(var o in dragObjs) dragObjs[o].remove();
				var dropSelector = $this.attr("data-sg-drop-selector");
				$this.css("visibility", "visible");
				if(dropSelector){
					$(dropSelector).each(function(i,e){
						$(this).data("dragObj", null);
					});
				}
			});
		}
		
		sg.destroyDraggable = function( selector ){
			sg.resetDraggable( selector );
			$( selector ).draggable( "disable" );
		}
		//########
		
		
		/****************************************** 이벤트 **********************************/
		
		//앵귤러 문법으로 html페이지에서 사용할 폭,너비 변수들 //resize이벤트때마다 갱신하자
		/*
		function setWindowSizeInfo(){
			var scope = angular.element($body[0]).scope();
			scope.$apply(function(){
				scope.winWidth = window.innerWidth;
				scope.winHeight = window.innerHeight;
				scope.bodyWidth = $body.width();
				scope.bodyHeight = $body.height();
				scope.contentBodyWidth = $content.width();
				scope.contentBodyHeight = $content.height();
			});
		}
		*/
		
		
		
		
		
		
		/**************************************** sg function ***************************************/
		//태그의 sg-call속성에 있는 자바스크립트 실행///////*함수명으로 함수호출*/
		function sg_call(element){
			if(!element){
				throw "sg_call에서 element값이 " + element;
				return;
			}
			//var fnNames = element.dataset["sgCall"];
			var fnNames = element.getAttribute("data-sg-call");
			if(fnNames){
				eval(fnNames);
			}
		}
		
		//현재.. hideBtn의 속성값 sg-onimg에 동작. //sg-onimg에는 id가 들어옴
		//flag에따라 보이고 숨기고 함
		function sg_onImg(element, flag){
			if(!element){
				throw "sg_onImg에서 element값이 " + element;
				return;
			}
			//var onimgSelector = element.dataset["sgOnimg"];
			var onimgSelector = element.getAttribute("data-sg-onimg");
			if(onimgSelector != undefined){
				if(flag) $(onimgSelector).show();
				else $(onimgSelector).hide();
			}
		}
		
		//현재.. hideBtn의 속성값 sg-swapimg에 동작. //sg-swapimg에는 selector가 들어옴
		//해당 img태그는 sg-src 속성값을 가지고, src와 스왑시켜 이미지를 바꿈
		function sg_swapImg(element, playFlag){
			if(!element){
				throw "sg_swapImg에서 element값이 " + element;
				return;
			}
			//var swapimgSelector = element.dataset["sgSwapimg"];
			var swapimgSelector = element.getAttribute("data-sg-swapimg");
			if(swapimgSelector != undefined){
				
				if(playFlag) sg.swapImg(swapimgSelector);
				else{
					var img = new Image();
					img.src = $(swapimgSelector).attr("data-sg-src");
					try{
						img.load();
					}catch(e){console.log(e)};
					//$('<img src="' + $(swapimgSelector).attr("data-sg-src") + '" />');//preload
				}
			}
		}
		
		sg.swapImg = function swapImg(elementOrSelector){
			var $img = $(elementOrSelector);
			$img.each(function(i, e){
				/*
				if(this.dataset["sgSrc"]){
					var tempSrc = this.src;
					this.src = this.dataset["sgSrc"];
					this.dataset["sgSrc"] = tempSrc;
				}
				*/
				var $me = $(this);
				var tempSrc = $me.attr("src");
				$me.attr("src", $me.attr("data-sg-src"));
				$me.attr("data-sg-src", tempSrc);
			});
		}
		
		
		/*
		태그속성 이름은 data-sg-sound
		함수사용시 sg.sg_sound
		
		sg.sg_sound(태그나 사운드경로, 플레이여부:true, 이름:undefined); //첫번째 인자만 필수
		태그를 인자로 넣을 경우 태그에서 data-sg-sound속성에 있는 사운드경로를 참조함.
		*/
		var sounds = [];
		function getSoundObj(url){
			var i,len=sounds.length;
			for(i=0; i<len; i++){
				//console.log(url, sounds[i].getAttribute("data-relativeSrc"));
				if(url == sounds[i].getAttribute("data-relativeSrc")){
					return sounds[i];
				}
			}
			return null;
		}
		function sg_sound(elementOrPath, playFlag, setName){
			if(!elementOrPath){
				throw "sg_sound에서 element값이 " + elementOrPath;
				return;
			}
			
			var soundName;
			var soundUrl;
			var $element;
			//console.log(element);
			//console.log(typeof element);
			if(typeof elementOrPath === "string"){
				//is url
				soundName = elementOrPath;
			}else{
				soundName = elementOrPath.getAttribute("data-sg-sound");
			}
			
			//var soundName = element.dataset["sgSound"];
			if(soundName){
				if(soundUrlList[soundName]){
					//UrlList에 있는 사운드 이름이면
					soundUrl = soundUrlList[soundName];
				}else{
					soundUrl = soundName;
					if(setName){
						soundUrlList[setName] = soundUrl;
					}
				}
				
				var audio = getSoundObj(soundUrl);
				
				if(!audio){
					audio = new Audio();//$('<audio src="' + soundUrl + '"/>')[0];
					audio.src = soundUrl;
					audio.setAttribute("data-relativeSrc", soundUrl);
					audio.load();
					sounds.push(audio);
				}
				if(playFlag == true || playFlag == undefined){
					try{
						audio.currentTime = 0;
					}catch(e){}
					audio.play();
				}
			}
		}
		
		sg.sound =  sg_sound;
		
		/*
		sg.playSound = function playSound(element){
			var audio = $(element).data("audio");
			if(audio) audio.play();
		}
		*/
		/****************************************  버튼 셋팅 *****************************************/
		/*
		 * target	: seletor or object
		 * abil		: string of ability list
		 */
		function btnInit(target, abil){
			var $me = $(target);
			var options = getOptions(target);
			$me.data("options", options);
			$me.data("isSg", true);
			
			if(options.enabled) $me.css("cursor","pointer");
			else $me.css("cursor","default");
			
		}
		
		//인터렉션 요소의 옵션을 json으로 파싱
		function getOptions(element){
			if(!element){
				throw "getOptions에서 element값이 " + element;
				return;
			}
			//옵션이 없을 경우 입힐 기본옵션 정의
			var defaultOptions = {
				loop: true, //인터렉션 요소의 일회성, 반복성 결정.
				enabled: true //버튼활성유무
			};
			
			//var optionJson = element.dataset["sgOptions"];
			var optionJson = element.getAttribute("data-sg-options");
			var options = optionJson ? JSON.parse(optionJson) : {};
			for(var o in defaultOptions){
				if(options[o] == undefined) options[o] = defaultOptions[o];
			}
			return options;
		}
		
		//
		function pxToNum(str){
			if(typeof str == "string"){
				return parseInt(str.replace("px",""), 10);
			}else return 0;//throw str + " is no pixel string.";
		}
		window.pxToNum = pxToNum;
		
			
		
		/////////////////////////////COVER//////////////////////
		//var $coverBtns = $(":regex(data-sg-id,\\b"+"btn-cover"+"[0-9]{0,2}\\b)");
		/*
		$("[data-sg-id=btn-cover]")
		.click(function(e){
			var $me = $(this);
			var options = $me.data("options");
			if(!options.enabled) return;
			var flag = $me.data("visible");
			if(!flag){
				$me.data("cover").css("visibility","hidden");
				$me.data("coverItem").css("visibility","visible");
			}else{
				$me.data("cover").css("visibility","visible");
				$me.data("coverItem").css("visibility","hidden");
			}
			$me.data("visible",!flag);
			
			//반복실행가능 여부
			if(options.loop == false) $me.unbind("click").css("cursor","auto");
			
			//visible값을 이미지 숨김 보임으로 연결
			sg_onImg(this, !flag);
			
			//연결된 이미지를 swap기능 수행
			sg_swapImg(this);
			
			sg_call(this);
			//음원속성이 있다면 재생
			sg_sound(this, true);
		}).each(function(i,e){
			btnInit(this);
			var $me = $(this);
			var options = $me.data("options");
			$me.data("visible", options.visible || false);//undefined라면 false넣기위해
			var $coverItem = $('<div id="coverItem"></div>');
			$me.html($coverItem.html($me.html()));
			var $cover = $('<div id="cover"></div>').width($coverItem.width()).height($coverItem.height());
			$me.data("cover", $cover).data("coverItem",$coverItem);
			$coverItem.before($cover);
			
			function resizeHandle(){
				$cover.width($coverItem.width()).height($coverItem.height());
			}
			$window.bind("resize", resizeHandle);
			
			//onimg 동기화
			sg_onImg(this, options.visible);
			//음원속성이 있다면 프리로드
			sg_sound(this);
		}).bind("mousedown", function(){return false;});
		*/
		$("[data-sg-id=btn-cover]")
		.click(function(e){
			var $me = $(this);
			var options = $me.data("options");
			if(!options.enabled) return;
			var flag = $me.data("visible");
			if(!flag){
				$me.data("cover").css("visibility","hidden");
			}else{
				$me.data("cover").css("visibility","visible");
			}
			$me.data("visible",!flag);
			
			//반복실행가능 여부
			if(options.loop == false) $me.unbind("click").css("cursor","auto");
			
			//visible값을 이미지 숨김 보임으로 연결
			sg_onImg(this, !flag);
			
			//연결된 이미지를 swap기능 수행
			sg_swapImg(this, true);
			
			sg_call(this);
			//음원속성이 있다면 재생
			sg_sound(this);
		}).each(function(i,e){
			btnInit(this);
			var $me = $(this);
			var options = $me.data("options");
			$me.data("visible", options.visible || false);//undefined라면 false넣기위해
			var $cover = $('<div id="cover"></div>');
			//console.log(this.className);
			$cover[0].className += " " + this.className;
			this.className = "";
			$me.data("cover", $cover);
			$me.append($cover);
			
			//onimg 동기화
			sg_onImg(this, options.visible);
			//스왑이미지 프리로드
			sg_swapImg(this, true);
			//음원속성이 있다면 프리로드
			sg_sound(this, false);
		}).bind("mousedown", function(){return false;});
		
		
		//////////hideBtn remake////////////////////////////////////////////////
		//$(":regex(data-sg-id,\\b"+"btn-hide"+"[0-9]{0,2}\\b)")
		$("[data-sg-id=btn-hide]")
		.each(function(i,e){
			btnInit(this);
			var $me = $(this);
			var $child = $('<span></span>');
			$child.html($me.html()).css("visibility","hidden").html();
			$me.html("").append($child);
			var options = $me.data("options");
			$me.data("visible", options.visible || false);//undefined라면 false넣기위해
			$me.data("$child", $child);
			
			//onimg 동기화
			sg_onImg(this, options.visible);
			
			//스왑이미지 프리로드
			sg_swapImg(this, true);

			//음원속성이 있다면 프리로드			
			sg_sound(this, false);
		}).click(function(e){
			
			var $me = $(this);
			//console.log($me.data("key"));
			var options = $me.data("options");
			if(!options.enabled) return;
			
			var $child = $me.data("$child");
			var flag = $me.data("visible");
			//console.log($child);
			//console.log(flag?"hidden":"visible");
			$child.css("visibility", flag?"hidden":"visible");
			$me.data("visible",!flag);
			
			//반복실행가능 여부
			if(options.loop == false) $me.unbind("click").css("cursor","auto");
			
			//visible값을 이미지 숨김 보임으로 연결
			sg_onImg(this, !flag);
			
			//연결된 이미지를 swap기능 수행
			sg_swapImg(this, true);
			
			//실행 스크립트
			sg_call(this);
			
			//음원속성이 있다면 재생
			sg_sound(this);
		}).bind("mousedown", function(){return false;});
		
		
		
		////////////////////////////////////////////////////////////////////////
		var pageIdxs = {};
		//var pageIdx = 0;
		var pageLen = 0;
		var $pageBtns = $("[data-sg-id=btn-page]");//$(":regex(data-sg-id,\\b"+"btn-page"+"([0-9]{0,2}|Next|Prev)\\b)");
		if($pageBtns.length){
			var $pageItems = $("[data-sg-id=item-page]");//$(":regex(data-sg-id,\\b"+"item-page"+"[0-9]{0,2}\\b)");
			$pageItems.each(function(i,e){
				//음원속성이 있다면 프리로드
				sg_sound(this, false);
			}).not("[data-sg-key=1]").hide();
			//pageLen = $pageItems.length;
			//console.log($pageItems);
			//console.log($pageBtns);
		}
		
		$pageBtns
		.each(function(i,e){
			btnInit(this);
			var $me = $(this);
			var options = $me.data("options");
			if(options.visible == true) $me.show();
			else if(options.visible == false) $me.hide();
			
			var groupkey = this.getAttribute("data-sg-group");
			var groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : "";
			var pageIdx = pageIdxs[groupkey] = 0;
			
			var $nextbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=next]");
			var $prevbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=prev]");
			if( pageIdx-1 < 0 ){
				if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
				if($prevbt.length) sg.disabled($prevbt.addClass("off"));
			}else if( pageIdx+1 > pageLen-1 ){
				if($nextbt.length) sg.disabled($nextbt.addClass("off"));
				if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
			}else{
				if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
				if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
			}
			//음원속성이 있다면 프리로드
			sg_sound(this, false);
		})
		.click(function(){
			var $me = $(this);
			var options = $me.data("options");
			if(!options.enabled) return;
			
			//var idkey = $me.attr("data-sg-id").match( /([0-9]{0,2}|Next|Prev)$/ )[0];//this.id.match( /([0-9]{0,2}|Next|Prev)$/ )[0];
			//var idkey = this.dataset["sgKey"];
			var idkey = this.getAttribute("data-sg-key");
			var groupkey = this.getAttribute("data-sg-group");
			var groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : "";
			var $page;
			var pageIdx = pageIdxs[groupkey];
			//console.log(pageIdx);
			
			var pageLen = $("[data-sg-id=item-page]" + groupSelector).length;
			
			var callFlag = false;
			
			if( idkey == "next" ) {
				if( pageIdx+1 < pageLen ) {
					if(groupkey) $pageItems.filter(groupSelector).hide();
					else $pageItems.hide();
					
					pageIdx++;
					$page = $pageItems.filter( groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" );
					if($page.length == 0){
						throw groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" + "is none.";
					}else{
						$page.show();
						callFlag = true;
					}
					
					
				}
			}else if( idkey == "prev" ){
				if( pageIdx-1 >= 0 ) {
					if(groupkey) $pageItems.filter(groupSelector).hide();
					else $pageItems.hide();
					pageIdx--;
					$page = $pageItems.filter( groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" );
					if($page.length == 0){
						throw groupSelector + "[data-sg-key=" + (pageIdx+1) + "]" + "is none.";
					}else{
						$page.show();
						callFlag = true;
					}
				}
			}else{
				if(groupkey) $pageItems.filter(groupSelector).hide();
				else $pageItems.hide();
				pageIdx = parseInt( idkey, 10 ) - 1;
				$page = $pageItems.filter( groupSelector + "[data-sg-key=" + idkey + "]" );
				if($page.length == 0){
					throw groupSelector + "[data-sg-key=" + idkey + "]" + "is none.";
				}else{
					$page.show();
					callFlag = true;
				}
			}
			
			//prev next버튼이 있을 때 active, deactive 처리
			var $nextbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=next]");
			var $prevbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=prev]");
			if( pageIdx-1 < 0 ){
				if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
				if($prevbt.length) sg.disabled($prevbt.addClass("off"));
			}else if( pageIdx+1 > pageLen-1 ){
				if($nextbt.length) sg.disabled($nextbt.addClass("off"));
				if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
			}else{
				if($nextbt.length) sg.enabled($nextbt.removeClass("off"));
				if($prevbt.length) sg.enabled($prevbt.removeClass("off"));
			}
			
			pageIdxs[groupkey] = pageIdx;
					
			//console.log($page);
			
			//IE css렌더 버그.. line-height의 사이즈가 박스쉐도우의 그림자부분에 겹칠때, display:none을 해도 그림자가 남는현상 해결위한 선택.. 배경의 css랜더링위함
			$body.css("background-color",$body.css("background-color"));
			
			//window resize 이벤트를 수신하는 놈들을 위해 페이지 변경시, 디스패치
			$window.trigger("resize");
			
			if(callFlag){
				sg_call( $page[0] );
				//음원속성이 있다면 재생
				sg_sound( $page[0] );
			}
			
			sg_call(this);
			//음원속성이 있다면 재생
			sg_sound(this);
		});
		
		
		
		//////////////////////////////////////////////////////////
		var $currentPopup;
		var $popupBtns = $("[data-sg-id=btn-popup]");//$(":regex(data-sg-id,\\b"+"btn-popup"+"[0-9]{0,2}\\b)");
		var $popupBg;
		
		
		function popupHandle(){
			var $me = $(this);
			var options = $me.data("options");
			if(!options.enabled) return;
			
			//var key = this.id.replace(/-?[0-9]{0,4}%?$/, '');
			//var id = this.id.replace(//, '');
			//console.log(this.id.match(/[0-9]{0,4}%?$/));
			//var idx = $me.attr("data-sg-id").match(/[0-9]{0,4}$/);//this.id.match(/[0-9]{0,4}$/);
			//var idx = this.dataset["sgKey"];
			var idx = this.getAttribute("data-sg-key");
			//팝업버튼 id 'popupBtn'에 번호가 안붙은 경우 popupItem에도 번호가 없다.
			var popupAttrID = "[data-sg-id=item-popup]" + (idx==undefined?"":"[data-sg-key="+idx+"]");
			
			var $popupItem = $(popupAttrID);
			if(!$currentPopup || $currentPopup[0] != this){
				var ww = window.innerWidth;
				var wh = window.innerHeight;
				
				$body.append($popupBg);
				
				//$popupItem.width(sw).height(sh).css({left:pleft, top: ptop}).appendTo($body).show();
				//console.log(sg.scaleMode);
				//setScaleStyle($popupItem, sg.scaleMode);
				
				//center fixed
				$popupItem.css({
					left: (ww-$popupItem.width())/2, top: (wh-$popupItem.height())/2,
					position: "fixed"
				}).appendTo($body).show();
				
				$currentPopup = $popupItem;
				sg_call($popupItem[0]);
				
				//음원속성이 있다면 재생
				sg_sound($popupItem[0]);
			}
			
			//반복실행가능 여부
			if(options.loop == false) $me.unbind("click").css("cursor","auto");
			
			//연동스크립트
			sg_call(this);
			
			//음원속성이 있다면 재생
			sg_sound(this);
		}
		
		
		window.setPopupBtn = function setPopupBtn(elementOrSelector){
			var $target = $(elementOrSelector);
			if($target.length){
				$target.each(function(i,e){
					//var idx = $target.attr("data-sg-id").match(/[0-9]{0,4}%?$/);//this.id.match(/[0-9]{0,4}%?$/);
					//var idx = this.dataset["sgKey"];
					var idx = this.getAttribute("data-sg-key");
					var popupAttrID = "[data-sg-id=item-popup]" + (idx==undefined?"":"[data-sg-key="+idx+"]");
					var $popupItem = $(popupAttrID);
					
					//팝업아이템에 음원속성이 있다면 프리로드
					sg_sound($popupItem[0], false);
					$popupItem.hide().children("[data-sg-id=btn-popup-close]")
					.click(function(){//close btn
						//console.log($currentPopup);
						if($currentPopup){
							$popupBg.remove();
							$currentPopup.hide();
							$currentPopup = null;
						}
					});
				});
				
				$popupBg = $('<div></div>')
				.attr("data-sg-id","popupBg")
				//.addClass
				.width("100%")
				.height("100%");
				
				$target
				.click(popupHandle)
				.each(function(i,e){
					btnInit(this);
					
				});
			}
		}
		setPopupBtn($popupBtns);
		
		
		//이전에 클릭들이 작동한후 작동하도록..이곳에.
		//addEventListener를 사용하지않는한 이벤트 바인드순서로 정하자.
		$("[data-sg-click], [data-sg-one]")
		.each(function(i,e){
			btnInit(this);
			sg_sound(this, false);
		})
		.click(function(){
			var $me = $(this);
			var oneCom = $me.attr("data-sg-one");
			var com = $me.attr("data-sg-click");
			var options = $me.data("options");
			if(!options.enabled) return;
			if(oneCom){
				eval(oneCom);
				$me.attr("data-sg-one", null);
				if(!com) $me.unbind("click").css("cursor","auto");
			}
			if(com) eval(com);
			sg_sound(this);
			//반복실행가능 여부
			if(options.loop == false) $me.unbind("click").css("cursor","auto");
		});
		
		//---------------------------------------------end setting---------------------------------------------
		/*
		초기에 content를 visibility hidden을 시키면 visible시키기전에 수행되는 init과정에서 jquery.easytabs같은 것을 초기화할때 visibility값을
		상속받은체로 남아서 탭 이동시에도 visible로 되지않는 오작동을하게 된다.
		content를 display:none하게될 경우 init에서 무언가 셋팅시. width, height값을 알수 없게된다..
		
		모든요소의 셋팅과정을 가린채 셋팅이 끝난후 모습을 보여주려하는데, 위와같은 문제를 어떻게 해결해야할까
		*/
		//$content.show();
		
		//크롬에서,,바로 안먹는다. 비동기로 해보자
		setTimeout(function(){
			$window.trigger("resize");
		}, 0);
		
		/////////////// html 에서 작성된 init();
		if(window.init) {
			//console.log(window.init);
			window.init();
		}
		//다른 스크립트에서 등록한 초기화 내용들이 있다면 수행
		if(window.initList){
			for(var fo in window.initList){
				window.initList[fo]();
			}
		}
		
		
		//init함수 먼저 실행후에 디스패치
		setTimeout(function(){
			$window.trigger("init");
		}, 0);
		
		
		function getMsize(target){
			var h = 0;
			var $this = $(target);
			h += pxToNum($this.css("padding-top")) + pxToNum($this.css("padding-bottom"));
			h += pxToNum($this.css("margin-top")) + pxToNum($this.css("margin-bottom"));
			h += pxToNum($this.css("border-top-width")) + pxToNum($this.css("border-bottom-width"));
			return h;
		}
		
		///////////////초기셋팅까지 끝난시점에 사이즈를 측정
		
		if($stage.length){
			sg.sw = $stage.width();
			sg.sh = $stage.height();
			
			
			/*
			//컨텐츠배경사이즈를 스테이지에 맞추는과정
			*/
			//header의 크기를 제외한 나머지 크기만큼을 내용배경의 높이로 잡아서, 배경의 최소높이를 스테이지의 높이에 맞춘다.
			
			
			var acH = 0;
			var $header = $("header");
			$content.children().each(function(i,e){
				//console.log(e);
				acH += getMsize(e);
			});
			acH += $header.height();
			acH += getMsize($content) + 1;
			
			$(".gga_contenido, .ggb_contenido, .ggc_contenido, .ggd_contenido, .gge_contenido").css("min-height", sg.sh - acH);
			
			
			//크기확인 테스트용
			/*
			$('<div/>').css({
				"position":"absolute",
				"background-color":"#ff0000",
				"opacity":"0.3",
				"width":$content.width(),
				"height":sg.ch,
				"left":"0px",
				"top":"0px"
			}).appendTo($stage);
			*/
			
			
			
			var scalemode = sg.scaleMode = $stage.attr("data-sg-scalemode");
			$body.css("overflow-x", "hidden");
			$window.bind("resize", function(e){
				setStageScaleStyle($stage, scalemode);
				getStageScale();
			});
					
			setStageScaleStyle($stage, scalemode);
			getStageScale();
		}else{
			sg.sw = 0;
			sg.sh = 0;
		}
		
		if(window.ready) {
			//console.log(window.init);
			window.ready();
		}
		
		$("#progressImg").remove();
		$content.css("visibility","visible");
	});
});