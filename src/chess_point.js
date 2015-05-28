//棋子可行走路径点
var Chesspoint = cc.Sprite.extend({
	active:true,
	xIndex: 0,
	yIndex: 0,
	ctor:function(img){
		this._super(img);
	}
});
Chesspoint.prototype.setIndex = function(x, y){
	this.xIndex = x;
	this.yIndex = y;
	this.x =  x * CONFIG.scale + CONFIG.start_x;
	this.y = (9 - y) * CONFIG.scale + CONFIG.start_y;l
}

Chesspoint.getOrCreateChesspoint = function(){
	var selChild = null;
	for(var i = 0; i < CONFIG.CONTAINER.POINT.length; i++){
		selChild = CONFIG.CONTAINER.POINT[i];
		if(selChild.active == false){
			selChild.visible = true;
			selChild.active = true;
			return selChild;
		}
	}
	log("##Error Chesspoint.getOrCreateChesspoint");
	return null;
}
Chesspoint.clearPoint = function(){
	var selChild = null;
	for(var i = 0; i < CONFIG.CONTAINER.POINT.length; i++){
		selChild = CONFIG.CONTAINER.POINT[i];
		selChild.visible = false;
		selChild.active = false;
	}
}
Chesspoint.create = function(img){
	var chesspoint = new Chesspoint(img);
	CONFIG.CONTAINER.POINT.push(chesspoint);
	g_sharedChessLayer.addChild(chesspoint, 101, 101);
	return chesspoint;
}
Chesspoint.perset = function(img){
	var n = 17;		//棋盘上最大点的个数
	var chess_point = null;
	for(var i = 0; i < n; i++){
		chess_point = Chesspoint.create(img);
		chess_point.visible = false;
		chess_point.active = false;
	}
}
Chesspoint.drwaPoint = function(map){
	for(var i = 0; i < map.length; i++){
		var point = Chesspoint.getOrCreateChesspoint();
		var x = map[i][0], y = map[i][1];
		point.visible = true;
		point.active = true;
		point.setIndex(x, y);
	}
}

