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
		
		//var newGameNormal = new cc.Sprite(style.menu_single_png);
		 //var btn_normal = new cc.Sprite(style.menu_btn_normal);
		 //var btn_click = new cc.Sprite(style.menu_btn_down);
		// var newGame = new cc.MenuItemSprite(btn_normal, btn_normal, btn_click, this.onNewGame, this);
		// var menu = new cc.Menu(newGame);
		// this.addChild(menu, 1, 2);
		// menu.x = winSize.width / 2;
		// menu.y = winSize.height / 2 - 140;
		

		// var button = new ccui.Button(style.menu_btn_normal, style.menu_btn_down);
		// button.setPosition(size.width / 2.0, size.height / 2.0 );
		// button.setPressedActionEnabled(true);
		// button.setZoomScale(1);
		// this.addChild(button, 1, 2);


		var button = new ccui.Button();
        button.setTouchEnabled(true);
        button.setScale9Enabled(true);
        button.loadTextures(style.menu_btn_normal, style.menu_btn_down, "");
        button.x = size.width / 2.0;
        button.y = size.height / 2.0;
        button.setContentSize(cc.size(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y));
        button.addClickEventListener(this.onNewGame);
        button.setTitleText("单人游戏");
        button.setTitleFontSize(25);
        button.setTitleColor(cc.color.BLACK);

        this.addChild(button, 1, 2);
	},
	onNewGame:function(pSender){
		cc.LoaderScene.preload(g_chess_board_res, function() {
			cc.director.runScene(GameLayer.scene(3));
		}, this);
	}
});

ChessMenu.scene = function(){
	var scene = new cc.Scene();
	var layer = new ChessMenu();
	scene.addChild(layer);
	return scene;
}