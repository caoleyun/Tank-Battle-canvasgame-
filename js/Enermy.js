(function(){
	var Enermy=window.Enermy=function(){
		this.image = game.R["enemy"];
		//位置。注意，坦克在拐弯的时候，x、y都会被自动修正到16的倍数上去
		this.x = 0;
		this.y = 0;
		//方向URDL
		//随机一个方向
		this.direction ="D";
		changeDirection();
		if(this.direction == "R"){
			this.directionNumber = 1;
		}else if(this.direction == "D"){
			this.directionNumber = 2;
		} 
		//速度
		this.speed = 3;
		//履带状态0、1
		this.step = 0;
		//自己的子弹，游戏规定，一个子弹没有消失的时候，不能继续开火。
		this.bullet = null;
		//防止自己在同一个路口多次判断，此时就加一个锁
		this.lock = true;
		//上锁的这一帧的帧编号
		this.lockfno = 0;
	}

	// //随机选择方向
	function changeDirection(){

		
		console.log(parseInt(Math.random()*5));
	}

	//渲染地图
	Enermy.prototype.render=function(){
		//渲染自己
		game.ctx.drawImage(this.image,28 * this.step,28 * this.directionNumber,28,28,this.x + 2,this.y + 2,28,28);
	}

})();