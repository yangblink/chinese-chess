var g_sharedGmaeLayer;			//游戏层
var g_sharedChessLayer;			//棋盘精灵
var GameLayer = cc.Layer.extend({
	board : null,
	style : null,
	map : null,		//当前的地图
	point_map: [],
	focus : null,		//当前选中的棋子信息
	focus_chess : null,
	ctor: function(mode){
		this._super();
		g_sharedGmaeLayer = this;
		this.mode = mode;
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

		log("#@"+this.board.getTextureRect().width+"..."+this.board.getTextureRect().height);
		//加载地图
		this.map = GameLayer.arr2Clone(Map.initMap);
		this.loadChessman(this.map);
		//初始化着点
		Chesspoint.perset(style.chess_point_png);
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
	var self = this;
	//获取触摸点的坐标
	var index_coord = this.getChessIndex(x, y);
	//触摸点的棋子
	var chess_key = this.map[index_coord.y][index_coord.x];
	log("touch##"+chess_key);
	if(this.focus_chess){
		//如果点击在着点上
		if(this.point_map.some(function(item){return item.toString() == index_coord.toString()})){
			Chesspoint.clearPoint();
			var action = cc.sequence(
            	cc.moveTo(0.5, cc.p(self.x, self.y)),
            	cc.callFunc(self.touch_callback, self)
        	);
		}
		else{
			if(chess_key){
				Chesspoint.clearPoint();
				this.focus_chess = CONFIG.CONTAINER.CHESS[chess_key];
				this.drawPoint(this.focus_chess);
			}
		}
	}
	else{
		if(chess_key){
			this.focus_chess = CONFIG.CONTAINER.CHESS[chess_key];
			this.drawPoint(this.focus_chess);
		}
	}

}
//棋子移动完事件
GameLayer.prototype.moveCallback = function(){

}
//绘制着点
GameLayer.prototype.drawPoint = function(chess){
	var map = chess.bylaw();
	this.point_map = map;
	cc.log("drawPoint map ## "+map);
	Chesspoint.drwaPoint(map);
}

//根据坐标获取棋盘上的坐标
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
	//cc.log("getChessIndex ## x="+rstx+", y="+rsty);

	return {"x": rstx, "y": rsty};
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

GameLayer.getCoordByIndex = function(x, y){
	var rstx =  x * CONFIG.scale + CONFIG.start_x;
	var rsty = (9 - y) * CONFIG.scale + CONFIG.start_y;
	return {"x": rstx, "y": rsty};
}


