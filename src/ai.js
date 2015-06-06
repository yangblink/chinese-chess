var AI = AI || {};
// var AI = function(depth){
// 	AI.treeDepth = depth;
// }

AI.setDepth = function(depth){
	//AI.treeDepth = depth;
	AI.treeDepth = 3;
}

AI.init = function(map, my){
	var val=AI.getAlphaBeta(-99999 ,99999, AI.treeDepth, map, my);

	cc.log("AI init ## " + JSON.stringify(val));
	return val;
}

//局面评估函数
AI.evaluate = function(map, my){
	var val=0;
	for (var i=0; i<map.length; i++){
		for (var n=0; n<map[i].length; n++){
			var key = map[i][n];
			if (key){
				var chess = CONFIG.CONTAINER.CHESS[key];
				val += chess.value_table[i][n] * chess.chess_color;
				//val += play.mans[key].value[i][n] * play.mans[key].my;
			}
		}
	}
	return val;
}
AI.getMoves = function(map, my){
	var moves = [];
	for(var i = 0; i < map.length; i++){
		for(var j = 0; j < map[i].length; j++){
			var key = map[i][j];
			if(key){
				var chess = CONFIG.CONTAINER.CHESS[key];
				if (chess.chess_color != my)
					continue;
				var point_map = chess.bylaw(map, j, i);
				for(var n=0; n < point_map.length; n++){
					moves.push([j, i, point_map[n][0], point_map[n][1], key]);
				}
			}
		}
	}
	return moves;
}
AI.getAlphaBeta = function (A, B, depth, map ,my){
	if(0 == depth){
		return {"value": AI.evaluate(map, my)};	//返回局面评估函数
	}
	var moves = AI.getMoves(map, my), rootKey = null;
	//cc.log("my## "+my+" getAlphaBeta ## " + moves);
	for(var i = 0; i < moves.length; i++){
		//走这个走法
		var move = moves[i], key = move[4], oldX = move[0], oldY = move[1], newX = move[2], newY = move[3], clearKey = map[newY][newX] || undefined;
		map[newY][newX] = key;
		map[oldY][oldX] = undefined;
		//cc.log("move###"+move);
		//吃将
		if(clearKey == "j0" || clearKey == "J0"){
			//cc.log("clearKey J  key:" + key);
			map[oldY][oldX] = key;
			map[newY][newX] = clearKey;

			return {"key":key,"x":newX,"y":newY,"value":8888};
		}
		else{
			var val = -AI.getAlphaBeta(-B, -A, depth-1, map, -my).value;
			//cc.log("getAlphaBeta  key## "+ key+" #val# " + val +" #depth#"+depth + " #B#"+B +" #A#"+A+" #my## "+my);
			map[oldY][oldX] = key;
			map[newY][newX] = clearKey;

			if(val >= B){
				return {"key":key,"x":newX,"y":newY,"value":B}; 
			}

			if(val > A){
				A = val;
				if(AI.treeDepth == depth)
					rootKey = {"key":key,"x":newX,"y":newY,"value":A};
			}

		}

	}

	if(AI.treeDepth == depth){
		cc.log(AI.treeDepth + "#" + JSON.stringify(rootKey));
		return rootKey ? rootKey : false;
	}
	return {"key":key,"x":newX,"y":newY,"value":A}; 
}



