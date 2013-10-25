//Анимация нажатия кнопок посредством замены классов css

//Ищем объекты класса customButton
//Они должны быть построены таким образом, чтобы
//второй класс у таких объектов был базовым классом кнопки,
//второй класс + окончание "_pressed" - классом нажатой кнопки.

(function () {

    var buttons = document.getElementsByClassName("customButton");

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].onmousedown = function () {          
            this.classList.add(this.classList[1] + "_pressed");            
        }
        
        buttons[i].onmouseup = function () {            
            this.classList.remove(this.classList[1] + "_pressed");
        }
               
    }    
    
})();