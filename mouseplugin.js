(function (){

    class mouseplugin {
        constructor(){
            this.context = null;
            this.target = null;
            this.buttons = {};
        }

        attach(target, context){
            if (this.target){
                this.detach();
            }
            this.context = context;
            this.target = target;

            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);

            target.addEventListener('mousedown', this.onMouseDown);
            target.addEventListener('mouseup', this.onMouseUp);
        }

        detach(){
            if (!this.target){
                return;
            }
            this.target.removeEventListener('mousedown', this.onMouseDown);
            this.target.removeEventListener('mouseup', this.onMouseUp);
            this.buttons = {};
            this.target = null;
            this.context = null;
        }

        onMouseDown(e){
            if (!this.context.isEnabled()) return;
            if (!this.context.isFocused()) return;
            if (e.target.tagName === 'BUTTON'){
                return;
            }
            this.buttons[e.button] = true;
            this.context.requestUpdate();
        }

        onMouseUp(e){
            if (!this.context.isEnabled()) return;
            if (!this.context.isFocused()) return;
            delete this.buttons[e.button];
            this.context.requestUpdate();
        }

        isActionActive(name, action){
            if (!action.buttons){
                return false;
            }
            for (var i = 0; i < action.buttons.length; i++){
                if (this.buttons[action.buttons[i]]){
                    return true;
                }
            }
            return false;
        }
    }

    window.mouseplugin = mouseplugin;

})();
