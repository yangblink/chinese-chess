var g_sharedGmaeLayer;			//游戏层
var g_sharedChessLayer;			//棋盘精灵
var GameLayer = cc.Layer.extend({
	board : null,
	style : null,
	map : null,		//当前的地图
	point_map: [],	
	focus_chess : null,				//当前选中的棋子信息
	active : false,
	curt_color : CONFIG.COLOR.RED,  //当前执子方
	chess_manual : null,			//棋谱
	ctor: function(mode){
		this._super();
		g_sharedGmaeLayer = this;
		this.style = CONFIG.style;
		this.init();
	},
	init: function(){
		var size = cc.winSize;
		var style = this.style;
		//加载背景图片
		var bg = new cc.Sprite(style.chess_bg_png);
		bg.attr({
			x : size.width / 2,
			y : size.height / 2
		});
		this.addChild(bg, 0, 1);
		//加载棋盘
		this.board = new cc.Sprite(style.chess_board_png);
		this.board.attr({
			x : size.width / 2,
			y : size.height / 2 + 50
		}); 
		this.addChild(this.board, 1, 2);
		g_sharedChessLayer = this.board;
		//log("#@"+this.board.getTextureRect().width+"..."+this.board.getTextureRect().height);

		//加载地图
		this.map = GameLayer.arr2Clone(Map.initMap);
		this.loadChessman(this.map);
		//棋谱
		this.chess_manual = new Chessmanual(GameLayer.arr2Clone(Map.initMap));
		//动画初始化
		CheckEffect.shareCheckEffect();
		//初始化着点
		Chesspoint.perset(style.chess_point_png);
		//初始化示意点
		Chesshint.create(style.rchess_hint_png);
		//触摸事件
		this.addTouchevent();
		//菜单
		this.addMenu();
		//初始化AI
		AI.setDepth(3);
	},
	addMenu: function(){
		var regret = new cc.Sprite(this.style.game_regret);
		var reset = new cc.Sprite(this.style.game_reset);
		var exit = new cc.Sprite(this.style.game_menu_exit);

		var regret_menu = new cc.MenuItemSprite(regret, regret, regret, this.on_menu_regret, this);
		var reset_menu = new cc.MenuItemSprite(reset, reset, reset, this.on_menu_reset, this);
		var exit_menu = new cc.MenuItemSprite(exit, exit, exit, this.on_menu_exit, this);

		var menu = new cc.Menu(regret_menu, reset_menu, exit_menu);
		menu.alignItemsHorizontallyWithPadding(15);
		menu.attr({
			x : cc.winSize.width / 2,
			y : 50
		});
		this.addChild(menu, 2, 3);

	},
	on_menu_regret:function(pSender){
		cc.log("onRegret");
	},
	//悔棋
	on_menu_reset:function(pSender){
		cc.log("onReset");
		//电脑走的棋
		var manual1 = this.chess_manual.shift_manual();
		//玩家走的棋
		var manual2 = this.chess_manual.shift_manual();
		
	},
	on_menu_exit:function(pSender){
		cc.log("onExit");
	},
	addTouchevent: function(){
		////////////////////
		//监听事件
		var self = this;
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				//cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
				if (cc.rectContainsPoint(rect, locationInNode)) {
					self.onTouchBegan(locationInNode.x, locationInNode.y);
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				//log("onTouchMoved");
			},
			onTouchEnded: function (touch, event) {
				//log("onTouchEnded");
			}
		});
		cc.eventManager.addListener(listener, this.board);
	},
	loadChessman: function(map){
		for(var x = 0; x < map.length; x++){
			for(var y = 0; y < map[x].length; y++){
				var key = map[x][y];
				if(key){
					//x y坐标交换
					Chessman.create(y, x , key);
				}
			}
		}
	}
});
//触摸事件
GameLayer.prototype.onTouchBegan = function(x, y){
	if(this.active)
		return;
	var self = this;
	//触摸点的棋盘坐标
	var index_coord = this.getChessIndex(x, y);
	//触摸点棋子的key
	var chess_key = this.map[index_coord.y][index_coord.x];
	log("touch##"+chess_key);
	//点击在着点上
	if(this.focus_chess && this.point_map.some(function(item){return  (item[0] == index_coord.x && item[1] == index_coord.y)})){
		Chesspoint.clearPoint();
		this.focus_chess.move(index_coord);
		this.active = true;
		return;
	}
	//点击在棋子上
	if(chess_key){
		var press_key = CONFIG.CONTAINER.CHESS[chess_key];
		if(this.curt_color == press_key.chess_color){
			Chesspoint.clearPoint();
			this.focus_chess = press_key;
			this.drawPoint(this.focus_chess);
			return;
		}
	}
}
//棋子移动完事件
GameLayer.prototype.moveCallback = function(src_pos, dst_pos){
	//cc.log("move done [" + x + ","+y+"]");
	var clear_key = this.map[dst_pos.y][dst_pos.x];
	var key = this.focus_chess.key;
	//吃子
	if(clear_key){
		CONFIG.CONTAINER.CHESS[clear_key].visible = false;
	}
	//重新设置map
	this.map[src_pos.y][src_pos.x] = undefined;
	this.map[dst_pos.y][dst_pos.x] = key;

	this.focus_chess = null;
	this.point_map = [];
	//棋谱记录
	this.chess_manual.add(this.curt_color, key, src_pos, dst_pos, clear_key);
	//回合交换
	this.change_color();
	//是否北将军动画显示
	if(this.bChecked()){
		CheckEffect.getOrCreateExplosion();
	}

	//电脑走完才可触屏
	if(this.curt_color == CONFIG.COLOR.RED){
		this.active = false;
	}
	else{
		this.AIrun();
	}
	
}
GameLayer.prototype.AIrun = function(){
	//AI  Test
	var move = AI.init(Util.arr2Clone(this.map), this.curt_color);
	var key = move.key, dstX = move.x, dstY = move.y;
	var chess = CONFIG.CONTAINER.CHESS[key];
	if(chess){
		this.focus_chess = chess;
		chess.move({"x" : dstX, "y" : dstY});
	}else{
		cc.log("AIrun Error!!");
	}
}
//是否被将军
GameLayer.prototype.bChecked = function(){
	//已交换颜色，当前颜色为敌对颜色
	var key_j = (this.curt_color == CONFIG.COLOR.RED) ? "j0" : "J0";
	var chess_j = CONFIG.CONTAINER.CHESS[key_j];
	var coord_j = [chess_j.xIndex, chess_j.yIndex];
	cc.log("coord_j ## " +  coord_j);
	var key_arr = (this.curt_color == CONFIG.COLOR.RED) ? Map.black : Map.red;
	for(var i = 0; i < key_arr.length; i++){
		var chess = CONFIG.CONTAINER.CHESS[key_arr[i]];
		if(chess && chess.visible){
			var point_map = chess.bylaw();
			if(key_arr[i] == 'p0' || key_arr[i] == 'p1'){
				cc.log(chess.xIndex+"...."+chess.yIndex);
				cc.log(key_arr[i]+"####"+ point_map);
			}

			if(point_map.some(function(item){ return (item[0] == coord_j[0] && item[1] == coord_j[1]) })){
				return true;
			}
		}
	}
	return false;
}

GameLayer.prototype.change_color = function(){
	this.curt_color = (this.curt_color == CONFIG.COLOR.RED) ? CONFIG.COLOR.BLACK : CONFIG.COLOR.RED;
}
//绘制着点
GameLayer.prototype.drawPoint = function(chess){
	var map = chess.bylaw();
	this.point_map = map;
	//cc.log("drawPoint map ## "+map);
	Chesspoint.drwaPoint(map);
}
//根据传入的坐标 获取 棋盘上点在二维数组中的坐标
GameLayer.prototype.getChessIndex = function(x, y){
	var tmp_x = x - CONFIG.start_x;
	x = tmp_x < 0 ? 0 : tmp_x;
	var addx = x % CONFIG.scale > (CONFIG.scale / 2) ? 1 : 0;
	var rstx = parseInt(x / CONFIG.scale ) + addx;

	var tmp_y = y - CONFIG.start_y;
	y = tmp_y < 0 ? 0 : tmp_y;
	var addy = y % CONFIG.scale > (CONFIG.scale / 2) ? 1 : 0;
	var rsty = parseInt(y / CONFIG.scale) + addy;
	rsty = 9 - rsty;
	return {"x": rstx, "y": rsty};
}

GameLayer.prototype.addCheckEffect = function(check){
	this.board.addChild(check, CONFIG.UNIT_TAG.CHECK);
}

//二维数组克隆
GameLayer.arr2Clone = function (arr){
	var newArr=[];
	for (var i=0; i<arr.length ; i++){	
		newArr[i] = arr[i].slice();
	}
	return newArr;
}
GameLayer.scene = function(mode){
	var scene = new cc.Scene();
	var layer = new GameLayer(mode);
	scene.addChild(layer);
	return scene;
};




