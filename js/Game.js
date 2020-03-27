(function(){
	var Game=window.Game=function(params){
		//得到画布
		this.canvas=document.getElementById(params.canvasid);
		//得到上下文
		this.ctx=this.canvas.getContext("2d");
		//资源文件地址
		this.Rjsonurl=params.Rjsonurl;
		//帧编号
		this.fno=0;
		//关卡编号
		this.stage=3;
		

		//读取资源
		var self=this;
		//读取资源是一个异步函数，所以我们不知道什么时候执行完毕。但是其他的事情必须等到他完毕之后再执行，必须用回调函数。
		this.loadAllResource(function(){
			self.start();
			// 绑定监听
			self.bindEvent();
		});
	}

	//改变某个字符 0-无 1-砖头 2-刚块 3-草地 4-水面 5- 水面 6-老家 7-死的老家 8-自己 9-敌人
	// Game.prototype.changeSpiritCode=function(row,col,landtype){
	// 	this.spiritCode[row]=this.spiritCode[row].substr(0,col)+landtype+this.spiritCode[row].substr(col+1);
	// }

	//读取资源
	Game.prototype.loadAllResource=function(callback){
		//准备一个R对象
		this.R={};
		var self =this;
		//计数器
		var alreadyDoneNumber=0;
		//发出请求 请求JSON文件
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				var Robj=JSON.parse(xhr.responseText);
				//遍历数组
				for(var i=0;i<Robj.images.length;i++){
					//创建同名key
					self.R[Robj.images[i].name]=new Image();
					//监听
					self.R[Robj.images[i].name].onload=function(){
						alreadyDoneNumber++;
						//清屏
						self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
						//提示文字
						var txt="正在加载"+alreadyDoneNumber+"/"+Robj.images.length+"请稍后...";
						//放置居中位置 屏幕黄金分割点
						self.ctx.textAlign="center";
						self.ctx.font="20px 微软雅黑";
						self.ctx.fillText(txt,self.canvas.width/2,self.canvas.height*(1-0.618));
						//判断是否已经全部加载完成
						if(alreadyDoneNumber==Robj.images.length){
							callback();
						}
					}
					//请求
					self.R[Robj.images[i].name].src=Robj.images[i].url;
				}
			}
		}
		xhr.open("get",this.Rjsonurl,true);
		xhr.send(null);
	}

	//开始游戏
	Game.prototype.start=function(){
		var self=this;
		//实例化自己的地图类
		this.map=new Map();
		//实例化玩家 
		this.playerarr=[new Player()];
		//实例化 敌人（一会儿变成数组）；
		this.enermyarr = [new Enermy(0,0),new Enermy(64,0)];/*,new Enermy(64,0) */
		




		//设置定时器
		this.timer=setInterval(function(){
			//清屏
			self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);

			//更新玩家、渲染玩家
			for(var i=0;i<self.playerarr.length;i++){
				
				var spiritArr=[];

				//将自己的速度变回原来速度
				self.playerarr[i].speed=3;

				//剔除 自己
				for(var k=0;k<self.playerarr.length;k++){
					if(i!=k){
						spiritArr.push(self.playerarr[k]);
					}
				}
				spiritArr=spiritArr.concat(self.enermyarr);
				// console.log(spiritArr);


				for(var j=0;j<spiritArr.length;j++){
					//判断 敌人是否碰撞敌人
					if(
						(Math.abs(self.playerarr[i].x-spiritArr[j].x)<=32)&&(Math.abs(self.playerarr[i].y-spiritArr[j].y)<=32)
					){

						//判断自己的方向
						// switch(self.playerarr[i].direction){
						// 	case "U":
						// 		console.log("U");
						// 		self.playerarr[i].y=self.playerarr[i].y+3;
						// 		break;
						// 	case "R":
						// 		console.log("R");
						// 		self.playerarr[i].x=self.playerarr[i].x-3;
						// 		break;
						// 	case "D":
						// 		console.log("D");
						// 		self.playerarr[i].y=self.playerarr[i].y-3;
						// 		break;
						// 	case "L":
						// 		console.log("L");
						// 		self.playerarr[i].x=self.playerarr[i].x+3;
						// 		break;
						// }

						// self.playerarr[i].isMoving=false;
						self.playerarr[i].speed=0;

					}
				}

				//在进一步前进时 判断会不会 碰撞 如果碰撞 就
				
				self.playerarr[i].update();
				self.playerarr[i].render();
			}

			//渲染敌人
			for(var i=0;i<self.enermyarr.length;i++){

				var spiritArr=[];
				
				//以时间为基础 定时改变敌人的方向
				if(self.fno%100==0){
					self.enermyarr[i].changeDirection();	
				}

				//剔除 自己
				for(var k=0;k<self.enermyarr.length;k++){
					if(i!=k){
						spiritArr.push(self.enermyarr[k]);
					}
				}
				spiritArr=spiritArr.concat(self.playerarr);
				// console.log(spiritArr);

				for(var j=0;j<spiritArr.length;j++){
					//判断 敌人是否碰撞敌人
					if(
						(Math.abs(self.enermyarr[i].x-spiritArr[j].x)<=32)&&(Math.abs(self.enermyarr[i].y-spiritArr[j].y)<=32)
					){
						// //判断自己的方向
						// switch(self.enermyarr[i].direction){
						// 	case "U":
						// 		console.log("U");
						// 		self.enermyarr[i].y=self.enermyarr[i].y+3;
						// 		break;
						// 	case "R":
						// 		console.log("R");
						// 		self.enermyarr[i].x=self.enermyarr[i].x-3;
						// 		break;
						// 	case "D":
						// 		console.log("D");
						// 		self.enermyarr[i].y=self.enermyarr[i].y-3;
						// 		break;
						// 	case "L":
						// 		console.log("L");
						// 		self.enermyarr[i].x=self.enermyarr[i].x+3;
						// 		break;
						// }
						var directionArr=["U","R","D","L"];
						self.enermyarr[i].changeDirection(directionArr[(self.enermyarr[i].directionNumber+2)%4]);	

					}
				}

				self.enermyarr[i].update();
				self.enermyarr[i].render();

			}


			//渲染地图
			self.map.render();



			//帧编号
			self.fno++;
			//打印帧编号
			self.ctx.fillStyle="white";
			self.ctx.font="16px consolas";
			self.ctx.textAlign="left";
			self.ctx.fillText("FNO:"+self.fno,10,20);

		},20);
	}

	// 监听
	Game.prototype.bindEvent=function(){
		var self =this;
		$(document).keydown(function(event){

			if(event.keyCode==38){
				self.playerarr[0].changeDirection("U");
				self.playerarr[0].isMoving=true;				
			}else if(event.keyCode==39){
				self.playerarr[0].changeDirection("R");
				self.playerarr[0].isMoving=true;	
			}else if(event.keyCode==40){
				self.playerarr[0].changeDirection("D");
				self.playerarr[0].isMoving=true;	
			}else if(event.keyCode==37){
				self.playerarr[0].changeDirection("L");
				self.playerarr[0].isMoving=true;	
			}else if(event.keyCode==32){
				//按下 空格 开火
				self.playerarr[0].fire();
			}
		});

		$(document).keyup(function(event){
			self.playerarr[0].isMoving = false;
		});
	}


})();