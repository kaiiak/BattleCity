//碰撞检测
function CollisionDetector(eventManager, bounds, spriteContainer) {
  this._eventManager = eventManager;
  this._eventManager.addSubscriber(this, [Sprite.Event.MOVED]);
  this._bounds = bounds;
  this._spriteContainer = spriteContainer;
}

//碰撞事件(碰撞和越界)
CollisionDetector.Event = {};
CollisionDetector.Event.COLLISION = 'CollisionDetector.Event.COLLISION';
CollisionDetector.Event.OUT_OF_BOUNDS = 'CollisionDetector.Event.OUT_OF_BOUNDS';

CollisionDetector.prototype.notify = function (event) {
  SpriteContainer.prototype.notify.call(this, event);
  
  if (event.name == Sprite.Event.MOVED) {
    this._detectCollisionsForSprite(event.sprite);
    this._detectOutOfBoundsForSprite(event.sprite);
  }
};

//判断是否碰撞
CollisionDetector.prototype._detectCollisionsForSprite = function (sprite) {
  var sprites = this._spriteContainer.getSprites();
  sprites.forEach(function (other) {
    if (sprite === other) {
      return;
    }
    if (sprite.intersects(other)) {
      this._eventManager.fireEvent({
        'name': CollisionDetector.Event.COLLISION,
        'initiator': sprite,
        'sprite': other});
    }
  }, this);
};

//判断是否被包含
CollisionDetector.prototype._detectOutOfBoundsForSprite = function (sprite) {
  if (!this._bounds.containsWhole(sprite)) {
    this._eventManager.fireEvent({
        'name': CollisionDetector.Event.OUT_OF_BOUNDS,
        'sprite': sprite,
        'bounds': this._bounds});
  }
};