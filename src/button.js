var Button = ccui.Button.extend({
    ctor:function(width, height, title, callback){
        this._super();

        this.setTouchEnabled(true);
        this.setScale9Enabled(true);
        this.loadTextures(res.menu_btn_normal, res.menu_btn_down, "");
        this.setContentSize(cc.size(width, height));
        this.addClickEventListener(callback);
        this.setTitleText(title);
        this.setTitleFontSize(25);
        this.setTitleColor(cc.color.BLACK);
    }
});


Button.prototype.setPos = function(x, y){
    this.x = x;
    this.y = y;
}


Button.create = function(width, height, title, callback){
    var btn = new Button(width, height, title, callback);
    //g_sharedGmaeLayer.addCheckEffect(check);
    return btn;
}