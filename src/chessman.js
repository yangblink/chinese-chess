//象棋棋子类
var Chessman = cc.Sprite.extend({
	xIndex: 0,					//在二维数组中的坐标
	yIndex: 0,
	man_name: null,			//棋子的简称  (c, m, x, s...)
	key: null,					//棋子的名称  (z1, z2, p1 ...)
	chess_color: CONFIG.COLOR.RED,
	ctor:function(x, y, key){
		var pater = key.slice(0,1);
		var o = Chessman.args[pater];
		var img = CONFIG.style[o.img];
		this._super(img);

		//log(pater + "##" + key);
		if(pater.match(/[A-Z]/)){
			this.chess_color = CONFIG.COLOR.BLACK;
		}
		this.value_table = Chessman.value[pater];		//棋子的价值表
		this.man_name = pater;
		this.key = key;
		this.xIndex = x;
		this.yIndex = y;

		this.x = x * CONFIG.scale + CONFIG.start_x;
		this.y = (9 - y) * CONFIG.scale + CONFIG.start_y;
	}
});
//设置棋子的坐标和位置
Chessman.prototype.setIndex = function(x, y){
	this.xIndex = x;
	this.yIndex = y;
}
//根据棋盘上点在二维数组中的坐标 获取 点的绝对坐标
Chessman.prototype.getCoordByIndex = function(x, y){
	var rstx =  x * CONFIG.scale + CONFIG.start_x;
	var rsty = (9 - y) * CONFIG.scale + CONFIG.start_y;
	return {"x": rstx, "y": rsty};
}
//获取棋子着点
Chessman.prototype.bylaw = function(){
	var pater = this.key.slice(0,1);
	var o = Chessman.args[pater];
	var fun = pater.toLowerCase();

	var point_map = Chessman.bylaw[fun](this.xIndex, this.yIndex, this.key, g_sharedGmaeLayer.map, this.chess_color);
	//cc.log("bylaw ##"+point_map);
	return point_map;
}
/**
 * 棋子移动
 * @param  {x,y} pos 	[移动到的位置]
 * @return {[type]}     [description]
 */
Chessman.prototype.move = function(pos){
	var self = this;
	//设置移动后的示意点
	var hint = CONFIG.CONTAINER.HINT;
	hint.setPos(self.x, self.y);

	var coord = this.getCoordByIndex(pos.x, pos.y);
	this.zIndex = CONFIG.UNIT_TAG.CHESS_MOVE;
	//cc.log("move frome["+this.xIndex+","+this.yIndex+"] to ["+pos.x+","+pos.y+"]");
	var action = cc.sequence(
    	cc.moveTo(CONFIG.CHESS_TIME.CHESS_MOVE, cc.p(coord.x, coord.y)),
    	cc.callFunc(this.moveDone, self, pos)
	);
	this.runAction(action);
}
//移动结束
Chessman.prototype.moveDone =  function(node, dst_pos){
	var src_pos = {x: this.xIndex, y: this.yIndex};
	this.zIndex = CONFIG.UNIT_TAG.CHESS;
	this.setIndex(dst_pos.x, dst_pos.y);
	g_sharedGmaeLayer.moveCallback(src_pos, dst_pos);
}

var GetColor = function(key){
	if(CONFIG.CONTAINER.CHESS[key])
		return CONFIG.CONTAINER.CHESS[key].chess_color;
	else{
		cc.log("##GetColor Error :"+key);
		return 1;
	}
}
//棋子能走的着点
Chessman.bylaw = {};
//车
Chessman.bylaw.c = function (x, y, key, map, my){
	var d=[], i;
	//左侧检索
	for (i=x-1; i>= 0; i--){
		if (map[y][i]) {
			if (GetColor(map[y][i])!=my) 
				d.push([i,y]);
			break
		}else{
			d.push([i,y])
		}
	}
	//右侧检索
	for (i=x+1; i <= 8; i++){
		if (map[y][i]) {
			if (GetColor(map[y][i])!=my) 
				d.push([i,y]);
			break
		}else{
			d.push([i,y])	
		}
	}
	//上检索
	for (i = y-1 ; i >= 0; i--){
		if (map[i][x]) {
			if (GetColor(map[i][x])!=my) 
				d.push([x,i]);
			break
		}else{
			d.push([x,i])	
		}
	}
	//下检索
	for (i = y+1 ; i<= 9; i++){
		if (map[i][x]) {
			if (GetColor(map[i][x])!=my) 
				d.push([x,i]);
			break
		}else{
			d.push([x,i])
		}
	}
	return d;
}

//马
Chessman.bylaw.m = function (x, y, key, map, my){
	var d=[];
	//1点
	if ( y-2>= 0 && x+1<= 8 && !map[y-1][x] &&(!map[y-2][x+1] || GetColor(map[y-2][x+1])!=my)) d.push([x+1,y-2]);
	//2点
	if ( y-1>= 0 && x+2<= 8 && !map[y][x+1] &&(!map[y-1][x+2] || GetColor(map[y-1][x+2])!=my)) d.push([x+2,y-1]);
	//4点
	if ( y+1<= 9 && x+2<= 8 && !map[y][x+1] &&(!map[y+1][x+2] || GetColor(map[y+1][x+2])!=my)) d.push([x+2,y+1]);
	//5点
	if ( y+2<= 9 && x+1<= 8 && !map[y+1][x] &&(!map[y+2][x+1] || GetColor(map[y+2][x+1])!=my)) d.push([x+1,y+2]);
	//7点
	if ( y+2<= 9 && x-1>= 0 && !map[y+1][x] &&(!map[y+2][x-1] || GetColor(map[y+2][x-1])!=my)) d.push([x-1,y+2]);
	//8点
	if ( y+1<= 9 && x-2>= 0 && !map[y][x-1] &&(!map[y+1][x-2] || GetColor(map[y+1][x-2])!=my)) d.push([x-2,y+1]);
	//10点
	if ( y-1>= 0 && x-2>= 0 && !map[y][x-1] &&(!map[y-1][x-2] || GetColor(map[y-1][x-2])!=my)) d.push([x-2,y-1]);
	//11点
	if ( y-2>= 0 && x-1>= 0 && !map[y-1][x] &&(!map[y-2][x-1] || GetColor(map[y-2][x-1])!=my)) d.push([x-1,y-2]);

	return d;
}

//相
Chessman.bylaw.x = function (x, y, key, map, my){
	var d=[];
	if (my===1){ //红方
		//4点半
		if ( y+2<= 9 && x+2<= 8 && !map[y+1][x+1] && (!map[y+2][x+2] || GetColor(map[y+2][x+2])!=my)) d.push([x+2,y+2]);
		//7点半
		if ( y+2<= 9 && x-2>= 0 && !map[y+1][x-1] && (!map[y+2][x-2] || GetColor(map[y+2][x-2])!=my)) d.push([x-2,y+2]);
		//1点半
		if ( y-2>= 5 && x+2<= 8 && !map[y-1][x+1] && (!map[y-2][x+2] || GetColor(map[y-2][x+2])!=my)) d.push([x+2,y-2]);
		//10点半
		if ( y-2>= 5 && x-2>= 0 && !map[y-1][x-1] && (!map[y-2][x-2] || GetColor(map[y-2][x-2])!=my)) d.push([x-2,y-2]);
	}else{
		//4点半
		if ( y+2<= 4 && x+2<= 8 && !map[y+1][x+1] && (!map[y+2][x+2] || GetColor(map[y+2][x+2])!=my)) d.push([x+2,y+2]);
		//7点半
		if ( y+2<= 4 && x-2>= 0 && !map[y+1][x-1] && (!map[y+2][x-2] || GetColor(map[y+2][x-2])!=my)) d.push([x-2,y+2]);
		//1点半
		if ( y-2>= 0 && x+2<= 8 && !map[y-1][x+1] && (!map[y-2][x+2] || GetColor(map[y-2][x+2])!=my)) d.push([x+2,y-2]);
		//10点半
		if ( y-2>= 0 && x-2>= 0 && !map[y-1][x-1] && (!map[y-2][x-2] || GetColor(map[y-2][x-2])!=my)) d.push([x-2,y-2]);
	}
	return d;
}

//士
Chessman.bylaw.s = function (x, y, key, map, my){
	var d=[];
	if (my===1){ //红方
		//4点半
		if ( y+1<= 9 && x+1<= 5 && (!map[y+1][x+1] || GetColor(map[y+1][x+1])!=my)) d.push([x+1,y+1]);
		//7点半
		if ( y+1<= 9 && x-1>= 3 && (!map[y+1][x-1] || GetColor(map[y+1][x-1])!=my)) d.push([x-1,y+1]);
		//1点半
		if ( y-1>= 7 && x+1<= 5 && (!map[y-1][x+1] || GetColor(map[y-1][x+1])!=my)) d.push([x+1,y-1]);
		//10点半
		if ( y-1>= 7 && x-1>= 3 && (!map[y-1][x-1] || GetColor(map[y-1][x-1])!=my)) d.push([x-1,y-1]);
	}else{
		//4点半
		if ( y+1<= 2 && x+1<= 5 && (!map[y+1][x+1] || GetColor(map[y+1][x+1])!=my)) d.push([x+1,y+1]);
		//7点半
		if ( y+1<= 2 && x-1>= 3 && (!map[y+1][x-1] || GetColor(map[y+1][x-1])!=my)) d.push([x-1,y+1]);
		//1点半
		if ( y-1>= 0 && x+1<= 5 && (!map[y-1][x+1] || GetColor(map[y-1][x+1])!=my)) d.push([x+1,y-1]);
		//10点半
		if ( y-1>= 0 && x-1>= 3 && (!map[y-1][x-1] || GetColor(map[y-1][x-1])!=my)) d.push([x-1,y-1]);
	}
	return d;
		
}

//将
Chessman.bylaw.j = function (x, y, key, map, my){
	var d=[];
	// var isNull=(function (y1,y2){
	// 	var y1=com.mans["j0"].y;
	// 	var x1=com.mans["J0"].x;
	// 	var y2=com.mans["J0"].y;
	// 	for (var i=y1-1; i>y2; i--){
	// 		if (map[i][x1]) return false;
	// 	}
	// 	return true;
	// })();
	
	if (my===1){ //红方
		//下
		if ( y+1<= 9  && (!map[y+1][x] || GetColor(map[y+1][x])!=my)) d.push([x,y+1]);
		//上
		if ( y-1>= 7 && (!map[y-1][x] || GetColor(map[y-1][x])!=my)) d.push([x,y-1]);
		//老将对老将的情况
		//if ( com.mans["j0"].x == com.mans["J0"].x &&isNull) d.push([com.mans["J0"].x,com.mans["J0"].y]);
		
	}else{
		//下
		if ( y+1<= 2  && (!map[y+1][x] || GetColor(map[y+1][x])!=my)) d.push([x,y+1]);
		//上
		if ( y-1>= 0 && (!map[y-1][x] || GetColor(map[y-1][x])!=my)) d.push([x,y-1]);
		//老将对老将的情况
		//if ( com.mans["j0"].x == com.mans["J0"].x &&isNull) d.push([com.mans["j0"].x,com.mans["j0"].y]);
	}
	//右
	if ( x+1<= 5  && (!map[y][x+1] || GetColor(map[y][x+1])!=my)) d.push([x+1,y]);
	//左
	if ( x-1>= 3 && (!map[y][x-1] || GetColor(map[y][x-1])!=my)) d.push([x-1,y]);
	return d;
}

//炮
Chessman.bylaw.p = function (x, y, key, map, my){
	var d=[];
	//左侧检索
	var n=0;
	for (var i=x-1; i>= 0; i--){
		if (map[y][i]) {
			if (n==0){
				n++;
				continue;
			}else{
				if (GetColor(map[y][i])!=my) d.push([i,y]);
				break	
			}
		}else{
			if(n==0) d.push([i,y])	
		}
	}
	//右侧检索
	var n=0;
	for (var i=x+1; i <= 8; i++){
		if (map[y][i]) {
			if (n==0){
				n++;
				continue;
			}else{
				if (GetColor(map[y][i])!=my) d.push([i,y]);
				break	
			}
		}else{
			if(n==0) d.push([i,y])	
		}
	}
	//上检索
	var n=0;
	for (var i = y-1 ; i >= 0; i--){
		if (map[i][x]) {
			if (n==0){
				n++;
				continue;
			}else{
				if (GetColor(map[i][x])!=my) d.push([x,i]);
				break	
			}
		}else{
			if(n==0) d.push([x,i])	
		}
	}
	//下检索
	var n=0;
	for (var i = y+1 ; i<= 9; i++){
		if (map[i][x]) {
			if (n==0){
				n++;
				continue;
			}else{
				if (GetColor(map[i][x])!=my) d.push([x,i]);
				break	
			}
		}else{
			if(n==0) d.push([x,i])	
		}
	}
	return d;
}

//卒
Chessman.bylaw.z = function (x, y, key, map, my){
	var d=[];
	if (my===1){ //红方
		//上
		if ( y-1>= 0 && (!map[y-1][x] || GetColor(map[y-1][x])!=my)) d.push([x,y-1]);
		//右
		if ( x+1<= 8 && y<=4  && (!map[y][x+1] || GetColor(map[y][x+1])!=my)) d.push([x+1,y]);
		//左
		if ( x-1>= 0 && y<=4 && (!map[y][x-1] || GetColor(map[y][x-1])!=my))d.push([x-1,y]);
	}else{
		//下
		if ( y+1<= 9  && (!map[y+1][x] || GetColor(map[y+1][x])!=my)) d.push([x,y+1]);
		//右
		if ( x+1<= 8 && y>=5  && (!map[y][x+1] || GetColor(map[y][x+1])!=my)) d.push([x+1,y]);
		//左
		if ( x-1>= 0 && y>=5 && (!map[y][x-1] || GetColor(map[y][x-1])!=my))d.push([x-1,y]);
     	}
	return d;
}
	
Chessman.value = {
	//车价值
	c:[
	[206, 208, 207, 213, 214, 213, 207, 208, 206],
	[206, 212, 209, 216, 233, 216, 209, 212, 206],
	[206, 208, 207, 214, 216, 214, 207, 208, 206],
	[206, 213, 213, 216, 216, 216, 213, 213, 206],
	[208, 211, 211, 214, 215, 214, 211, 211, 208],
	
	[208, 212, 212, 214, 215, 214, 212, 212, 208],
	[204, 209, 204, 212, 214, 212, 204, 209, 204],
	[198, 208, 204, 212, 212, 212, 204, 208, 198],
	[200, 208, 206, 212, 200, 212, 206, 208, 200],
	[194, 206, 204, 212, 200, 212, 204, 206, 194]
	],
	
	//马价值
	m:[
	[90, 90, 90, 96, 90, 96, 90, 90, 90],
	[90, 96,103, 97, 94, 97,103, 96, 90],
	[92, 98, 99,103, 99,103, 99, 98, 92],
	[93,108,100,107,100,107,100,108, 93],
	[90,100, 99,103,104,103, 99,100, 90],
	
	[90, 98,101,102,103,102,101, 98, 90],
	[92, 94, 98, 95, 98, 95, 98, 94, 92],
	[93, 92, 94, 95, 92, 95, 94, 92, 93],
	[85, 90, 92, 93, 78, 93, 92, 90, 85],
	[88, 85, 90, 88, 90, 88, 90, 85, 88]
	],
	
	//相价值
	x:[
	[0, 0,20, 0, 0, 0,20, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0,23, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0,20, 0, 0, 0,20, 0, 0],
	
	[0, 0,20, 0, 0, 0,20, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[18,0, 0, 0,23, 0, 0, 0,18],
	[0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[0, 0,20, 0, 0, 0,20, 0, 0]
	],
	
	//士价值
	s:[
	[0, 0, 0,20, 0,20, 0, 0, 0],
	[0, 0, 0, 0,23, 0, 0, 0, 0],
	[0, 0, 0,20, 0,20, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0,20, 0,20, 0, 0, 0],
	[0, 0, 0, 0,23, 0, 0, 0, 0], 
	[0, 0, 0,20, 0,20, 0, 0, 0]
	],
	
	//奖价值
	j:[
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], 
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], 
	[0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
	],
	
	//炮价值
	p:[
	[100, 100,  96, 91,  90, 91,  96, 100, 100],
	[ 98,  98,  96, 92,  89, 92,  96,  98,  98],
	[ 97,  97,  96, 91,  92, 91,  96,  97,  97],
	[ 96,  99,  99, 98, 100, 98,  99,  99,  96],
	[ 96,  96,  96, 96, 100, 96,  96,  96,  96], 
	
	[ 95,  96,  99, 96, 100, 96,  99,  96,  95],
	[ 96,  96,  96, 96,  96, 96,  96,  96,  96],
	[ 97,  96, 100, 99, 101, 99, 100,  96,  97],
	[ 96,  97,  98, 98,  98, 98,  98,  97,  96],
	[ 96,  96,  97, 99,  99, 99,  97,  96,  96]
	],
	
	//卒价值
	z:[
	[ 9,  9,  9, 11, 13, 11,  9,  9,  9],
	[19, 24, 34, 42, 44, 42, 34, 24, 19],
	[19, 24, 32, 37, 37, 37, 32, 24, 19],
	[19, 23, 27, 29, 30, 29, 27, 23, 19],
	[14, 18, 20, 27, 29, 27, 20, 18, 14],
	
	[ 7,  0, 13,  0, 16,  0, 13,  0,  7],
	[ 7,  0,  7,  0, 15,  0,  7,  0,  7], 
	[ 0,  0,  0,  0,  0,  0,  0,  0,  0],
	[ 0,  0,  0,  0,  0,  0,  0,  0,  0],
	[ 0,  0,  0,  0,  0,  0,  0,  0,  0]
	]
}
//二维数组克隆
Chessman.arr2Clone = function (arr){
	var newArr=[];
	for (var i=0; i<arr.length ; i++){	
		newArr[i] = arr[i].slice();
	}
	return newArr;
}
//黑子为红字价值位置的倒置
Chessman.value.C = Chessman.arr2Clone(Chessman.value.c).reverse();
Chessman.value.M = Chessman.arr2Clone(Chessman.value.m).reverse();
Chessman.value.X = Chessman.value.x;
Chessman.value.S = Chessman.value.s;
Chessman.value.J = Chessman.value.j;
Chessman.value.P = Chessman.arr2Clone(Chessman.value.p).reverse();
Chessman.value.Z = Chessman.arr2Clone(Chessman.value.z).reverse();

Chessman.args = {
	//红子 中文/图片地址/阵营/权重
	'c':{text:"车", img:'r_c', my:1 ,bl:"c", value:Chessman.value.c},
	'm':{text:"马", img:'r_m', my:1 ,bl:"m", value:Chessman.value.m},
	'x':{text:"相", img:'r_x', my:1 ,bl:"x", value:Chessman.value.x},
	's':{text:"仕", img:'r_s', my:1 ,bl:"s", value:Chessman.value.s},
	'j':{text:"将", img:'r_j', my:1 ,bl:"j", value:Chessman.value.j},
	'p':{text:"炮", img:'r_p', my:1 ,bl:"p", value:Chessman.value.p},
	'z':{text:"兵", img:'r_z', my:1 ,bl:"z", value:Chessman.value.z},

	//蓝子
	'C':{text:"車", img:'b_c', my:-1 ,bl:"c", value:Chessman.value.C},
	'M':{text:"馬", img:'b_m', my:-1 ,bl:"m", value:Chessman.value.M},
	'X':{text:"象", img:'b_x', my:-1 ,bl:"x", value:Chessman.value.X},
	'S':{text:"士", img:'b_s', my:-1 ,bl:"s", value:Chessman.value.S},
	'J':{text:"帅", img:'b_j', my:-1 ,bl:"j", value:Chessman.value.J},
	'P':{text:"炮", img:'b_p', my:-1 ,bl:"p", value:Chessman.value.P},
	'Z':{text:"卒", img:'b_z', my:-1 ,bl:"z", value:Chessman.value.Z}
};

Chessman.create = function(x, y, key){
	//x y坐标交换
	//var chess = new Chessman(x, y, key);
	var chess = new Chessman(x, y, key);
	CONFIG.CONTAINER.CHESS[key] = chess;
	g_sharedChessLayer.addChild(chess, CONFIG.UNIT_TAG.CHESS, CONFIG.UNIT_TAG.CHESS);
	return chess;
}