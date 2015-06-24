var g_sharedGmaeLayer;			//游戏层
var g_sharedChessLayer;			//棋盘精灵
var GameLayer = cc.Layer.extend({
	board : null,
	style : null,
	map : null,		//当前的地图
	original_map : null,
	point_map: [],	
	focus_chess : null,				//当前选中的棋子信息
	active : false,
	curt_color : CONFIG.COLOR.RED,  //当前执子方
	chess_manual : null,			//棋谱
	regret_step : 2, 				//悔棋的步数
	bcomputer : true,			//是否人机对弈
	ai_level : 3,
	ctor: function(ai_level){
		this._super();
		g_sharedGmaeLayer = this;
		this.style = CONFIG.style;
		if(ai_level == 0){
			this.bcomputer = false;
			this.regret_step = 1;
		}else{
			this.bcomputer = true;
			this.ai_level = ai_level;
			this.regret_step = 2;
		}
		this.init();
	},
	reset:function(){
		this.focus_chess = null;
		this.active = false;
		this.curt_color = CONFIG.COLOR.RED;
		if(this.chess_manual) this.chess_manual.reset();
		if(CONFIG.CONTAINER.HIN) CONFIG.CONTAINER.HIN.reset();
		Chesspoint.clearPoint();
		this.map = Util.arr2Clone(this.original_map);
		this.loadChessman(this.map);
	},
	init: function(){
		CONFIG.reset();
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
		this.original_map = Util.arr2Clone(Map.initMap);
		this.map = Util.arr2Clone(Map.initMap);
		this.loadChessman(this.map);
		//棋谱
		this.chess_manual = new Chessmanual();
		//动画初始化
		//CheckEffect.shareCheckEffect();
		//将军特效初始化
		Animation_Effect.initEffect(g_effect_check, cc.rect(0, 0, 332, 332), "check");
		Animation_Effect.initEffect(g_effect_kill, cc.rect(0, 0, 332, 332), "kill");

		//初始化着点
		Chesspoint.perset(style.chess_point_png);
		//初始化示意点
		Chesshint.create(style.rchess_hint_png);
		//触摸事件
		this.addTouchevent();
		//菜单
		this.addMenu();
		//初始化AI
		AI.setDepth(this.ai_level);
	},
	addMenu: function(){
		var regret_menu = new Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "悔棋", this.on_menu_regret.bind(this));
		regret_menu.setPos(100, 50);

		var reset_menu = new Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "重来", this.on_menu_reset.bind(this));
		reset_menu.setPos(cc.winSize.width / 2, 50);

		var exit_menu = new Button.create(CONFIG.BTN_SIZE.MENU_X, CONFIG.BTN_SIZE.MENU_Y, "返回", this.on_menu_exit.bind(this));
		exit_menu.setPos(cc.winSize.width - 100, 50);

		this.addChild(regret_menu);
		this.addChild(reset_menu);
		this.addChild(exit_menu);
	},
	on_menu_regret:function(pSender){
		cc.log("active#"+this.active + ",  regret_step#" + this.regret_step);
		if(this.active)
			return;

		if(this.chess_manual.getStep() <= 0 )
			return;

		Chesspoint.clearPoint();
		this.focus_chess = null;

		var manual1, manual2, chess;
		if(2 == this.regret_step){
			manual1 = this.chess_manual.pop();
			chess = CONFIG.CONTAINER.CHESS[manual1.key];
			chess.moveSoon(manual1.src_pos);
			if(manual1.clear_key){
				CONFIG.CONTAINER.CHESS[manual1.clear_key].visible = true;
			}
			this.map[manual1.dst_pos.y][manual1.dst_pos.x] = manual1.clear_key ? manual1.clear_key : undefined;
			this.map[manual1.src_pos.y][manual1.src_pos.x] = manual1.key;
		}

		manual2 = this.chess_manual.pop();
		chess = CONFIG.CONTAINER.CHESS[manual2.key];
		this.active = true;
		chess.move(manual2.src_pos, manual2);
		if(manual2.clear_key){
			CONFIG.CONTAINER.CHESS[manual2.clear_key].visible = true;
		}
	},
	//重来
	on_menu_reset:function(pSender){
		var self = this;
		cc.log("onReset #" + self.ai_level);
		cc.LoaderScene.preload(g_chess_board_res, function() {
			cc.director.runScene(GameLayer.scene(self.ai_level));
		}, this);
	},
	//返回
	on_menu_exit:function(pSender){
		cc.log("onExit");
		cc.LoaderScene.preload(g_chess_board_res, function() {
			cc.director.runScene(ChessMenu.scene());
		}, this);
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
		return true;
	var self = this;
	//触摸点的棋盘坐标	
	var index_coord = this.getChessIndex(x, y);
	//触摸点坐标上的棋子
	var chess_key = this.map[index_coord.y][index_coord.x];
	log("touch ## "+chess_key);
	//点击在着点上
	if(this.focus_chess && this.point_map.some(function(item){return  (item[0] == index_coord.x && item[1] == index_coord.y)})){
		Chesspoint.clearPoint();
		this.focus_chess.move(index_coord);
		this.active = true;
		return true;
	}
	//点击在棋子上
	if(chess_key){
		var press_key = CONFIG.CONTAINER.CHESS[chess_key];
		if(this.curt_color == press_key.chess_color){
			Chesspoint.clearPoint();
			this.focus_chess = press_key;
			this.drawPoint(this.focus_chess);
			return true;
		}
	}
	return true;
}
//棋子移动完事件
GameLayer.prototype.moveCallback = function(src_pos, dst_pos, key){
	var self = this;
	var clear_key = this.map[dst_pos.y][dst_pos.x];
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
	this.chess_manual.add(key, src_pos, dst_pos, clear_key);
	//回合交换
	this.change_color();
	//是否被将军动画显示
	// var bChecked = false;
	// if(this.bChecked()){
	// 	bChecked = true;
	// 	//CheckEffect.getOrCreateExplosion();
	// 	//Animation_Effect.getOrCreateExplosion("check");
	// 	Animation_Effect.getOrCreateExplosion("kill");
	// }
	// //电脑走完才可触屏
	// if(this.curt_color == CONFIG.COLOR.RED){
	// 	this.active = false;
	// }
	// else{
	// 	if(bChecked){
	// 		var tm = CONFIG.CHESS_TIME.CHECK_ANIM * 1000 * 12 + 300;
	// 		//cc.log("tm# " + tm);
	// 		setTimeout(function(){
	// 			self.AIrun();
	// 		}, tm);
	// 	}
	// 	else{
	// 		this.AIrun();
	// 	}
	// }

	var board_status = AI.borad_status(this.map, this.curt_color);
	if(board_status == AI.status.CHECK){
		Animation_Effect.getOrCreateExplosion("check");
	}
	else if(board_status == AI.status.KILL){
		Animation_Effect.getOrCreateExplosion("kill");
	}


	if(this.curt_color == CONFIG.COLOR.RED){
		this.active = false;
	}
	else{
		this.AIrun();
	}
}
GameLayer.prototype.regretCallback = function(src_pos, dst_pos, key, regret_manual){
	cc.log(JSON.stringify(src_pos)+"##" + JSON.stringify(dst_pos));
	this.map[dst_pos.y][dst_pos.x] = key;
	if(regret_manual.clear_key){
		this.map[src_pos.y][src_pos.x] = regret_manual.clear_key;
	}else{
		this.map[src_pos.y][src_pos.x] = undefined;
	}
	this.active = false;
	if(this.regret_step == 1){
		this.change_color();
	}
}
GameLayer.prototype.AIrun = function(){
	//AI  Test
	cc.log("ai map :#"+ this.map);
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
	//cc.log("coord_j ## " +  coord_j);
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
//ai_level 0 表示无电脑
GameLayer.scene = function(ai_level){
	var scene = new cc.Scene();
	var layer = new GameLayer(ai_level);
	scene.addChild(layer);
	return scene;
};




