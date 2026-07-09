(function (){

  class inputController{
    constructor(actionToBind, target){
    this.focused = true;
    this.enabled = true;
    this.target = null;
    this.action = {};
    this.plugins = [];
    
    this.ACTION_ACTIVATED = "input-controller:action-activated";
    this.ACTION_DEACTIVATED = "input-controller:action-deactivated";
  
    if (actionToBind){
      this.bindAction(actionToBind);
    }
    if (target){
      this.attach(target);
    }
  }

  getPluginContext(){
    var self = this;
    return {
      isEnabled(){
        return self.enabled;
      },
      isFocused(){
        return self.focused;
      },
      setFocused(value){
        self.focused = value;
      },
      requestUpdate(){
        self.updateActions();
      }
    };
  }
  
  registerPlugin(plugin){
    this.plugins.push(plugin);
    if (this.target){
      plugin.attach(this.target, this.getPluginContext());
    }
  }
  
  updateActions(){
    for (var name in this.action){
      var action = this.action[name]
      if(!action.enabled){
        continue;
      }

      var active = false;
      for (var i = 0; i < this.plugins.length; i++){
        if (this.plugins[i].isActionActive(name,action)){
          active = true;
          break;
        }
      }
      if (action.active !==active){
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
        active: false,
        buttons: item.buttons
      };
      if (item.enabled === false){
        this.action[name].enabled = false;
      }
    }
  }
  
  attach(target){
    this.target = target;
    var context = this.getPluginContext();
    for (var i = 0; i<this.plugins.length;i++){
      this.plugins[i].attach(target, context);
    }
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
    for (var i = 0; i<this.plugins.length; i++){
      this.plugins[i].detach();
    }
    this.target = null;
    this.enabled = false;
  }
}

  window.inputController = inputController;

})();
