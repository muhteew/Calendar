function Search() {

    //Ссылка для обработчиков
    var managedSearch = this;

    this.resultsNode = null; //узел popup с результатами
    this.boxNode = null; //узел оболочки поля ввода поиска
    this.inputNode = null; //узел поля ввода поиска
    this.itemListNode = null;//узел группы результатов поиска
    this.scroll = null; //скролбар
    this.inputClear = null; //крестик на поле ввода

    //Заглушка/////////////////////////
    //Вместо создания и размещения узла, возьмем узел из макета
    this.resultsNode = document.getElementById("searchResults");
    this.itemListNode = this.resultsNode.getElementsByClassName("searchResults_itemList")[0];
    //инициализируем searchResults - удаляем все результаты поиска
    this.items = this.resultsNode.getElementsByClassName("searchResults__item");
    this.itemListNode.removeChild(this.items[0]);
    this.itemListNode.removeChild(this.items[0]);
    this.scroll = this.resultsNode.getElementsByClassName("searchResults__scroll")[0];
    ///////////////////////////////////

    //связывает поле поиска с результатами поиска
    //boxNode - узел оболочки поля ввода поиска
    this.linkInput = function (boxNode) {

        this.boxNode = boxNode;
        this.inputNode = this.boxNode.getElementsByClassName("search__input")[0];
        if (IE <= 9) {
            this.inputNode = this.boxNode.getElementsByClassName("search__input")[1]; //ie плейсхолдер
        }

        this.inputClear = this.boxNode.getElementsByClassName("input__clear")[0];

        //если заполненное поле поиска попадает в фокус, результаты поиска сразу появляются
        addEvent(this.inputNode, "focus", function (event) {
            if (managedSearch.inputNode.value != "") {
                managedSearch.resultsNode.classList.remove("invisible");
            }
        });

        this.inputNode.onkeyup = function (event) {

            //крестик появляется только когда в поле ввода введен какой-то текст
            managedSearch.inputClear.classList.remove("invisible");
            if (managedSearch.inputNode.value == "") {
                managedSearch.inputClear.classList.add("invisible");
            }

            var items = managedSearch.findResults(managedSearch.inputNode.value);
            if (managedSearch.showResults(items)) {
                //отображаем результаты поиска 
                managedSearch.resultsNode.classList.remove("invisible");
            }

            //делаем скролбар видимым, если результаты не входят в оболочку
            if (managedSearch.itemListNode.scrollHeight > managedSearch.itemListNode.clientHeight) {
                var scrollHeight = Math.round(managedSearch.itemListNode.clientHeight * managedSearch.itemListNode.clientHeight / managedSearch.itemListNode.scrollHeight);
                console.log(scrollHeight);
                managedSearch.scroll.style.height = scrollHeight + "px";
                managedSearch.scroll.classList.remove("invisible");
            }
            else {
                managedSearch.scroll.classList.add("invisible");
            }
        };

        this.boxNode.onclick = function (event) {

            event = event || window.event;
            var target = event.target || event.srcElement;

            //нажатие на крестик
            while (target != managedSearch.inputClear) {
                
                if (target == this)
                {
                    //нажимая на иконку, фокусируемся на поиске
                    if (IE <= 9) { managedSearch.inputNode.classList.remove("hidden"); } //ie плейсхолдер
                    managedSearch.inputNode.focus();
                    return;
                }
                target = target.parentNode;
            }
            managedSearch.inputClear.classList.add("invisible");
            managedSearch.resultsNode.classList.add("invisible");
            managedSearch.inputNode.value = "";
            managedSearch.inputNode.focus();
        };
    };

    //находит записи, которые включают в себя подстроку text, если она является началом слова
    //возвращаем в виде массива объектов {header: {String}, text: {String}, date: {String}}
    this.findResults = function (text) {

        items = [];

        if (text == "") { return items; };

        var localStorageIdPrefix = "";

        //сортируем ключи localStorage
        var sortedKeys = sortKeys(localStorage, true);

        for (var i = 0; i < sortedKeys.length; i++) {

            var key = sortedKeys[i];

            //если префиксы одинаковые, значит объект уже в результатах поиска
            //Поэтому переходим к следущему
            if (localStorageIdPrefix == key.slice(0, 10) + "_") { continue; }

            if ((" " + localStorage[key].toLowerCase()).indexOf((" " + text).toLowerCase()) >= 0) {

                items.push({});
                var lastObj = items.length - 1;
                var localStorageIdPrefix = key.slice(0, 10) + "_";

                //первые 10 символов key - это дата
                items[lastObj].date = key.slice(0, 10);
                items[lastObj].header = localStorage[localStorageIdPrefix + "eventName"];
                items[lastObj].text = localStorage[localStorageIdPrefix + "eventDate"];
            }
        }

        return items;
    };

    //отображает найденные ячейки
    this.showResults = function (items) {

        //Удаляем предыдущие результаты              
        for (var i = 0; i < this.items.length;) {
            this.itemListNode.removeChild(this.items[0]);
        }

        //Записываем новые
        for (var i = 0; i < items.length; i++) {
            var itemNode = Search.templates["item"].cloneNode(true);
            this.itemListNode.appendChild(itemNode);
            itemNode.getElementsByClassName("searchResults__itemHeader")[0].innerHTML = items[i].header;
            itemNode.getElementsByClassName("searchResults__itemText")[0].innerHTML = items[i].text;
            itemNode.getElementsByClassName("searchResults__itemText")[0].setAttribute("datetime", items[i].date);
        }

        if (items.length == 0) {
            return false;
        }

        return true;
    };

    this.hideResults = function () {
        this.resultsNode.classList.add("invisible");
    };

    //Выделяем один из результатов поиска
    this.itemListNode.onclick = function (event) {

        event = event || window.event;
        var target = event.target || event.srcElement;

        //Должен быть выделен только один результат, так что сначала уберем выделение у всех
        for (var i = 0; i < managedSearch.items.length; i++) {
            managedSearch.items[i].children[0].classList.remove("searchResults__itemSelectArea_selected");
        }

        while (!target.classList.contains("searchResults__itemSelectArea")) {
            
            if (target == this) return;
            target = target.parentNode;
        }

        target.classList.add("searchResults__itemSelectArea_selected");
    };

    this.itemListNode.onscroll = function () {
        
        var scrollOffset = 10; //сдвиг скроллбара по высоте от краев поля с результатами 
        var scrollTop = Math.round(managedSearch.itemListNode.scrollTop * managedSearch.itemListNode.clientHeight / managedSearch.itemListNode.scrollHeight);
        if (scrollTop < scrollOffset) {
            scrollTop = scrollOffset;
        }
        else if (scrollTop > managedSearch.itemListNode.clientHeight - managedSearch.scroll.clientHeight + scrollOffset) {
            scrollTop = managedSearch.itemListNode.clientHeight - managedSearch.scroll.clientHeight - scrollOffset;
        }
        managedSearch.scroll.style.top = scrollTop + "px";
    };

};

//инициализируем шаблоны для построения узлов поиска
Search.setTemplates = function () {

    this.templates = {};

    this.templates["item"] = document.getElementsByClassName("searchResultsTemplate")[0].cloneNode(true);
    this.templates["item"].classList.remove("searchResultsTemplate");
};

//сортировля ключей для localStorage
function sortKeys(dict, order) {

    order = order || false; //порядок сортировки. False - по возрастанию

    var keys = [];

    for (key in dict) {
        keys.push(key);
    }

    if (order) {
        keys.sort(function (a, b) { return (a>b)?-1:(a<b)?1:0;});
    }
    else{
        keys.sort(function (a, b) { return (a>b)?1:(a<b)?-1:0;});
    }
    
    return keys;
}

