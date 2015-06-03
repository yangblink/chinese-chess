//棋谱
var Chessmanual = function(map){
	this.map = map;
	this.manual_list = [];
};

Chessmanual.prototype.add = function(color, chess_name, src_pos, dst_pos, eaten_chess){
	var obj = {};
	obj.color = color;
	obj.chess_name = chess_name;
	obj.src_pos = src_pos;
	obj.dst_pos = dst_pos;

	// if(this.map[this.dst_pos.y][this.dst_pos.x]){
	// 	obj.eaten_chess = this.map[this.dst_pos.y][this.dst_pos.x];
	// }
	// else{
	// 	obj.eaten_chess = null;
	// }

	obj.eaten_chess = eaten_chess ? eaten_chess : null;
	this.manual_list.push(obj);
	//
	this.map[dst_pos.y][dst_pos.x] = this.map[src_pos.y][src_pos.x];
	this.map[src_pos.y][src_pos.x] = undefined;
}

Chessmanual.prototype.shift_manual = function(){
	if(this.manual_list.length > 0){
		var rst = this.manual_list.shift();
		return rst;
	}
	else{
		return null;
	}
}
