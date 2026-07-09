(function (){

    var keyboardplugin = {
        name:"keyboard",
        controller: null,
        target: null,
        pressed:{},
        
        attach(controller,target){
            if (this.target){
                this.detach();
            }
            this.controller = controller;
            this.target = target;

            this.onKeyDown = this.onKeyDown.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
            this.onBlur = this.onBlur.bind(this);
            this.onFocus = this.onFocus.bind(this);

            target.addEventListener('keydown', this.onKeyDown);
            target.addEventListener('keyup', this.onKeyUp);
            window.addEventListener('focus', this.onFocus);
            window.addEventListener('blur',this.onBlur);
        },        

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
            this.controller = null;
        },

        onKeyDown(e){
            if (!this.controller.enabled) return;
            if (!this.controller.focused) return;
            this.pressed[e.keyCode] = true;
            this.controller.updateActions();
        },
    
        onKeyUp(e){
            if (!this.controller.enabled) return;
            if (!this.controller.focused) return;
            delete this.pressed[e.keyCode];
            this.controller.updateActions();
        },
        
        onBlur(){
            this.controller.focused=false;
            this.pressed={};
            this.controller.updateActions();
        },
        
        onFocus(){
            this.controller.focused = true;
        },
        isActionActive(name, action){
            if (!action.keys){
                return false;
            }
            for (var i = 0; i < action.keys.length; i++){
                if (this.pressed[action.keys[i]]){
                    return true;
                }
            }
            return false;
        }
    };
    
    window.keyboardplugin = keyboardplugin;

})();