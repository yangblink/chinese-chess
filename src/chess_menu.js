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

		var newGame_btn = Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "单人游戏", this.onNewGame);
		newGame_btn.setPos(size.width / 2.0, size.height / 2.0);
		this.addChild(newGame_btn, 1, 2);

		var newGame_btn = Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "残局", this.onEnding);
		newGame_btn.setPos(size.width / 2.0, size.height / 2.0 - 100);
		this.addChild(newGame_btn, 1, 2);

		var newGame_btn = Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "打谱", this.onMakeManual);
		newGame_btn.setPos(size.width / 2.0, size.height / 2.0 - 200);
		this.addChild(newGame_btn, 1, 2);
	},
	onNewGame:function(pSender){
		cc.LoaderScene.preload(g_chess_board_res, function() {
			cc.director.runScene(GameLayer.scene(3));
		}, this);
	},
	onEnding:function(pSender){
		cc.log("ending");
	},
	onMakeManual:function(pSender){
		cc.log("makeManaul");
	}
});

ChessMenu.scene = function(){
	var scene = new cc.Scene();
	var layer = new ChessMenu();
	scene.addChild(layer);
	return scene;
}