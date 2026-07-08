var element = document.getElementById('element'); 
var speed = 3; 

var controller = new inputController(
    {
        "left": {
            keys: [37,65],
            enabled: true
        },
        "right": {
            keys: [39,68]
        },
        "up": {
            keys: [38,87]
        },
        "down": {
            keys: [40,83]
        },
        "jump":{
            keys: [32],
        enabled: false
        }
    });

    controller.attach(document.body); 

document.body.addEventListener(controller.ACTION_ACTIVATED, function(e){
    console.log('activated',e.detail);
});
document.body.addEventListener(controller.ACTION_DEACTIVATED, function(e){
    console.log('deactivated',e.detail);
});

var elementTop = 50;
var elementLeft = 50;

function move() { 
    
    if (controller.isActionActive('up')) { 
        elementTop = elementTop - speed; 
    }
    if (controller.isActionActive('down')) { 
        elementTop += speed; 
    }
    if (controller.isActionActive('left')) { 
        elementLeft -= speed; 
    }
    if (controller.isActionActive('right')) { 
        elementLeft = elementLeft + speed; 
    }

    element.style.top = elementTop + 'px'; 
    element.style.left = elementLeft + 'px'; 

    requestAnimationFrame(move); 
}

requestAnimationFrame(move); 

document.getElementById('attach').onclick = function () { 
    controller.attach(document.body); 
};

document.getElementById('detach').addEventListener('click', function () { 
    controller.detach(); 
});

document.getElementById('enable').onclick = function () { 
    controller.enabled = true; 
};

document.getElementById('disable').onclick = function () { 
    controller.enabled = false; 
};

document.getElementById('bindjump').onclick = function () { 
        jump: { enabled: true}; 
    controller.enableAction('jump'); 
};

setInterval(function () { 
    if (controller.isActionActive('jump')) { 
        element.style.backgroundColor = '#ff0808';
    } else { 
        element.style.backgroundColor = '#3498db'; 
    }
}, 50); 

this.actions[actionName].enabled = true; 

inputController.prototype.disableAction = function (actionName) { 
    if (this.actions[actionName]) { 
        this.actions[actionName].enabled = false; 
        this.actions[actionName].active = false; 
    }
};

inputController.prototype.updateActions = function () { 
    for (var name in this.actions) { 
        var action = this.actions[name]; 

        if (!action.enabled) { 
            continue; 
        }

        var active = false; 

        for (var i = 0; i < action.keys.length; i++) { 
            if (this.pressed[action.keys[i]]) { 
                active = true; 
            }
        }

        action.active = active;
    }
};
