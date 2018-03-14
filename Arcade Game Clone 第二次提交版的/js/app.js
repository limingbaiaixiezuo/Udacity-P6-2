"use strict";
// 这是我们的玩家要躲避的敌人
const Enemy = function(x , y , speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
          this.x = x;
          this.y = y;
          this.speed = speed || 50 + Math.random() * (400 - 50);//参考论坛，有上下限的速度设置，可以防止速度过快或者过慢
          // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
          this.sprite = 'images/enemy-bug.png';
}

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
      if(this.x > 505) {//当虫子到画面边缘时，复位到起始位置
      this.x = -50;
      }
      this.x += dt * this.speed;//每次画面更新位置都移动一次
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// 现在实现你自己的玩家类
const Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.charboy = "images/char-boy.png";
    this.hasWin = false;//设置当前状态为未赢状态，做条件判断用
}
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
//碰撞检测
Player.prototype.checkCollision = function() {
    for(let i = 0; i<allEnemies.length; i++){
        if (Math.abs(this.y-allEnemies[i].y )<40 && !this.hasWin) {
            if (Math.abs(this.x- allEnemies[i].x)<50 && !this.hasWin) {//参照论坛，玩家与虫子的距离小于一定值得时候提示游戏失败，并复位玩家位置
                this.hasWin = true; //设置状态为已赢，使判定游戏是否赢的条件不满足，防止频繁更新的过程中不断调用该语句
                const cone = this;//用闭包原理，将this指定为Player
                setTimeout(function() {
                                        window.alert("You are Win")
                                        cone.hasWin = false;///恢复游戏未赢状态
                                        cone.y = 405;
                                        cone.x = 200;
                                      }, 50);
              }
            }
          }
}

Player.prototype.update = function(dt) {
    this.checkCollision();//调用碰撞检测函数，在玩家位置实时更新的过程中，时刻检测是否有碰撞发生。
    if (this.y < -9 && !this.hasWin) {//连续5次向上移动，当Ｙ小于一定数值时，提示游戏胜利。
        this.hasWin = true; //设置状态为已赢，使判定游戏是否赢的条件不满足，防止频繁更新的过程中不断调用该语句
        const cone = this;//用闭包原理，将this指定为Player
        setTimeout(function() {
                              window.alert("You are Win")
                              cone.hasWin = false;///恢复游戏未赢状态
                              cone.y = 405;
                              cone.x = 200;
                            }, 100);
            }
}
const TILE_WIDTH = 101,//让代码更具语义性，为可能的未来减少代码量
      TILE_HEIGHT = 83;
//移动函数，依据侦测到的按键决定玩家如何移动
Player.prototype.handleInput = function(movement) {
    switch(movement) {//参照论坛，自己想不起来
        case 'left':
            if(this.x > 0) {//玩家不能出画面
                this.x -= TILE_WIDTH;//依据玩家位置和画布坐标的原则，决定移动算法
            }
            break;
        case 'right':
            if(this.x < 402) {
                this.x += TILE_WIDTH;//按照引擎中绘制画布时的参数，决定每次的位移值
            }
            break;
        case 'up':
            if(this.y > 4) {
                this.y -= TILE_HEIGHT;
            }
            break;
        case 'down':
            if(this.y < 337) {
                this.y += TILE_HEIGHT;
            }
            break;
    }
}

Player.prototype.render = function(){
        ctx.drawImage(Resources.get(this.charboy), this.x, this.y);
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
let allEnemies = [];
for(let i = 0; i < 6; i++) {//参照论坛六个虫子比较合适
    let enemy = new Enemy(-20, 83 * (i % 3) + 62);//参照论坛别人的代码，０～５的整数除３的余数只有０，１，２三种可能，可以实现虫子位子的合理分布
    allEnemies.push(enemy);
}
const player = new Player(200, 405);//创建玩家实例

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
  const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
})
