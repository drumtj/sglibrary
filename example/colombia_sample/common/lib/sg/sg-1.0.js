/*
SG framework
author: taejin ( drumtj@gmail.com )
*/

(function(){
	
	if( !("jQuery" in window) ){
		throw new Error("sg framework is require jQuery");
	}
	
	var toString = {}.toString
		, slice = [].slice;
	
	var //readyCallbackList = []
		initCallbackList = []
		, customTagList = {}
		, customAttrList = {}
		, setStageFunc
		, setScaleModeFunc
		, progressImg;
	
	//support
	if( !("forEach" in Array.prototype) ){
		Array.prototype.forEach = function ( callback ){
			for( var i=0; i<this.length; i++ ){
				callback.call( window, this[ i ] );
			}
		}
	}
	
	$.fn.pointer = function(){
		return $( this ).css( "cursor", arguments[0] == false ? "auto" : "pointer" );
	};
	
	$.fn.cssVal = function( cssName ){
		var val = $( this ).css( cssName );
		if( val ) num = parseFloat( val.replace( "px", "") );
		else num = 0;
		
		return isNaN( num ) ? 0 : num;
	};
	
	$.getCustomTag = $.fn.getCustomTag = function( tagName, filter ){
		var isRoot = (this == $);
		for( var o in customTagList ){
			if( tagName == o ){
				if( isRoot ) return $( "[" + customTagList[ o ].identifier + "]" );
				else return $( this ).children( "[" + customTagList[ o ].identifier + "]" );
			}
		}
		return $;
	};
	
	
	
	
	function swapTag( obj, findTagName, swapTagName, identifier ) {
		if ( document.querySelector( findTagName ) ) {
			identifier = identifier ? ' ' + identifier + ' ' : '';
			obj.html = obj.html
				.replace( new RegExp( '<' + findTagName, 'g' ), '<' + swapTagName + identifier )
				.replace( new RegExp( '</' + findTagName + '>', 'g' ), '</' + swapTagName + '>' );
		}
	}
	
	function replaceTagList(){
		var obj = {	html: document.body.innerHTML }
			, customTagName
			, customAttrName
			, ctInfo, caInfo;
		
		//customTagList.forEach(function(o) {
		for( customTagName in customTagList ){
			ctInfo = customTagList[ customTagName ];
			swapTag(obj, customTagName, ctInfo.originTag, ctInfo.identifier);
		};

		//add custom attribute prefix : data-
		var sgAttrNameReg = /\ssg([\-][\w]*){1,5}(\s)?=/gi,
			s1 = obj.html.split('<'),
			s2, matchArr, r2 = [],
			i;

		for ( i = 0; i < s1.length; i++ ) {
			s2 = s1[ i ].split( '>' );
			for ( var j = 0; j < s2.length; j++ ) {
				if ( j % 2 == 0 ) {
					matchArr = s2[ j ].match( sgAttrNameReg );
					if ( matchArr ) {
						for ( var k = 0; k < matchArr.length; k++ ) {
							s2[ j ] = s2[ j ].replace( matchArr[ k ], " data-" + matchArr[ k ].substr( 1 ) );
						}
					}
				}
			}
			r2.push( s2.join( '>' ) );
		}
		
		obj.html = r2.join( '<' );
		document.body.innerHTML = obj.html;
		
		//support placeholder bug
		$( "[placeholder]" ).each(function(i,e){
			$( this ).text("").attr( "placeholder", $( this ).attr("placeholder") );
		});
		
		//function apply
		var $customTag;
		for( customTagName in customTagList ){
			ctInfo = customTagList[ customTagName ];
			$customTag = $( "[" + ctInfo.identifier + "]" );
			
			if( sg.isFunction( ctInfo[ "initFunc" ] ) ){
				ctInfo[ "initFunc" ].call( sg );
			}
			
			//execute to init function of custom attribute for each custom tag
			$customTag.each(function(index, element) {
				$( element ).data( "_customTagName", customTagName );
				sg.setDefaultAttr( element );
				if( /^sg-btn-/.test( customTagName ) ) $( element ).pointer();
				if( sg.isFunction( ctInfo[ "eachInitFunc" ] ) ){
					ctInfo[ "eachInitFunc" ].call( element, element );
				}
				sg.initAttr( element );
			});
			
			//execute to action function of custom attribute when called event handle
			if( ctInfo[ "eventName" ] && sg.isFunction( ctInfo[ "eventFunc" ] )){
				$customTag.bind( ctInfo[ "eventName" ], function( e ){
					var ctname = $( this ).data( "_customTagName");
					if ( !$( this ).data( "options" ).enabled ) return;
					
					customTagList[ ctname ][ "eventFunc" ].call( this, this, e );
					sg.actionAttr( this );
				});
			};
			$customTag = null;
		};
		
		//apply custom attribute for all tag
		for( customAttrName in customAttrList ){
			caInfo = customAttrList[ customAttrName ];
			if( caInfo.isForEveryTags ){
				if( caInfo && sg.isFunction( caInfo[ "init" ] ) ){
					$( "[data-" + customAttrName + "]" ).each(function( i, element ){
						sg.setDefaultAttr( element );
						caInfo[ "init" ].call( element, element, element.getAttribute( "data-" + customAttrName ) );
					});
				}
			}
		}
	}
	
	
	function applyScaleMode(){
		var ww = sg.$window.width();
		var hh = sg.$window.height();
		var $content = sg.$content;
		var ch = $content.height();
		ch += $content.cssVal( "border-top-width" ) + $content.cssVal( "border-bottom-width" );
		ch += $content.cssVal( "margin-top" ) + $content.cssVal( "margin-bottom" );
		ch += $content.cssVal( "padding-top" ) + $content.cssVal( "padding-bottom" );
		
		switch( sg.scaleMode ){
			case "showall":
				var msc = Math.min(ww / sg.stageWidth, hh / sg.stageHeight);
				if(ch - sg.stageHeight <= 1){
					if(ch * msc > hh){
						//console.log("top 0, overflow:visible");
						sg.$stage.css({
							"transform" : "scale(" + msc + ")",
							"transform-origin" : "0 0",
							"left" : ((ww - sg.stageWidth * msc) * 0.5) + "px",
							"top" : 0
						});
						
						sg.$stage.parent().css({
							"overflow-y" : "visible"
						});
					}else{
						//console.log("top center, overflow:hidden");
						sg.$stage.css({
							"transform" : "scale(" + msc + ")",
							"transform-origin" : "0 0",
							"left" : ((ww - sg.stageWidth * msc) * 0.5) + "px",
							"top" : ((hh - ch * msc) * 0.5) + "px"
						});
						
						sg.$stage.parent().css({
							"overflow-y" : "hidden"
						});
					}
				}else{
					//console.log("top center, overflow:auto");
					sg.$stage.css({
						"transform" : "scale(" + msc + ")",
						"transform-origin" : "0 0",
						"left" : ((ww - sg.stageWidth * msc) * 0.5) + "px",
						"top" : ((hh - sg.stageHeight * msc) * 0.5) + "px"
					});
					
					sg.$stage.parent().css({
						"overflow-y" : "auto"
					});	
				}
				sg.scaleX = sg.scaleY = msc;
			break;
			
			case "noscale":
				sg.scaleX = sg.scaleY = 0;
			break;
			
			case "exactfit":
				var mscx = ww / sg.stageWidth;
				var mscy = hh / sg.stageHeight;
				sg.$stage.css({
					"transform" : "scale(" + mscx + ", " + mscy + ")",
					"transform-origin" : "0 0"
				});
				sg.scaleX = mscx
				sg.scaleY = mscy;
			break;
		}
	}
	
	
	
	var sg = {
		//Variables defined for codehint
		version: "1.0",
		scaleMode: null,
		scaleX: 0,
		scaleY: 0,
		stageWidth: 0,
		stageHeight: 0,
		$stage: null,
		$content: null,
		$body: null,
		$window: $( window ),
		
		//Function defined for codehint
		isFunction: function( object ){},
		isArray: function( object ){},
		isWindow: function( object ){},
		isNumeric: function( object ){},
		isEmptyObject: function( object ){},
		type: function( object ){},
		inArray: function( element, array, index ){},
		
		
		hide: function( elementOrSelector ){},
		show: function( elementOrSelector ){},
		fadeIn: function( elementOrSelector ){},
		fadeOut: function( elementOrSelector ){},
		enabled: function ( elementOrSelector ){},
		disabled: function ( elementOrSelector ){},
		
		//addCustomAttr: function( customAttrName, isForEveryTags, initFunc, actionFunc ){},
		//addCustomTag: function( customTagName, swapTagName, identifier, useAttrList, initFunc, eachInitFunc, eventName, eventFunc ){},
		addCustomAttr: function( object ){},
		addCustomTag: function( object ){},
		
		init: function( callback ){},
		addInit: function( callback ){},
		setStage: function( elementOrSelector ){},
		setScaleMode: function( scaleMode ){}
	};
	
	
	
	
	//for fuction extentions
	sg.extend = function(prop){
		if(typeof prop !== "object"){ throw new Error("sg.extend arguments is not Object!"); }
		
		for( var name in prop ){
			//sg.hasOwnProperty( name )
			if( name in sg ) prop[ name ]._super = sg[ name ];
			sg[ name ] = prop[ name ];
		}
	}
	
	
	sg.extend({
		isFunction: $.isFunction,
		isArray: $.isArray,
		isWindow: $.isWindow,
		isNumeric: $.isNumeric,
		isEmptyObject: $.isEmptyObject,
		type: $.type,
		inArray: $.inArray
	});
	
	
	
	sg.extend({
		//for inherit function
		_super: function(){
			var _super = arguments.callee.caller._super;
			return sg.isFunction( _super ) ? _super.apply( this, arguments ) : null;
		},
		
		addInit: function( callback ){
			initCallbackList.push( callback );
		},
		
		setLoadingImage: function( path ){
			progressImg = new Image();
			progressImg.setAttribute("data-sg-id", "progressImg");
			progressImg.onload = function( e ){
				this.style.left = (((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - this.width) * 0.5) + "px";
				this.style.top = (((window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth) - this.height) * 0.5) + "px";
				if( !sg.isReady ) document.body.appendChild( progressImg );
				else delete progressImg;
			};
			progressImg.src = path;
			progressImg.style.position = "fixed";
			progressImg.style.visibility = "visible";
		},
		
		setStage: function( elementOrSelector ){
			setStageFunc = function(){
				var $temp = $( elementOrSelector );
				if( $temp.length == 0 ) throw new Error( "setStage : $stage is not select. (selector : " + elementOrSelector + ")" );
				
				$temp.attr( "data-sg-id", "stage" );
				var $content = $( "<div data-sg-id='content'></div>" );
				$temp.contents().each(function( i, e ){
					$content.append( this );
				});
				
				$temp.append( $content ).css( "position", "absolute" );
				$temp.parent().css( "overflow-x", "hidden" );
				
				//border가 없으면, 때로는 크기가 잘 못 계산되기 때문에
				if( $temp.cssVal( "border-top-width" ) == 0 ){
					$temp.css( "border", "solid 1px rgba(255,255,255,0)" );
				}
				
				sg.stageWidth = $temp.width();
				sg.stageHeight = $temp.height();
				
				$content.css({
					"min-height": sg.stageHeight,
					"visibility": "hidden"
				});
							
				sg.$stage = $temp;
				sg.$content = $content;
				
				//apply scaleMode
				if( setScaleModeFunc ){
					setScaleModeFunc.apply( sg );
					setScaleModeFunc = null;
				}
			}
			
			if( sg.isReady ){
				setStageFunc.apply( sg );
				setStageFunc = null;
			}
		},
		
		setScaleMode: function( scaleMode ){
			sg.scaleMode = scaleMode;
			setScaleModeFunc = function(){
				sg.$window.bind( "resize" , function(){
					applyScaleMode();
				});
				applyScaleMode();
			}
			
			if( sg.$stage ){
				setScaleModeFunc.apply( this );
				setScaleModeFunc = null;
			}
		},
		
		//default setting of custom tags
		setDefaultAttr: function ( target ){
			$( target ).data("options", { enabled: true });
		},
		
		//addCustomAttr: function( customAttrName, isForEveryTags, initFunc, actionFunc ){
		addCustomAttr: function( obj ){
			/*
			//ex)
			//obj
			{
				name: "sg-sound",
				init: function( element ){},
				action: function( element ){},
				applyAll: false
			}
			*/
			customAttrList[ obj.name ] = {
				init: obj.init,
				action: obj.action,
				isForEveryTags: obj.applyAll
			}
		},
		
		//addCustomTag: function( customTagName, swapTagName, identifier, useAttrList, initFunc, eachInitFunc, eventName, eventFunc ){
		addCustomTag: function( obj ){
			/*
			//ex)
			//obj
			{
				name: "sg-btn-hide",
				originTag: "span",
				id: "data-sg-id='btn-hide'",
				attr: [ "sg-onImg", "sg-swapImg", "sg-sound" ],
				init: null,
				tagInit: function( element ){},
				event: "click",
				eventHandle: function( element, event ){}
			}
			*/
			customTagList[ obj.name ] = {
				originTag: obj.originTag ? obj.originTag : "div",
				identifier: obj.id ? obj.id : "data-sg-id='" + obj.name + "'",
				eventName: obj.event,
				attrList: (function( list ){
					if( !list ) return null;
					else list = slice.call( list );//copy array
					var i=0, attrName;
					list.forEach( function(attrName){
						if( !(attrName in customAttrList) ) list.splice( i, 1 );
						else i++;
					});
					return list;
				})( obj.attr ),
				initFunc: obj.init,
				eachInitFunc: obj.tagInit,
				eventFunc: obj.eventHandle
			}
		},
		
		//initialize about custom attribute in custom tag
		initAttr: function( element ){
			//console.log( element, arguments.callee );
			var customTagName = $( element ).data( "_customTagName" )
				, attrList, attr, attrValue;
				
			if( customTagName ){
				attrList = customTagList[ customTagName ].attrList;
				if( attrList ){
					attrList.forEach(function( attrName ){
						attr = customAttrList[ attrName ];
						attrValue = element.getAttribute( "data-" + attrName );
						if( attr && attr[ "init" ] && !attr.isForEveryTags ){
							attr[ "init" ].call( element, element, attrValue );
						}
					});
				}
			}
		},
		
		//execute function about custom attribute in custom tag
		actionAttr: function( element ){
			var customTagName = $( element ).data( "_customTagName" )
				, attrList, attr, attrValue;
			
			if( customTagName ){
				attrList = customTagList[ customTagName ].attrList;
				if( attrList ){
					attrList.forEach(function( attrName ){
						attr = customAttrList[ attrName ];
						attrValue = element.getAttribute( "data-" + attrName );
						if( attr && attr[ "action" ] ){
							attr[ "action" ].call( element, element, attrValue );
						}
					});
				}
			}
		},
		
		
		
		
		hide: function( elementOrSelector ){
			$( elementOrSelector ).hide();
		},
		
		show: function( elementOrSelector ){
			$( elementOrSelector ).show();
		},
		
		fadeIn: function( elementOrSelector ){
			$( elementOrSelector ).fadeIn("slow");
		},
		
		fadeOut: function( elementOrSelector ){
			$( elementOrSelector ).fadeOut("slow");
		},
		
		enabled: function ( elementOrSelector ){
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","pointer");
				var options = $this.data("options") || {};
				options.enabled = true;
				$this.data("options", options);
			});
		},
		
		disabled: function ( elementOrSelector ){		
			return $(elementOrSelector).each(function(i,e){
				var $this = $(this);
				$this.css("cursor","default");
				var options = $this.data("options") || {};
				options.enabled = false;
				$this.data("options", options);
			});
		}
	});
	
	sg.extend({
		init: function ( callback ) {
			function _init(){
				//////setting
				//console.log("setting");
				sg.$body = $( document.body );
				
				replaceTagList();
				
				if( setStageFunc ){
					setStageFunc.apply( sg );
					setStageFunc = null;
				}
				
				///compatibility for old versions
				if( "init" in window && sg.isFunction( window[ "init" ] ) ){
					window[ "init" ].apply( window );
				}
				
				if( "initList" in window ){
					initCallbackList = initCallbackList.concat( window[ "initList" ] );
				}
				///
				
				initCallbackList.forEach( function( initFunc ){
					if( sg.isFunction( initFunc ) ) initFunc.apply( window );
				});
				
				
				$("[data-sg-id='progressImg']").remove();
				sg.$content = $("[data-sg-id='content']").css( "visibility", "visible" );
				sg.$stage = $("[data-sg-id='stage']");
				sg.isReady = true;
				
				setTimeout(function(){
					sg.$window.trigger("resize");
				}, 0);
			}
			
			if( $.isReady ){
				_init.apply( window );
				if( sg.isFunction( callback ) ) callback.apply( window );
			}else{
				$( document ).ready(function(e) {
                    _init.apply( window );
					if( sg.isFunction( callback ) ) callback.apply( window );
                });
			}
		}
	});
	
	window.sg = sg;
	
	return sg;
})();