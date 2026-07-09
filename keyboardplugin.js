(function (){

    class keyboardplugin {
        constructor(){
            this.context = null;
            this.target = null;
            this.pressed = {};
        }

        attach(target, context){
            if (this.target){
                this.detach();
            }
            this.context = context;
            this.target = target;

            this.onKeyDown = this.onKeyDown.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
            this.onBlur = this.onBlur.bind(this);
            this.onFocus = this.onFocus.bind(this);

            target.addEventListener('keydown', this.onKeyDown);
            target.addEventListener('keyup', this.onKeyUp);
            window.addEventListener('focus', this.onFocus);
            window.addEventListener('blur', this.onBlur);
        }

        detach(){
            if (!this.target){
                return;
            }
            this.target.removeEventListener('keydown', this.onKeyDown);
            this.target.removeEventListener('keyup', this.onKeyUp);
            window.removeEventListener('focus', this.onFocus);
            window.removeEventListener('blur', this.onBlur);
            this.pressed = {};
            this.target = null;
            this.context = null;
        }

        onKeyDown(e){
            if (!this.context.isEnabled()) return;
            if (!this.context.isFocused()) return;
            this.pressed[e.keyCode] = true;
            this.context.requestUpdate();
        }

        onKeyUp(e){
            if (!this.context.isEnabled()) return;
            if (!this.context.isFocused()) return;
            delete this.pressed[e.keyCode];
            this.context.requestUpdate();
        }

        onBlur(){
            this.context.setFocused(false);
            this.pressed = {};
            this.context.requestUpdate();
        }

        onFocus(){
            this.context.setFocused(true);
        }

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
    }

    window.keyboardplugin = keyboardplugin;

})();
