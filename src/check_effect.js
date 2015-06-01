//将军特效
var CheckEffect = cc.Sprite.extend({
    active: true,
	ctor:function(){
        this._super(res.check_1);
        this.x = cc.winSize.width / 2;
        this.y = cc.winSize.height / 2;
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.animation = cc.animationCache.getAnimation("Check");
	},
    play:function(){
        cc.log("play CheckEffect");
        this.runAction(cc.sequence(
            cc.animate(this.animation),
            cc.callFunc(this.destroy, this)
        ));
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

CheckEffect.shareCheckEffect = function(){
	var animFrames = [];
    var str = "";
    for (var i = 1; i < 13; i++) {
        str = "check_" + i;
        //var frame = cc.spriteFrameCache.getSpriteFrame(res[str]);
        var frame = new cc.SpriteFrame(res[str], cc.rect(0, 0, 332, 332));
        animFrames.push(frame);
    }
    var animation = new cc.Animation(animFrames, CONFIG.CHESS_TIME.CHECK_ANIM);
    cc.animationCache.addAnimation(animation, "Check");
}

CheckEffect.getOrCreateExplosion = function(){
    var selChild = null;
    for(var i = 0; i < CONFIG.CONTAINER.CHECK.length; i++){
        var selChild = CONFIG.CONTAINER.CHECK[i];
        if(selChild.active == false){
            selChild.active = true;
            selChild.visible = true;
            selChild.x = cc.winSize.width / 2;
            selChild.y = cc.winSize.height / 2;
            selChild.play();
            return selChild;
        }
    }
    selChild = CheckEffect.create();
    selChild.play();
    return selChild;
}

CheckEffect.create = function(){
	var check = new CheckEffect();
	g_sharedGmaeLayer.addCheckEffect(check);
	CONFIG.CONTAINER.CHECK.push(check);
	return check;
}

