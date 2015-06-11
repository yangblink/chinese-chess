//棋谱
var Chessmanual = function(){
	this.manual_list = [];
};
Chessmanual.prototype.reset = function(){
	this.manual_list = [];
}
Chessmanual.prototype.add = function(key, src_pos, dst_pos, clear_key){
	var obj = {};
	obj.key = key;
	obj.src_pos = src_pos;
	obj.dst_pos = dst_pos;
	obj.clear_key = clear_key ? clear_key : null;
	this.manual_list.push(obj);
}
Chessmanual.prototype.pop = function(){
	if(this.manual_list.length > 0){
		var rst = this.manual_list.pop();
		return rst;
	}
	else{
		return null;
	}
}

Chessmanual.prototype.getStep = function(){
	return this.manual_list.length;
}
