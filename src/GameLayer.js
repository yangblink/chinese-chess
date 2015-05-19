var g_sharedGmaeLayer;			//游戏层
var g_sharedChessLayer;			//棋盘精灵
var GameLayer = cc.Layer.extend({
	_board : null,
	_style : null,
	_map : null,
	ctor: function(mode){
		this._super();
		g_sharedGmaeLayer = this;
		this.init();
		this.mode = mode;
	},
	init: function(){
		var size = cc.winSize;
		this._style = CONFIG.style;
		var style = this._style;
		var bg = new cc.Sprite(style.chess_bg_png);
		bg.attr({
			x : size.width / 2,
			y : size.height / 2
		});
		this.addChild(bg, 0, 1);
		
		this._board = new cc.Sprite(style.chess_board_png);
		this._board.attr({
			x : size.width / 2,
			y : size.height / 2 + 50
		});
		this.addChild(this._board, 1, 2);
		g_sharedChessLayer = this._board;
		
		this._map = GameLayer.arr2Clone(Map.initMap);
		this.loadChessman(this._map);
	},
	loadChessman: function(map){
		for(var x = 0; x < map.length; x++){
			for(var y = 0; y < map[x].length; y++){
				var key = map[x][y];
				if(key){
					Chessman.create(x, y , key);
				}
			}
		}
	}
});


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



