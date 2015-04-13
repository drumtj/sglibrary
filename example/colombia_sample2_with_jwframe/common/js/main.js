

requirejs.config({
	//html파일 기준으로
	baseUrl:"../../common/",
	paths:{
		'text': 'lib/require/text',
		'jquery': 'lib/jquery/jquery-1.11.1.min',
		'jquery-ui': 'lib/jquery/jquery-ui-1.10.4.custom.min',
		'jquery-easytabs': 'lib/jquery/jquery.easytabs.custom',
		'jquery-fancybox': 'lib/jquery/fancybox/jquery.fancybox',
		'jquery-ui-touchpunch': 'lib/jquery/jquery.ui.touch-punch.min',
		'sg': 'lib/sg/sg-1.5',
		'sg-attr-defaultPack': 'lib/sg/sg.attr.defaultPack-1.2',
		'sg-attr-draggable': 'lib/sg/sg.attr.draggable-1.4',
		'sg-tag-defaultPack': 'lib/sg/sg.tag.defaultPack-1.5',
		'sg-jwframe': 'lib/sg/sg.jwframe-1.4',
		'jwplayer': 'lib/jwplayer/jwplayer',
		//added 17/03/15
		'jquery-zoomooz': 'lib/jquery/jquery.zoomooz.min'
	},
	
	waitSeconds: 0,
/*
	shim:
	AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
	참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
*/
	shim:{
		'jquery-ui':{
			deps:['jquery']
		},
		'jquery-ui-touchpunch':{
			deps:['jquery-ui']
		}
		,
		'jquery-fancybox':{
			deps:['jquery']
		},
		'jquery-easytabs':{
			deps:['jquery']
		},
		'sg':{
			deps:['jquery'],
			exports: "sg"
		},
		'sg-attr-defaultPack':{
			deps:['sg']
		},
		'sg-attr-draggable':{
			deps:['sg', 'jquery-ui']
		},
		
		//#2015-03-02 added
		'sg-jwframe':{
			deps:['sg']
		},
		
		'sg-tag-defaultPack':{
			deps:['sg']
		},		
		'jwplayer':{
			exports: 'jwplayer'
		},
		//
		'jquery-zoomooz':{
			deps:['jquery']
		}
	}
});

require(
	//library load and execute
	[ 'jquery', 'jquery-ui', 'sg', 'sg-attr-defaultPack', 'sg-attr-draggable', 'sg-tag-defaultPack', 'sg-jwframe', 'jquery-easytabs', 'jquery-fancybox', 'jquery-ui-touchpunch'],
	
	function ( ){
		sg.setStage( "#stage" );
		sg.setScaleMode( "showall" );
		sg.setLoadingImage( "../../common/img/progress_circle.gif" );
		
		//#2015-04-13 added
		sg.setSoundName({
			"success": "../../common/sounds/success.mp3",
			"success-low": "../../common/sounds/success-low.mp3",
			"error": "../../common/sounds/error.mp3"
		});
		
		sg.jwframeConfig({
			//url or require js name
			jwplayerJsPath: "jwplayer",
			playerPath: "../../common/lib/jwplayer/player.swf",
			skinPath: "../../common/lib/jwplayer/skin/skin/skin.xml"
		});
		
		sg.init(function(){
			
			//Modify the page size to the stage height
			
			function getOutHeight( target ){
				var h = 0;
				var $this = $(target);
				h = $this.height();
				h += $this.cssVal("padding-top") + $this.cssVal("padding-bottom");
				h += $this.cssVal("margin-top") + $this.cssVal("margin-bottom");
				h += $this.cssVal("border-top-width") + $this.cssVal("border-bottom-width");
				return h;
			}
			
			function setInHeight( target, h ){
				var $this = $( target );
				$this.css("min-height", h - (getOutHeight( target ) - $this.height())+10);
			}
			
			setInHeight( ".gga_contenido, .ggb_contenido, .ggc_contenido, .ggd_contenido, .gge_contenido", sg.stageHeight - getOutHeight( "#content>header" ) );
			
			$("html").css( "user-select", "none" );
			
		});
	}
);