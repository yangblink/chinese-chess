var GameLayer = cc.Layer.extend({
	ctor: function(mode){
		this._super();
		this.init();
		this.mode = mode;
	},
	init: function(){
		var size = cc.winSize;
		var style = CONFIG.style;
		var bg = new cc.Sprite(style.chess_bg_png);
		bg.attr({
			x : size.width / 2,
			y : size.height / 2
		});
		this.addChild(bg, 0, 1);
		
		var board = new cc.Sprite(style.chess_board_png);
		board.attr({
			x : size.width / 2,
			y : size.height / 2 + 50
		});
		this.addChild(board, 1, 2);
		
		var s1 = new cc.Sprite(style.black_che);
		board.addChild(s1, 0, 1);
	}
});


GameLayer.scene = function(mode){
	var scene = new cc.Scene();
	var layer = new GameLayer(mode);
	scene.addChild(layer);
	return scene;
}
