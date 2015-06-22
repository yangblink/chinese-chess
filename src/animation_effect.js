var Animation_Effect = cc.Sprite.extend({
    active: false,
	ctor:function(img, anima_str){
        this._super(img);
        this.visible = false;
        this.x = cc.winSize.width / 2;
        this.y = cc.winSize.height / 2;
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.animation = cc.animationCache.getAnimation(anima_str);
	},
    play:function(){
        cc.log("play Animation_Effect");
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

Animation_Effect.initEffect = function(img_arr, rect, anima_str){
    var animFrames = [];
    for(var i = 0; i<img_arr.length; i++){
        cc.log(img_arr[i]);
        var frame = new cc.SpriteFrame(img_arr[i], rect);
        animFrames.push(frame);
    }
    var animation = new cc.Animation(animFrames, CONFIG.CHESS_TIME.CHECK_ANIM);
    cc.animationCache.addAnimation(animation, anima_str);

    Animation_Effect.create(img_arr[0], anima_str);
	// var animFrames = [];
 //    var str = "";
 //    for (var i = 1; i < 13; i++) {
 //        str = "check_" + i;
 //        //var frame = cc.spriteFrameCache.getSpriteFrame(res[str]);
 //        var frame = new cc.SpriteFrame(res[str], cc.rect(0, 0, 332, 332));
 //        animFrames.push(frame);
 //    }
 //    var animation = new cc.Animation(animFrames, CONFIG.CHESS_TIME.CHECK_ANIM);
 //    cc.animationCache.addAnimation(animation, anima_str);
}

Animation_Effect.getOrCreateExplosion = function(anima_str){
    var effect = null;
    switch(anima_str){
        case "check":{
            effect = CONFIG.CONTAINER.EFFECT.CHECK;
            break;
        }
        case "kill":{
            effect = CONFIG.CONTAINER.EFFECT.KILL;
            break;
        }
        default:{
            cc.log("Error## invalid anima_str :" + anima_str);
            break;
        }
    }
    if(effect && effect.active == false){
        effect.active = true;
        effect.visible = true;
        effect.play();
    }
    return effect;



    // var selChild = null;
    // for(var i = 0; i < CONFIG.CONTAINER.CHECK.length; i++){
    //     var selChild = CONFIG.CONTAINER.CHECK[i];
    //     if(selChild.active == false){
    //         selChild.active = true;
    //         selChild.visible = true;  
    //         selChild.x = cc.winSize.width / 2;
    //         selChild.y = cc.winSize.height / 2;
    //         selChild.play();
    //         return selChild;
    //     }
    // }
    // selChild = Animation_Effect.create();
    // selChild.play();
    // return selChild;
}

Animation_Effect.create = function(img, anima_str){
	var effect = new Animation_Effect(img, anima_str);
	g_sharedGmaeLayer.addCheckEffect(effect);

    if("check" == anima_str){
        CONFIG.CONTAINER.EFFECT.CHECK = effect;
        //CONFIG.CONTAINER.CHECK.push(check);
    }
    else if("kill" == anima_str){
        CONFIG.CONTAINER.EFFECT.KILL = effect;
    }
    else{
        cc.log("Error invalid anima_str :" + anima_str);
    }
	
	return effect;
}

