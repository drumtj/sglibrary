(function(jwplayer){

  var template = function(player, div, config) {
    
    var assets = {
        download: 'http://www.example.com/images/download.png';
    }

    var goDownload = function() {
        var item = player.getPlaylistItem();
        if(item['download.link']) {
            document.location = item['downloadlink'];
        } else if(config.link) { 
            document.location = config.link;
        } else {
            document.location = item.file;
        }
    };
    
    function _setup(evt) {
        player.getPlugin("dock").setButton(
            'downloadButton',
            goDownload,
            assets.download
        );
    };
    player.onReady(_setup);
    
    //this.resize = function(width, height) {};
  };

  jwplayer().registerPlugin('download', template);

})(jwplayer);
