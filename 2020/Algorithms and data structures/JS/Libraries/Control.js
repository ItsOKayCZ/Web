/**
 * Makes a control menu
 * 
 * TODO:
 */

class Controls{

    // DOMs in the control menu
    menu;

    // Cosmetic variables
    width = 250;
    height;

    // Elements
    elements;

    /**
     * Contstructor
     * @param {Array} elements 
     */
    constructor(elements){
        
        this.createMenu();

        for(var i = 0; i < elements.length; i++){

            if(elements[i].type == undefined){
                throw `Type isn't specified at element ${i}`;
            }

            switch(elements[i].type){
                case "button":
                    this.addButton(elements[i]);
                    break;
                case "slider":
                    this.addSlider(elements[i]);
                    break;
                default:
                    console.warn(`Specified type at element ${i} is not recognized`);
            }
        
        }

        this.elements = elements;
        this.importStylesheet();
        this.display();
    }

    /**
     * Imports the stylesheet file into the HTML
     */
    importStylesheet(){
        var link = document.createElement("link");
        link.rel = "stylesheet";

        var scripts = document.getElementsByTagName("script");
        var temp = scripts[scripts.length - 1].src.split("/"); temp.pop();
        var path = temp.join("/") + "/Control.css";
        link.href = path;

        document.getElementsByTagName("head")[0].appendChild(link);
    }

    /**
     * Creates the DIV menu
     */
    createMenu(){
        this.menu = document.createElement("div");
        this.menu.setAttribute("id", "controls");
    }

    /**
     * Appends the menu into the body DOM
     */
    display(){
        document.getElementsByTagName("body")[0].appendChild(this.menu);
    }

    /**
     * Adds a button into the menu
     * @param {Object} el Button info
     */
    addButton(el){
        var button = document.createElement("button");

        if(el.label == undefined){
            throw "Unspecified label at button";
        }

        button.innerHTML = el.label;

        if(el.onclick == undefined){
            console.info(`No function specified on click at ${el.label}.
            Didn't add onclick event`);
        } else if(typeof(el.onclick) != "function"){
            console.warn(`Button ${el.label} doesn't have a function on click. 
            Didn't add onclick event`);
        } else {
            button.onmousedown = el.onclick;
            button.ontouchstart = el.onclick;
        }

        this.menu.appendChild(button);
    }

    /**
     * Adds a slider with a label into the menu
     * @param {Object} el Slider info with label
     */
    addSlider(el){
        var div = document.createElement("div");
        var label = document.createElement("p");
        var slider = document.createElement("input");

        if(el.label == undefined){
            throw "Unspecified label at slider";
        }

        slider.type = "range";
        slider.className = "slider";
        if(el.range == undefined || el.range.min == undefined || el.range.max == undefined){
            throw `Unspecified range at slider ${el.label}`;
        }
        slider.min = el.range.min;
        slider.max = el.range.max;

        if(el.oninput == undefined){
            console.info(`No function specified on input at ${el.label}.
            Didn't add oninput event`);
        } else if(typeof(el.oninput) != "function"){
            console.warn(`Slider ${el.label} doesn't have a function on input.
            Didn't add oninput event`);
        } else {
            slider.oninput = (function(func){
                if(el.showValue){
                    return function(e) {
                        func(this);
                        el.oninput(this);
                    }
                }

                return function(e){el.oninput(this);};
            })(this.updateValue);
        }

        if(el.defaultValue != undefined){
            slider.value = el.defaultValue;
        }

        if(el.showValue){
            label.innerHTML = `${el.label} (${slider.value})`;
        } else {
            label.innerHTML = el.label;
        }

        div.name = el.label;

        div.appendChild(label);
        div.appendChild(slider);

        this.menu.appendChild(div);
    }

    /**
     * Displays the updated slider value
     * @param {DOM} el Slider DOM
     */
    updateValue(el){
        var label = el.previousSibling;
        var value = el.value;

        var temp = label.innerHTML.split(" ");
        temp.pop();
        temp = temp.join(" ");
        label.innerHTML = `${temp} (${value})`;
    }

    /**
     * Finds and sets the value to the label in the menu
     * @param {String} label The label of the DOM
     * @param {String} value The value to set
     */
    setValue(label, value){
        if(label == undefined || value == undefined){
            throw "Expected 2 values";
        }

        var found = false;
        for(var i = 0; i < this.menu.children.length; i++){
            var DOM = this.menu.children[i];
            
            if(DOM.nodeName == "DIV" && DOM.name == label){
                var DOMLabel = DOM.firstChild;
                var DOMSlider = DOM.lastChild;

                DOMLabel.innerHTML = `${label} (${value})`;
                DOMSlider.value = value;

                found = true;
                break;
            }
        }

        if(!found){
            console.info(`No such DOM element named ${label}`);
        }
    }

    /**
     * Finds the DOM labeled as label and returns the value
     * @param {String} label The label
     */
    getValue(label){
        if(label == undefined){
            throw "Expected 1 value";
        }

        for(var i = 0; i < this.menu.children.length; i++){
            var DOM = this.menu.children[i];

            if(DOM.nodeName == "DIV" && DOM.name == label){
                return DOM.lastChild.value;
            }
        }

        console.info(`No such DOM element named ${label}`);
    }
}