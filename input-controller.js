(function (){

  function inputController(actionToBind, target){
    this.focused = true;
    this.enabled = true;
    this.target = null;
    this.action = {};
    this.pressed = {};

    var self = this;

    this.onKeyDown = function (e){
      if (!self.enabled) return;
      if (!self.focused) return;
      self.pressed[e.keyCode] = true;
      self.updateActions();
    };
  
    this.onKeyUp = function (e){
      if (!self.enabled) return;
      if (!self.focused) return;
      delete self.pressed[e.keyCode];
      self.updateActions();
    };

  this.onBlur = function(){
    self.focused=false;
    self.pressed={};
  };

  this.onFocus = function (){
    self.focused = true;
  };

  this.ACTION_ACTIVATED = "input-controller:action-activated";
  this.ACTION_DEACTIVATED = "input-controller:action-deactivated";
  
  if (actionToBind){
    this.bindAction(actionToBind);
  }
  if (target){
    this.attach(target);
  }
}

inputController.prototype.isKeyPressed = function(keyCode){
  if (this.pressed[keyCode]){
    return true;
  }
  return false;
};

inputController.prototype.updateActions = function(){
    for (var name in this.action){
      var action = this.action[name]
      if(!action.enabled){
        continue
      }

      var active = false;
      for (var i = 0; i < action.keys.length; i++){
        if (this.pressed[action.keys[i]]){
          active = true;
        }
      }
      action.active = active;
    }
};

inputController.prototype.bindAction = function (actionsToBind){
    for (var name in actionsToBind){
      var item = actionsToBind[name];
      this.action[name] = {
        keys: item.keys,
        enabled: true,
        active: false
      };
      if (item.enabled === false){
        this.action[name].enabled = false;
      }
    }
  };
  
  inputController.prototype.attach = function(target){
    this.target = target;
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('focus', this.onFocus);
    this.enabled = true;
  };

  inputController.prototype.isActionActive = function(action){
    if (!this.action[action]){
      return false;
    }
    if (!this.action[action].enabled){
      return false;
    }
    return this.action[action].active;
  };

  inputController.prototype.enableAction = function(actionName){
    if (this.action[actionName]){
      this.action[actionName].enabled = true;
    }
  };

  inputController.prototype.disableAction = function(actionName){
    if (this.action[actionName]){
      this.action[actionName].enabled = false;
      this.action[actionName].active = false;
    }
  };

  inputController.prototype.detach = function(){
    if (!this.target){
      return;
    }
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup',this.onKeyUp);
    window.removeEventListener('focus',this.onFocus);
    this.pressed = {};
    this.target = null;
    this.enabled = false;
  };

window.inputController = inputController;

})();