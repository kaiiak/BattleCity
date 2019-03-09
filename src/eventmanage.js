//事件管理
function EventManager() {
  this._subscribers = {};
}

//注册事件
EventManager.prototype.addSubscriber = function (subscriber, events) {
  for (var i in events) {
    if (!this._subscribers[events[i]]) {
      this._subscribers[events[i]] = [];
    }
    this._subscribers[events[i]].push(subscriber);
  }
};

//移除事件
EventManager.prototype.removeSubscriber = function (subscriber) {
  for (var i in this._subscribers) {
    //类中数组，数组中的元素
    for (var j in this._subscribers[i]) {
      if (this._subscribers[i][j] === subscriber) {
        this._subscribers[i].splice(j, 1);
      }
    }
  }
};

//
EventManager.prototype.removeAllSubscribers = function () {
  this._subscribers = {};
};

EventManager.prototype.fireEvent = function (event) {
  var subscribers = this._subscribers[event.name];
  for (var i in subscribers) {
    subscribers[i].notify(event);
  }
};