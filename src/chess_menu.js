var ChessMenu = cc.Layer.extend({
	ctor:function(){
		this._super();
		this.init();
	},
	init:function(){
		winSize = cc.director.getWinSize();
		var style = CONFIG.style;
		var size = cc.winSize;
		var sp = new cc.Sprite(style.menu_bg_png);
		sp.attr({
			x: size.width / 2,
			y: size.height / 2
		});
		this.addChild(sp, 0, 1);
		
		var newGameNormal = new cc.Sprite(style.menu_single_png);
		var newGame = new cc.MenuItemSprite(newGameNormal, newGameNormal, newGameNormal, this.onNewGame, this);
		
		var menu = new cc.Menu(newGame);
		this.addChild(menu, 1, 2);
		menu.x = winSize.width / 2;
		menu.y = winSize.height / 2 - 140;
		
	},
	onNewGame:function(pSender){
		cc.LoaderScene.preload(g_chess_board_res, function() {
			cc.director.runScene(GameLayer.scene("normal"));
		}, this);
	}
});

ChessMenu.scene = function(){
	var scene = new cc.Scene();
	var layer = new ChessMenu();
	scene.addChild(layer);
	return scene;
}