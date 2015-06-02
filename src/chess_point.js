//棋子可行走路径点
var Chesspoint = cc.Sprite.extend({
	active:true,
	xIndex: 0,
	yIndex: 0,
	ctor:function(img){
		this._super(img);
		//this.init();
	},
	init:function(){
		var self = this;
		var listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function (touch, event) {
				if(!self.active)
					return false;
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, locationInNode)) {
					self.onTouch();
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
		cc.eventManager.addListener(listener1, this);
	},
	onTouch:function(){
		var self = this;
		if(!g_sharedGmaeLayer.focus){
			log("##Error chess_point touch no focus");
			return;
		}

		Chesspoint.clearPoint();
		var src_chess = CONFIG.CONTAINER.CHESS[g_sharedGmaeLayer.focus];
		var action = cc.sequence(
            cc.moveTo(0.5, cc.p(self.x, self.y)),
            cc.callFunc(self.touch_callback, self)
        );
        log(this.yIndex+"@"+this.xIndex+"--"+src_chess.yIndex+"@"+src_chess.xIndex);
		src_chess.runAction(action);
	},
	touch_callback:function(){
		log("touch_callback");
		var src_chess = CONFIG.CONTAINER.CHESS[g_sharedGmaeLayer.focus];
		var key = src_chess._key;
		log(g_sharedGmaeLayer.map);
		g_sharedGmaeLayer.map[this.yIndex][this.xIndex] = key;
		g_sharedGmaeLayer.map[src_chess.yIndex][src_chess.xIndex] = undefined;
		log(g_sharedGmaeLayer.map);
		src_chess.setIndex(this.xIndex, this.yIndex);
		g_sharedGmaeLayer.point_map = [];
		//清除点
		Chesspoint.clearPoint();
	}
});
Chesspoint.prototype.setIndex = function(x, y){
	this.xIndex = x;
	this.yIndex = y;
	this.x =  x * CONFIG.scale + CONFIG.start_x;
	this.y = (9 - y) * CONFIG.scale + CONFIG.start_y;
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

