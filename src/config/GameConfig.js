var CONFIG = CONFIG || {};
CONFIG.style = res;

//棋盘左下角棋子位置七点
CONFIG.start_x = 21;
CONFIG.start_y = 30;
//棋子直径
CONFIG.scale = 71;

//
CONFIG.UNIT_TAG = {
	//CH
};

CONFIG.CONTAINER = {
	CHESS:{},	//保存每个棋子的精灵
	POINT:[]	//保存每个点的精灵
};

CONFIG.CHESS_MANUAL = [];	//棋谱