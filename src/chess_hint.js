var Chesshint = cc.Sprite.extend({
	ctor: function(img){
		this._super(img);
		this.visible = false;
	}
});

Chesshint.prototype.setPos = function(x, y){
	this.x = x;
	this.y = y;
	this.visible = true;
}

Chesshint.create = function(img){
	var chesshint = new Chesshint(img);
	CONFIG.CONTAINER.HINT = chesshint;
	g_sharedChessLayer.addChild(chesshint, CONFIG.UNIT_TAG.HINT, CONFIG.UNIT_TAG.HINT);
	return chesshint;
};