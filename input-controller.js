(function (){

  class inputController{
    constructor(actionToBind, target){
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
      self.updateActions();
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

  isKeyPressed(keyCode){
    if (this.pressed[keyCode]){
      return true;
    }
    return false;
  }

  updateActions(){
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
      if (active.action !==active){
        action.active=active;
        if (this.enabled && this.focused && this.target){
          var type = active?this.ACTION_ACTIVATED:this.ACTION_DEACTIVATED;
          this.target.dispatchEvent(new CustomEvent(type,{detail:name}));
        }
      } else {
        action.active=active;
      }
    }
  }

  bindAction(actionsToBind){
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
  }
  
  attach(target){
    this.target = target;
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur',this.onBlur);
    this.enabled = true;
  }

  isActionActive(action){
    if (!this.action[action]){
      return false;
    }
    if (!this.action[action].enabled){
      return false;
    }
    return this.action[action].active;
  }

  enableAction(actionName){
    if (this.action[actionName]){
      this.action[actionName].enabled = true;
    }
  }

  disableAction(actionName){
    if (this.action[actionName]){
      this.action[actionName].enabled = false;
      this.action[actionName].active = false;
    }
  }

  detach(){
    if (!this.target){
      return;
    }
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup',this.onKeyUp);
    window.removeEventListener('focus',this.onFocus);
    window.removeEventListener('blur',this.onBlur);
    this.pressed = {};
    this.target = null;
    this.enabled = false;
  }
}

  window.inputController = inputController;

})();
