(function ( sg ){
	
	/*
	 * custom attribute : sg-draggalbe
	 */
	 
	 
	if( !("ui" in $) ) throw new Error("require jQuery-ui for sg-draggable");
	if( !("hitTestPoint" in $( document )) ) throw new Error("require jQuery plugin [jquery.hittest.js] for sg-draggable");
	
	
	var zidx = 100;
	var isDrag = false;
	
	function setDraggable(selector, options){
				
		var options = options || {};
		
		function b( bstr ){
			switch( typeof bstr ){
				case "string": return bstr == "true" ? true : false; break;
				case "boolean": return bstr; break;
				default: return false;
			}
		}
		
		$(selector).each(function(i,e){
			sg.setOption( this );
			var $this = $( this );
			var draggableOptions = {
				dropSelector: options.dropSelector || $this.attr( "data-sg-drop-selector" ),
				revert: b( options.revert || $this.attr( "data-sg-revert" ) ),
				fail: options.fail || $this.attr( "data-sg-drop-fail" ),
				success: options.success || $this.attr( "data-sg-drop-success" ),
				clone: b( options.clone || $this.attr( "data-sg-clone" ) )
			};
			
			$this
			.attr( "data-sg-drop-selector", draggableOptions.dropSelector )
			.attr( "data-sg-revert", draggableOptions.revert )
			.attr( "data-sg-drop-fail", typeof draggableOptions.fail === "string" ? draggableOptions.fail : "" )
			.attr( "data-sg-drop-success", typeof draggableOptions.success === "string" ? draggableOptions.success : "" )
			.attr( "data-sg-clone", draggableOptions.clone )
			.data( "draggableOptions", draggableOptions );
			
			
			
			$this.data("_originPos", {
				left: this.offsetLeft,
				top: this.offsetTop
			}).data("originPos", {
				left: this.offsetLeft,
				top: this.offsetTop
			});
			
			$this.css({
				//잔상 제거 위함
				"overflow": "hidden",
				//draggable에서 cursor속성으로 설정할 경우 상속값 때문에 다른값으로 바뀌어 적용 되는 경우가 있기 때문에 이곳에서 처리.
				"cursor": "pointer"
			});
			
			///////////////////////////draggable////////////////////////////////////
			$this.draggable( {
				helper: (function(){
					return draggableOptions.clone ? "clone" : undefined;
				})(),
				//cursor: 'pointer',  //Since inherit the value of the parent
				revert: function(){
					isDrag = false;
					
					var options = this.data( "draggableOptions" )
						, failAction = options.fail
						, successAction = options.success
						, dropselector = options.dropSelector
						, bool = options.revert
						, isClone = options.clone
						, hit = false
						, helper = this.data( "helper" ) || this
						, rect = helper.getRect()
						, callReturn;
						
					if( dropselector ){
						//checking, center point of drag object
						$( dropselector ).each(function(i, e){
							if( hit ) return;
							hit = $( this ).hitTestPoint({
								x:rect.x + rect.width * 0.5 * sg.scaleX,
								y:rect.y + rect.height * 0.5 * sg.scaleY,
								transparency:false,
								scaleX: sg.scaleX,
								scaleY: sg.scaleY
							});
						});
					}
					
					
					if( hit ){
						//disconnect to previous connection
						var tempHit = this.data( "hit" );
						if( tempHit ){
							var tempDragObjs = tempHit.data( "dragObjs" );
							//remove 'this' from array
							if( tempDragObjs ) sg.splice( tempDragObjs, this );
						}
						
						//save new hit
						this.data( "hit", hit );
						
						var dragObjs = hit.data( "dragObjs" ) || [];
						
						sg.splice( dragObjs, this );
						dragObjs.push( this );
						hit.data( "dragObjs", dragObjs );
						
						bool = false;
						var newOriginPos;
						if( this.css( "position" ) == "absolute" ){
							var nop = {
								left: hit[ 0 ].offsetLeft + ( hit.width() - this.width() ) * 0.5,
								top: hit[ 0 ].offsetTop + ( hit.height() - this.height() ) * 0.5
							};
							this.css( nop ).data( "originPos", nop );
						}else{
							//position이 'relative'일 경우의 drop처리
							//newOriginPos는 revert처리시 사용할 새로운 위치
							var or = this.data( "originPos" );
							newOriginPos = {
								left: hit[ 0 ].offsetLeft - or.left + (hit[ 0 ].offsetWidth - this[ 0 ].offsetWidth) * 0.5,
								top: hit[ 0 ].offsetTop - or.top + (hit[ 0 ].offsetHeight - this[ 0 ].offsetHeight) * 0.5
							};
							this.data( "newOriginPos", newOriginPos );
							
							if( isClone ){
								this.css( "position", "relative" ).css( newOriginPos );
							}else{
								this.css( newOriginPos );
							}
							
						}
												
						if( successAction ){
							if( sg.isFunction( successAction )){
								callReturn = successAction.apply( this[ 0 ] ); 
							}else{
								callReturn = eval( successAction );
							}
						}
						
						if( typeof callReturn === "boolean" ) bool = callReturn;
						
					}else if( !hit && failAction ){
						if( sg.isFunction( failAction ) ){
							callReturn = failAction.apply( this[ 0 ] ); 
						}else{
							callReturn = eval( failAction );
						}
						if( typeof callReturn === "boolean" ) bool = callReturn;
					}
					
					if( bool ){
						var nop;
						if( isClone ){
							bool = false;
							if( this.data( "newOriginPos" ) ){
								nop = {
									left: this[ 0 ].offsetLeft,
									top: this[ 0 ].offsetTop
								}
								//this.data("originPos", nop);
								this.data( "newOriginPos", nop );
							}else{
								nop = this.data( "originPos" );
							}
							helper.clone().appendTo( helper.parent() ).animate( nop, {complete:function(){this.remove()}} );
						}else{
							if( this.css( "position" ) == "absolute" ){
								bool = false;
								this.animate( this.data( "originPos" ) );
							}else if( nop = this.data( "newOriginPos" ) ){
								//drop이후에는 revert 위치를 다르게.
								bool = false;
								this.animate( nop );
							}
						}
					}
					return bool;
				},
				
				start : function( e, ui ){
					var $this = $( this );
					
					isDrag = true;
					sg.$body.css( "overflow-y", "hidden" );
					
					var op = $this.data( "draggableOptions" );
					
					if( $this.css( "position" ) != "absolute" && !op.clone ){
						ui.position.left *= sg.scaleX;
						ui.position.top *= sg.scaleY;
					}
					
					$this
					.data( "disPos", {
						left: ui.position.left - e.clientX,
						top: ui.position.top - e.clientY
					} ).css( "z-index", zidx++ );
					
					
					if( op && op.clone ){
						$this.data( "helper", ui.helper );
					}
				},
				
				stop: function( e ){
					if( !isDrag ) sg.$body.css( "overflow-y", "auto" );
				},
				
				drag: function( e, ui ){
					var disPos = $( this ).data( "disPos" );
					ui.position = {
						left: ( disPos.left + e.clientX ) / sg.scaleX,
						top: ( disPos.top + e.clientY ) / sg.scaleY
					};
				}
			});
			
		})
		
	}
	
	function resetDragPosition( selector, isAnimate ){
		$( selector ).each(function(i,e){
			var $this = $( this );
			var _op = $this.data( "_originPos" );
			var _rp = { left:0, top:0 };
			
			//reset position
			if( $this.css( "position" ) == "relative" ){
				if( isAnimate ) $this.animate( _rp );
				else $this.css( _rp );
			}else{
				if( _op ){
					if( isAnimate ) $this.animate( _op );
					else $this.css( _op );
				}
			}
		});
	}
	
	function resetDraggable( selector, isAnimate ){
		resetDragPosition( selector );
		
		
		$( selector ).each(function(i,e){
			var $this = $( this );
			var _op = $this.data( "_originPos" );
			//reset originPos and newOriginPos
			$this.data( "newOriginPos", null );
			if( _op ) $this.data( "originPos", _op );
			
			//hit disconnect
			var hit = $this.data( "hit" );
			if( hit ){
				var dragObjs = hit.data( "dragObjs" );
				if( dragObjs ){
					sg.splice( dragObjs, this );
				}
			}
			$this.data( "hit", null );
		}).draggable( "enable" );
	}
	
	function destroyDraggable( selector ){
		sg.resetDraggable( selector );
		$( selector ).draggable( "disable" );
	}
	
	//drop check
	function dropCheck( dropObj, dragObj ){
		var $dropObj= $( dropObj );
		var $dragObj = $( dragObj );
		var dragObjs = $dropObj.data( "dragObjs" );
		
		if( !(dragObjs && dragObjs.length > 0) ) return false;
		
		for( var k=0; k<dragObjs.length; k++ ){
			if( dragObjs[ k ][ 0 ] == $dragObj[ 0 ] ) return true;
		}
		return false;
	}
	
	//Removed from the array
	function splice( arr, target ){
		for( var k=0; k<arr.length; k++ ){
			if( arr[ k ].jquery ){
				if( arr[ k ][ 0 ] == $( target )[ 0 ] ){
					arr.splice( k, 1 );
				}
			}else{
				if( arr[ k ] == target ){
					arr.splice( k, 1 );
				}
			}
		}
		return arr;
	}
	
	sg.extend({
		splice: splice,
		dropCheck: dropCheck,
		setDraggable: setDraggable,
		resetDragPosition: resetDragPosition,
		resetDraggable: resetDraggable,
		destroyDraggable: destroyDraggable
	});
	
	sg.addCustomAttr({
		name: "sg-draggable",
		init: function(){
			sg.setDraggable( "[data-sg-draggable]" );
		},
		applyAll: true
	});
	
})( sg )