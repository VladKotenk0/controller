(function (){
    var mouseplugin = {
        name:"mouse",
        controller: null,
        target: null,
        buttons:{},

        attach(controller,target){
            if (this.target){
                this.detach();
            }
            this.controller = controller;
            this.target = target;

            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);

            target.addEventListener('mousedown', this.onMouseDown);
            target.addEventListener('mouseup', this.onMouseUp);
        },

        detach(){
            if (!this.target){
                return;
            }
            this.target.removeEventListener('mousedown', this.onMouseDown);
            this.target.removeEventListener('mouseup',this.onMouseUp);
            this.buttons = {};
            this.target = null;
            this.controller = null;
        },

        onMouseDown(e){
            if (!this.controller.enabled) return;
            if (!this.controller.focused) return;
            if (e.target.tagName === 'BUTTON'){
                return;
            }
            this.buttons[e.button] = true;
            this.controller.updateActions();
        },

        onMouseUp(e){
            if (!this.controller.enabled) return;
            if (!this.controller.focused) return;
            delete this.buttons[e.button];
            this.controller.updateActions();
        },

        isActionActive(name, action){
            if (!action.buttons){
                return false;
            }
            for (var i = 0; i <action.buttons.length; i++){
                if (this.buttons[action.buttons[i]]){
                    return true;
                }
            }
            return false;
        }
    };
    
    window.mouseplugin = mouseplugin;
})();