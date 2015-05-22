//棋子可行走路径点
var Chesspoint = cc.Sprite.extend({
	active:true,
	ctor:function(img){
		this._super(img);
	}
});

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
	log("##Chesspoint.getOrCreateChesspoint");
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

