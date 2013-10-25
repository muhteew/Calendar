(function () {    

    if (!document.getElementsByTagName("html")[0].classList.contains("lt-ie10")) { return; }

    var inputs = document.getElementsByTagName("input");
    var textareas = document.getElementsByTagName("textarea");

    var dataFields = []; //все текстовые поля input и textarea..
    var placeholderFields = []; //.. и их копии для эмуляции плейсхолдера

    //перегоняем все input и textarea в один массив
    for (var i = 0; i < inputs.length; i++) {
        dataFields.push(inputs[i]);
    }
    for (var i = 0; i < textareas.length; i++) {
        dataFields.push(textareas[i]);
    }


    for (var i = 0; i < dataFields.length; i++) {

        var type = dataFields[i].getAttribute("type");

        //Обрабатываются только текстовые поля
        if (type != "text" && type != "search")
        { if (dataFields[i].tagName != "TEXTAREA") continue; }


        placeholderFields[i] = dataFields[i].cloneNode();
        placeholderFields[i].value = dataFields[i].getAttribute("placeholder");

        //Фиксируем номер элемента в массиве, чтобы обращаться к нему из обработчика
        placeholderFields[i].number = i;

        //когда кликаем по полю-эмулятору, оно исчезает, и вместо него
        //появляется реальное
        placeholderFields[i].onfocus = function (event) {
            this.classList.add("hidden");
            dataFields[this.number].classList.remove("hidden");
            dataFields[this.number].focus();
        };

        placeholderFields[i].classList.add("placeholder");
        placeholderFields[i].removeAttribute("name");
        placeholderFields[i].removeAttribute("id");
        
        //При загрузке страницы реальные поля скрыты, видны поля с плейсхолдером
        dataFields[i].classList.add("hidden");        
        //Фиксируем номер элемента в массиве, чтобы обращаться к нему из обработчика
        dataFields[i].number = i;

        //когда снимаем фокус с реального поля, то, если в нем ничего не написано,
        //оно исчезает, и вместо него появляется поле-эмулятор
        dataFields[i].onblur = function (event) {
            if (this.value != "") return;
            this.classList.add("hidden");
            placeholderFields[this.number].classList.remove("hidden");
            console.log(this.number);
        };

        dataFields[i].onfocus = function (event) {            
            placeholderFields[this.number].classList.add("hidden");            
        };

        //вставляем поля-эмуляторы рядом с реальными
        dataFields[i].parentNode.insertBefore(placeholderFields[i], dataFields[i]);
    }


})();
