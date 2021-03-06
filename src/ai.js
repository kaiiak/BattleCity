//AI坦克控制
function AITankController(tank, random, spriteContainer) {
  this._tank = tank;
  this._random = random;
  this._spriteContainer = spriteContainer;
  this._eventManager = this._tank.getEventManager();
  this._pauseListener = new PauseListener(this._eventManager);
  
  //注册按键
  this._eventManager.addSubscriber(this, [Tank.Event.DESTROYED]);
  
  this._tank.toNormalSpeed();
  
  //射击间隔为15个周期
  this._shootInterval = 15;
  this._shootTimer = 0;
  //设计的几率
  this._shootProbability = 0.7;
  
  //方向20个周期改变一次
  this._directionUpdateInterval = 20;
  this._directionTimer = 0;
  this._directionUpdateProbability = 0.6;
  
  //执行事件
  this._eventManager.fireEvent({'name': AITankController.Event.CREATED, 'controller': this});
 
}

AITankController.Event = {};
AITankController.Event.CREATED = 'AITankController.Event.CREATED';
AITankController.Event.DESTROYED = 'AITankController.Event.DESTROYED';

AITankController.prototype.setShootInterval = function (interval) {
  this._shootInterval = interval;
};

//改变射击的几率
AITankController.prototype.setShootProbability = function (probability) {
  this._shootProbability = probability;
};

AITankController.prototype.updateShoot = function () {
  this._shootTimer++;
  if (this._shootTimer >= this._shootInterval) {
    this._shootTimer = 0;
    if (this._random.getNumber() < this._shootProbability) {
      this._tank.shoot();
    }
  }
};

//设置改变方向的时间
AITankController.prototype.setDirectionUpdateInterval = function (interval) {
  this._directionUpdateInterval = interval;
};

//设置方向改变的几率
AITankController.prototype.setDirectionUpdateProbability = function (probability) {
  this._directionUpdateProbability = probability;
};

AITankController.prototype.updateDirection = function () {
  this._directionTimer++;
  if (this._directionTimer >= this._directionUpdateInterval) {
    this._directionTimer = 0;
    if (this._random.getNumber() < this._directionUpdateProbability) {
      var base = this._spriteContainer.getBase();
      var n = this._random.getNumber();
      var dir = Sprite.Direction.DOWN;

      //设置机器往基地走
      if (base.getY() > this._tank.getY()) {
        dir = Sprite.Direction.DOWN;
        if (n < 0.4) {
          dir = arrayRandomElement([Sprite.Direction.UP, Sprite.Direction.LEFT, Sprite.Direction.RIGHT]);
        }
      }
      else if (base.getY() == this._tank.getY()) {
        if (base.getX() < this._tank.getX()) {
          dir = Sprite.Direction.LEFT;
          if (n < 0.4) {
            dir = arrayRandomElement([Sprite.Direction.UP, Sprite.Direction.DOWN, Sprite.Direction.RIGHT]);
          }
        }
        else if (base.getX() > this._tank.getX()) {
          dir = Sprite.Direction.RIGHT;
          if (n < 0.4) {
            dir = arrayRandomElement([Sprite.Direction.UP, Sprite.Direction.LEFT, Sprite.Direction.DOWN]);
          }
        }
      }
      else {
        dir = arrayRandomElement([Sprite.Direction.UP, Sprite.Direction.DOWN, Sprite.Direction.LEFT, Sprite.Direction.RIGHT]);
      }
      
      this._tank.setDirection(dir);
    }
  }
};

//坦克状态更新
AITankController.prototype.update = function () {
  if (this._pauseListener.isPaused()) {
    return;
  }
  this.updateShoot();
  this.updateDirection();
};

AITankController.prototype.notify = function (event) {
  if (event.name == Tank.Event.DESTROYED && event.tank === this._tank) {
    this.destroy();
  }
};

AITankController.prototype.destroy = function () {
  this._pauseListener.destroy();
  this._eventManager.removeSubscriber(this);
  this._eventManager.fireEvent({'name': AITankController.Event.DESTROYED, 'controller': this});
};

AITankController.prototype.setPauseListener = function (listener) {
  this._pauseListener.destroy();
  this._pauseListener = listener;
};



function AITankControllerFactory(eventManager, spriteContainer) {
  this._eventManager = eventManager;
  this._eventManager.addSubscriber(this,
    [EnemyFactory.Event.ENEMY_CREATED]);
  this._spriteContainer = spriteContainer;
}

//为坦克创建控制器
AITankControllerFactory.prototype.notify = function (event) {
  if (event.name == EnemyFactory.Event.ENEMY_CREATED) {
    this.createController(event.enemy);
  }
};

AITankControllerFactory.prototype.createController = function (tank) {
  var controller = new AITankController(tank, new Random(), this._spriteContainer);
  return controller;
};


//AI坦克控制器容器
function AITankControllerContainer(eventManager) {
  this._eventManager = eventManager;
  eventManager.addSubscriber(this, [AITankController.Event.CREATED, AITankController.Event.DESTROYED]);
  this._controllers = [];
}

AITankControllerContainer.prototype.addController = function (controller) {
  this._controllers.push(controller);
};

AITankControllerContainer.prototype.removeController = function (controller) {
  arrayRemove(this._controllers, controller);
};

AITankControllerContainer.prototype.containsController = function (controller) {
  return arrayContains(this._controllers, controller);
};

AITankControllerContainer.prototype.getControllers = function () {
  return this._controllers;
};

AITankControllerContainer.prototype.notify = function (event) {
  if (event.name == AITankController.Event.CREATED) {
    this.addController(event.controller);
  }
  else if (event.name == AITankController.Event.DESTROYED) {
    this.removeController(event.controller);
  }
};

//为每个坦克更新状态
AITankControllerContainer.prototype.update = function () {
  this._controllers.forEach(function (controller) {
    controller.update();
  });
};
