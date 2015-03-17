/*
for swf scale control
attr name : sg-swfscale
functions
	sg.swfScale
	sg.jwframe
2015-03-02
by taejin
*/
/*
 2015-03-16 update 1.2
 2015-03-17 update 1.2
*/


(function(sg){
	
	var movieDopt = {
		width: "100%",
		height: "100%",
		elementOrID: null,
		src: null,
		autoStart: false,
		skin: null,
		scaleControl: false,
		localSources: []
		/*
		localSources: [{
			file: "video.mp4",
			image: "image.jpg"
		},{
			file: "video.ogv",
			image: "image.jpg"
		}]
		*/
	};
	
	sg.extend({
		/**
		 * iframe 영상 주소와, 로컬 영상주소를 받아 로컬에서 실행되었을 경우 로컬 영상을 재생, 웹에서 실행되었을 경우 iframe주소의 영상을 재생.<br>
		 * @function
		 * @name jwframe
		 * @memberOf sg
		 * @param {object} 		option 							- 옵션 객체
		 * @param {string}		option.src						- 재생할 영상 iframe 주소
		 * @param {object}		option.elementOrID				- 영상플레이어를 삽입할 엘리먼트나 엘리먼트의 아이디
		 * @param {string}		[option.width="100%"]			- 영상플레이어 폭
		 * @param {string}		[option.height="100%"]			- 영상플레이어 높이
		 * @param {boolean}		[option.autoStart=false]		- 자동재생 여부
		 * @param {string}		[option.skin=null]				- 스킨경로
		 * @param {boolean}		[option.scaleControl=true]		- 스케일을 sg스케일에 맞춰서 컨트롤 할지 여부( swf컨텐츠 같은 경우는 무조건 true )
		 * @param {array}		[option.localSources=array]		- 로컬영상 정보, {file:"", image:""}
		 * @example
		 *	sg.jwframe({
		 *		elementOrID: "moviePlayer",
		 *		width: 650,
		 *		height: 480,
		 *		src: "http://www.youtube.com/embed/YZ6_j_cswdE",
		 *		//src: "http://200.122.225.123:8080/rest/file/play/9570707f-bb00-4186-8a4c-911cd0a667be;instanceId=4746ce56-f318-4502-9cf2-6a69d36a3bf4;",
		 *		localSources: [{
		 *			file: "video/1.mp4",
		 *			image: "img/poster.jpg"
		 *		},{
		 *			file: "video/1.ogv",
		 *			image: "img/poster.jpg"
		 *		}]
		 *	});
		 */
		jwframe: function( opt ){
			//console.log(opt);
			if( !opt.elementOrID ) return;
			if( typeof opt.elementOrID === "string" ){
				if( opt.elementOrID.charAt(0) != "#" ){
					opt.elementOrID = "#"+opt.elementOrID;
				}	
			}
			
			/*
			if( opt.src.indexOf("http://www.youtube.com/") == 0 && typeof opt.scaleControl === "undefined" ){
				opt.scaleControl = false;
			}
			*/
			
			for( var o in movieDopt ) if( movieDopt[o] != null && (typeof opt[o] === "undefined" || opt[o] === "") ) opt[o] = movieDopt[o];
			
			if( !opt.src ) return;
			var src = opt.src;
			var $element = $(opt.elementOrID);
			if( $element.length == 0 ) return;
			
			if( window.location.href.indexOf("file:///") > -1 && opt.localSources.length ){
				//is local
				
				
				if( $element[0].id == "" ){
					$element[0].id = "id"+Math.floor(Math.random()*999999);
				}
				var eId = $element[0].id;
				var childId = eId + '_child';
				$element.append('<div id="' + childId + '"></div>').width(opt.width).height(opt.height);
				
				function setLocalMovie( jwplayer ){
					if( !jwplayer ) throw new Error("require jwplayer for sg.jwframe module");
					//not apply scale for jwplayer html5 mode
					//mp4, m4v, f4v, mov flv , m4a, f4a mp3  smil
					//m3u8 webm ogg, ogv
					var modes = []
					, rex1 = /\.(mp4|m4v|f4v|mov|flv|m4a|f4a|mp3|smil)$/i
					, rex2 = /\.(webm|ogg|ogv)$/i
					, flashSupport = false
					, html5Support = false
					, html5SupportIndex
					, setupOpts
					, i, len = opt.localSources.length;
					
					var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
					var isSafari = navigator.userAgent.indexOf("Safari") > -1 && !isChrome;
					var jwPlayerWmode = ( isSafari ? "window" : "transparent" );
					var jwPlayerSkin = opt.skin || "../../common/lib/jwplayer/skin/skin/skin.xml";
					
					
					/*
					console.log(navigator.userAgent);
					console.log(navigator.appName);
					console.log(navigator.appVersion);
					console.log(navigator.appCodeName);
					*/
					
					function controlbarShowHide(){
						var jwp = jwplayer(childId);
						var c = $(jwp.container);
						if( c.width() < 360 ) jwp.getPlugin("controlbar").hide();
						window.addEventListener("resize", function(e){
							if( !jwp ){
								window.removeEventListener("resize", arguments.callee);
								return;
							}
							
							if( c.width() < 360 ){
								jwp.getPlugin("controlbar").hide();
							}else{
								jwp.getPlugin("controlbar").show();
							}
						});
					}
					
					for( i=0; i<len; i++ ){
						if( !flashSupport && rex1.test(opt.localSources[i].file) ) flashSupport = true;
						if( !html5Support && rex2.test(opt.localSources[i].file) ) {html5Support = true; html5SupportIndex = i;}
					}
					
					if( flashSupport ){
						console.log("jwplayer local movie");
						for( i=0; i<len; i++ ){
							opt.localSources[i].provider = "video";
							modes.push({
								type: "flash",
								src: "../../common/lib/jwplayer/player.swf",
								config: opt.localSources[i]
							});
						}
						
						setupOpts = {
							autostart: opt.autoStart,
							height: opt.height, 
							width: opt.width,
							skin: jwPlayerSkin,
							wmode: jwPlayerWmode,
							allowscriptaccess:"always",
							allowfullscreen:true,
							modes: modes
						}
													
						//add events. exception Chrome. not run in local page for Chrome.
						//local jwplayer.setup is not dispatch event in chrome
						
						if( !isChrome ){
							setupOpts.events = {
								onReady:function(e){
									console.log("jwplayer onReady!");
									sg.swfScale( jwplayer(childId).container );
									controlbarShowHide();
								}
							}
						}
						
						//jwplayer setup
						jwplayer( childId ).setup(setupOpts);
						
						//setup after
						if( isChrome ){
							if( jwplayer(childId).container ){
								console.log("finish jwplayer setting in Chrome local page!");
								sg.swfScale( jwplayer(childId).container );
								//not work in Chrome of local
								//controlbarShowHide();
							}
						}
					}else if( html5Support ){
						console.log("video tag local movie");
						$element.empty().html(
							'<video id="elementJs" type="video/mp4" src="'
							+ opt.localSources[html5SupportIndex].file
							+ '" width="' + opt.width
							+ '" height="' + opt.height
							+ '" controls'
							+ (opt.localSources[html5SupportIndex].image 
								? ' poster="'+opt.localSources[html5SupportIndex].image+'"'
								: '')
							+ '></video>'
						).width(opt.width).height(opt.height);
					}else{
						$element.empty().html("not support file type");
					}
				};
				
				if( window.jwplayer ){
					setLocalMovie( window.jwplayer );
				}else if( window.require ){
					require(["jwplayer"], setLocalMovie);
				}else{
					console.error( "require jwplayer." );
				}
			}else{
				var $iframe = $('<iframe src="'+ src +'" width="'+ opt.width +'" height="'+ opt.height +'" frameborder="0" scrolling="no" allowfullscreen></iframe>');
				$element.empty().append( $iframe ).width(opt.width).height(opt.height);
				if( opt.scaleControl ) sg.swfScale( $iframe );
			}
		},
		
		/**
		 * 브라우져별 swf scale조절시 대응, 태그의 커스텀 속성 sg-swfscale으로도 사용됨.<br>
		 * 모바일 환경에서는 swf를 재생하지 않기 때문에 사용할 필요 없음.
		 * for flash scale control by each browser. also used to sg-swfscale of custom attribute for the tag. <br>
		 * don't used to mobile because not supported flash.
		 * @function
		 * @name swfScale
		 * @memberOf sg
		 * @param {object}		elementOrID						- 영상플레이어를 삽입할 엘리먼트나 엘리먼트의 아이디.
		 * @example
		 *	sg.swfScale( "moviePlayer" );
		 *	sg.swfScale( "#moviePlayer" );
		 *	var element = document.getElementById("moviePlayer");
		 *	sg.swfScale( element );
		 */
		swfScale: function( elementOrID ){
			//console.log(elementOrID);
			if( !elementOrID ) return;
			if( typeof elementOrID === "string" ){
				if( elementOrID.charAt(0) != "#" ){
					elementOrID = "#"+elementOrID;
				}	
			}
			var $target = $(elementOrID);
			if( $target.length == 0 ) return;
			var isMobile = /ip(hone|od|ad)|android|blackberry|bada\/|avantgo|mobile.+firefox|windows ce|kindle|opera m(ob|in)i/i.test(navigator.userAgent||navigator.vendor||window.opera);
			
			if( isMobile ) return;
			
			
			//if( jwplayer(divName).renderingMode != "flash" ) return;
			var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
			var isSafari = navigator.userAgent.indexOf("Safari") > -1 && !isChrome;
			var width = $target.width();
			var height = $target.height();
			var $parent = $target.parent();
			var parentOL = 0;
			if( $parent.length > 0 ) parentOL = $parent[0].offsetLeft;
			function r(){
				if( isSafari ){
					$target.css({
						"width": (width*sg.scaleX)+"px",
						"height": (height*sg.scaleY)+"px"
					});
					$parent.css({
						"z-index": "-9999",
						"left": (-(parentOL-parentOL*sg.scaleX))+"px",
						"top": (-(height - height * sg.scaleY) / 2)+"px"
					});
				}else{
					$target.css({
						"width": (width*sg.scaleX)+"px",
						"height": (height*sg.scaleY)+"px",
						"transform" : "scale("+(width/(width*sg.scaleX))+","+(height/(height*sg.scaleY))+")",
						"transform-origin" : "left top"
					});
				}
			}
			
			if( sg.scaleMode != "none" ){
				//sg.init 시점에 resize이벤트 trigger를 통해 한번 호출되지만
				//그 시점 이후에 swfScale함수가 호출 된 경우를 위해 r()호출을 지우지 말자.
				//we are already calling to resize event to jQuery.trigger when called to sg.init.
				//but when after that don't remove this line(r()) for if called to sg.swfScale.
				r();
				sg.$window.bind("resize", r);
			}
		}
	});
	
	sg.addCustomAttr({
		name:"sg-swfscale",
		init: function( element, attrValue ){
			sg.swfScale( element );
		},
		applyAll: true
	});
}(window.sg));