//墙的基本元素
//eventManager（事件管理）：event.js中的eventManager数组
function Wall(eventManager) {
//继承Sprite.js里的属性
  Sprite.call(this, eventManager);
  //将检测到的碰撞事件添加到全局事件队列中
  this._eventManager.addSubscriber(this, [CollisionDetector.Event.COLLISION]);
  //击中左边墙属性
  this._hitLeft = false;
  //击中右边墙属性
  this._hitRight = false;
  //击中上边墙属性
  this._hitTop = false;
  //击中下边墙属性
  this._hitBottom = false;
  //墙的宽高（Globals：全局属性）
  this._w = Globals.TILE_SIZE;
  this._h = Globals.TILE_SIZE;
  //铁墙
  this._invincibleForNormalBullets = false;
}
//添加到Sprite.js里构造的方法中
Wall.subclass(Sprite);

Wall.prototype.notify = function (event) {
	//子弹击中墙壁碰撞事件 发生（条件）：检测到事件是碰撞且撞体是子弹且被撞体是墙壁本身(this)
  if (event.name == CollisionDetector.Event.COLLISION && event.initiator instanceof Bullet && event.sprite === this) {
	  //对子弹攻击事件初始化
    this.hitByBullet(event.initiator);
  }
};
//子弹攻击墙
Wall.prototype.hitByBullet = function (bullet) {
  //子弹对铁墙无效
  if (this.isInvincibleForNormalBullets()) {
    return;
  }
  //朝右方发射的子弹击中左边墙
  if (bullet.getDirection() == Sprite.Direction.RIGHT) {
    this.hitLeft();
  }
  //朝左方发射的子弹击中右边墙
  else if (bullet.getDirection() == Sprite.Direction.LEFT) {
    this.hitRight();
  }
  //朝下方发射的子弹击中上边墙
  else if (bullet.getDirection() == Sprite.Direction.DOWN) {
    this.hitTop();
  }
  //朝上方发射的子弹击中下边墙
  else if (bullet.getDirection() == Sprite.Direction.UP) {
    this.hitBottom();
  }
};
//击中左边墙事件发生
Wall.prototype.hitLeft = function () {
  if (this._hitLeft || this._hitRight) {
    //摧毁
	this.destroy();
    return;
  }
  this._hitLeft = true;
};
//返回击中左边墙的属性
Wall.prototype.isHitLeft = function () {
  return this._hitLeft;
};
//击中右边墙事件发生
Wall.prototype.hitRight = function () {
  if (this._hitRight || this._hitLeft) {
    //摧毁
	this.destroy();
    return;
  }
  this._hitRight = true;
};
//返回击中右边墙的属性
Wall.prototype.isHitRight = function () {
  return this._hitRight;
};
//击中上边墙事件发生
Wall.prototype.hitTop = function () {
  if (this._hitTop || this._hitBottom) {
    //摧毁
	this.destroy();
    return;
  }
  this._hitTop = true;
};

//返回击中上边墙的属性
Wall.prototype.isHitTop = function () {
  return this._hitTop;
};
//击中下边墙事件发生
Wall.prototype.hitBottom = function () {
  if (this._hitBottom || this._hitTop) {
    //摧毁
	this.destroy();
    return;
  }
  this._hitBottom = true;
};
//返回击中下边墙的属性
Wall.prototype.isHitBottom = function () {
  return this._hitBottom;
};
//画墙
Wall.prototype.draw = function (ctx) {
//调用onload.js里ImageManager类中的getImage方法
  ctx.drawImage(ImageManager.getImage(this.getImage()), this._x, this._y);
  //使隐藏摧毁区域
  this._hideDestroyedAreas(ctx);
};
//制造铁墙
Wall.prototype.makeInvincibleForNormalBullets = function () {
//立个flag
  this._invincibleForNormalBullets = true;
};
//判断是否是铁墙
Wall.prototype.isInvincibleForNormalBullets = function () {
//返回flag
  return this._invincibleForNormalBullets;
};
//隐藏摧毁区域
Wall.prototype._hideDestroyedAreas = function (ctx) {
	//使其背景为不可见
  ctx.fillStyle = "black";
  
  if (this._hitTop) {
    //填充击中的上方区域
    ctx.fillRect(this._x, this._y, this._w, this._h / 2);
  }
  if (this._hitBottom) {
	  //填充击中的下方区域
    ctx.fillRect(this._x, this._y + this._h / 2, this._w, this._h / 2);
  }
  if (this._hitLeft) {
	  //填充击中的左方区域
    ctx.fillRect(this._x, this._y, this._w / 2, this._h);
  }
  if (this._hitRight) {
	  //填充击中的右方区域
    ctx.fillRect(this._x + this._w / 2, this._y, this._w / 2, this._h);
  }
};

//BrickWallFactory制造砖墙工厂
function BrickWallFactory(eventManager) {
	//给this事件赋值
  this._eventManager = eventManager;
}
//创造砖墙
BrickWallFactory.prototype.create = function () {
	//返回砖墙
  return new BrickWall(this._eventManager);
};

//SteelWallFactory制造铁墙工厂
function SteelWallFactory(eventManager) {
    //给this事件赋值
  this._eventManager = eventManager;
}
//创造铁墙
SteelWallFactory.prototype.create = function () {
    //返回铁墙
  return new SteelWall(this._eventManager);
};

//砖墙方法
function BrickWall(eventManager) {
    //继承this属性
  Wall.call(this, eventManager);
}
//添加到wall.js里构造的方法中
BrickWall.subclass(Wall);
//获取Brickwall的classname
BrickWall.prototype.getClassName = function () {
  return 'BrickWall';
};
//获取wall_brick的name
BrickWall.prototype.getImage = function () {
  return 'wall_brick';
};

//铁墙方法
function SteelWall(eventManager) {
    //继承this属性
  Wall.call(this, eventManager);
    //立flag
  this._invincibleForNormalBullets = true;
}
//将铁墙添加到wall.js里构造的方法中
SteelWall.subclass(Wall);
//获取SteelWall的Classname
SteelWall.prototype.getClassName = function () {
  return 'SteelWall';
};
//获取wall_steel的name
SteelWall.prototype.getImage = function () {
  return 'wall_steel';
};

//Trees草丛
function Trees(eventManager) {
    //继承Sprite.js的属性
  Sprite.call(this, eventManager);
  this._zIndex = 1;
}
//添加到Sprite.js里构造的方法中
Trees.subclass(Sprite);
//获取Trees的classname
Trees.prototype.getClassName = function () {
  return 'Trees';
};
//画出草丛
Trees.prototype.draw = function (ctx) {
    //调用onload.js里ImageManager类中的getImage方法
  ctx.drawImage(ImageManager.getImage('trees'), this._x, this._y);
};


//Water河流
function Water(eventManager) {
    //继承Sprite.js的属性
  Sprite.call(this, eventManager);
    //实现动画效果：图片序号[1,2]，每30轮一次循环(30)，循环（true）
  this._animation = new Animation([1,2], 30, true);
    //赋值河流宽高
  this._w = Globals.UNIT_SIZE;
  this._h = Globals.UNIT_SIZE;
}
//将Water添加到Sprite里构造的方法中
Water.subclass(Sprite);
//获取Water的Classname
Water.prototype.getClassName = function () {
  return 'Water';
};
//停止动画效果
Water.prototype.stopAnimation = function () {
  this._animation.setActive(false);
};
//更新钩子
Water.prototype.updateHook = function () {
  this._animation.update();
};
//获取图片的编号
Water.prototype.getImage = function () {
    //获取animation的frame序号
  return 'water_' + this._animation.getFrame();
};
//画出河流
Water.prototype.draw = function (ctx) {
    //调用onload.js里ImageManager类中的getImage方法
  ctx.drawImage(ImageManager.getImage(this.getImage()), this._x, this._y);
};