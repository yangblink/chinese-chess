var CONFIG = CONFIG || {};
CONFIG.style = res;
//棋盘左下角棋子位置七点
CONFIG.start_x = 21;
CONFIG.start_y = 30;
//棋子直径
CONFIG.scale = 71;

//精灵绘制的层
CONFIG.UNIT_TAG = {
	CHESS_MOVE : 200,
	HINT : 90,			//棋子移动后留下的印记
	CHESS : 100,		//棋子
	CHECK : 300 
};
CONFIG.BTN_SIZE = {
	MENU_X: 200,
	MENU_Y: 60,

	GAME_X: 120,
	GAME_Y: 60
}

CONFIG.COLOR = {
	RED : 1,
	BLACK : -1
}

CONFIG.CONTAINER = {
	CHECK:[],	//将军动画
	CHESS:{},	//保存每个棋子的精灵
	HINT:null,	//棋子移动后的图标
	POINT:[]	//保存每个点的精灵
};

CONFIG.CHESS_MANUAL = [];	//棋谱

CONFIG.CHESS_TIME = {
	CHESS_MOVE : 0.5,			//棋子移动的时间
	CHECK_ANIM : 0.05			//将军效果显示时间
}


CONFIG.reset = function(){
	CONFIG.CONTAINER = {
		EFFECT:{
			CHECK:{},			//将军
			KILL:{}				//绝杀
		},
		CHECK:[],	//将军动画
		CHESS:{},	//保存每个棋子的精灵
		HINT:null,	//棋子移动后的图标
		POINT:[]	//保存每个点的精灵
	};
	CONFIG.CHESS_MANUAL = [];	//棋谱
}