// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

    (function (view) {

        "use strict";

        if (!('HTMLElement' in view) && !('Element' in view)) return;

        var
              classListProp = "classList"
            , protoProp = "prototype"
            , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
            , objCtr = Object
            , strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
            , arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                      i = 0
                    , len = this.length
                ;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
            // Vendors: please allow content code to instantiate DOMExceptions
            , DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
            , checkTokenAndGetIndex = function (classList, token) {
                if (token === "") {
                    throw new DOMEx(
                          "SYNTAX_ERR"
                        , "An invalid or illegal string was specified"
                    );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                          "INVALID_CHARACTER_ERR"
                        , "String contains an invalid character"
                    );
                }
                return arrIndexOf.call(classList, token);
            }
            , ClassList = function (elem) {
                var
                      trimmedClasses = strTrim.call(elem.className)
                    , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                    , i = 0
                    , len = classes.length
                ;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.className = this.toString();
                };
            }
            , classListProto = ClassList[protoProp] = []
            , classListGetter = function () {
                return new ClassList(this);
            }
        ;
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var
                  tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
            ;
            do {
                token = tokens[i] + "";
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, forse) {
            token += "";

            var
                  result = this.contains(token)
                , method = result ?
                    forse !== true && "remove"
                :
                    forse !== false && "add"
            ;

            if (method) {
                this[method](token);
            }

            return !result;
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter
                , enumerable: true
                , configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }

    }(self));

}
var addEvent, removeEvent;

if (document.addEventListener) { // проверка существования метода
    addEvent = function(elem, type, handler) {
        elem.addEventListener(type, handler, false);
    };
    removeEvent = function(elem, type, handler) {
        elem.removeEventListener(type, handler, false);
    };
} else {
    addEvent = function(elem, type, handler) {
        elem.attachEvent("on" + type, handler);
    };
    removeEvent = function(elem, type, handler) {
        elem.detachEvent("on" + type, handler);
    };
}

var IE = 100;

if (document.getElementsByTagName("html")[0].classList.contains("lt-ie10")) {
    IE = 9;
}
else if (document.getElementsByTagName("html")[0].classList.contains("lt-ie9")) {
    IE = 8;
}
else if (document.getElementsByTagName("html")[0].classList.contains("lt-ie8")) {
    IE = 7;
}
else if (document.getElementsByTagName("html")[0].classList.contains("lt-ie7")) {
    IE = 6;
}

(function () {    

    if (!document.getElementsByTagName("html")[0].classList.contains("lt-ie10")) { return; }

    var inputs = document.getElementsByTagName("input");
    var textareas = document.getElementsByTagName("textarea");

    var dataFields = []; //��� ��������� ���� input � textarea..
    var placeholderFields = []; //.. � �� ����� ��� �������� ������������

    //���������� ��� input � textarea � ���� ������
    for (var i = 0; i < inputs.length; i++) {
        dataFields.push(inputs[i]);
    }
    for (var i = 0; i < textareas.length; i++) {
        dataFields.push(textareas[i]);
    }


    for (var i = 0; i < dataFields.length; i++) {

        var type = dataFields[i].getAttribute("type");

        //�������������� ������ ��������� ����
        if (type != "text" && type != "search")
        { if (dataFields[i].tagName != "TEXTAREA") continue; }


        placeholderFields[i] = dataFields[i].cloneNode();
        placeholderFields[i].value = dataFields[i].getAttribute("placeholder");

        //��������� ����� �������� � �������, ����� ���������� � ���� �� �����������
        placeholderFields[i].number = i;

        //����� ������� �� ����-���������, ��� ��������, � ������ ����
        //���������� ��������
        placeholderFields[i].onfocus = function (event) {
            this.classList.add("hidden");
            dataFields[this.number].classList.remove("hidden");
            dataFields[this.number].focus();
        };

        placeholderFields[i].classList.add("placeholder");
        placeholderFields[i].removeAttribute("name");
        placeholderFields[i].removeAttribute("id");
        
        //��� �������� �������� �������� ���� ������, ����� ���� � �������������
        dataFields[i].classList.add("hidden");        
        //��������� ����� �������� � �������, ����� ���������� � ���� �� �����������
        dataFields[i].number = i;

        //����� ������� ����� � ��������� ����, ��, ���� � ��� ������ �� ��������,
        //��� ��������, � ������ ���� ���������� ����-��������
        dataFields[i].onblur = function (event) {
            if (this.value != "") return;
            this.classList.add("hidden");
            placeholderFields[this.number].classList.remove("hidden");
            console.log(this.number);
        };

        dataFields[i].onfocus = function (event) {            
            placeholderFields[this.number].classList.add("hidden");            
        };

        //��������� ����-��������� ����� � ���������
        dataFields[i].parentNode.insertBefore(placeholderFields[i], dataFields[i]);
    }


})();

var dayNames = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
var monthNames = [
    "Январь", "Февраль", "Март",
    "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь",
    "Октябрь", "Ноябрь", "Декабрь"];

var monthNamesInCase = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня",
    "июля", "августа", "сентября",
    "октября", "ноября", "декабря"];

//Класс monthTable
//Создает календарь из шаблонных узлов на месяц, заданный аргументом date {Date} (по-умолчанию, текущая дата)
//Шаблонные узлы задаются в макете классом monthTableTemplate
//nearbyNode - узел, рядом с которым будем размещать календарь   
function MonthTable(date, nearbyNode) {

    date = date || new Date();
    nearbyNode = nearbyNode || document.body;

    //Сохраняем указатель на календарь, чтобы обработчики могли к нему обратиться 
    var managedMonthTable = this;

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var daysInMonth = new Date(year, month, 0).getDate();
    var startDay = new Date(year, month - 1, 1).getDay(); //день начала месяца
    startDay = (startDay == 0) ? 6 : (startDay - 1);//теперь понедельник - 0, воскресенье - 6

    //Если календарь создается на текущий месяц, запоминаем сегодняшнее число,
    //чтобы отобразить его в календаре
    var today = 0;
    if (year == new Date().getFullYear() && month - 1 == new Date().getMonth()) {
        today = new Date().getDate();
    }

    //сколько недель занимает месяц (количество строк в календаре)
    var weeksInMonth = Math.ceil((daysInMonth + startDay) / 7);

    var monthTable = MonthTable.templates["monthTable"].cloneNode(true);   
    
    //Создаем календарь из шаблонных узлов
    for (var i = 0, dayCounter = 1 - startDay; i < weeksInMonth; i++) {

        monthTable.appendChild(MonthTable.templates["monthTable__row"].cloneNode(true));

        for (var k = 0; k < 7 && dayCounter <= daysInMonth; k++, dayCounter++) {

            var datetime = year + "-" + ((month > 9) ? month : "0" + month) + "-" + ((dayCounter > 9) ? dayCounter : "0" + dayCounter);

            if (localStorage[datetime + "_" + "eventName"]) {
                monthTable.children[i].appendChild(MonthTable.templates["monthTable__cell_filled"].cloneNode(true));
                monthTable.children[i].children[k].classList.add("monthTable__cell_filled");
                monthTable.children[i].children[k].getElementsByTagName("h1")[0].innerHTML = localStorage[datetime + "_" + "eventName"];
                monthTable.children[i].children[k].getElementsByTagName("span")[0].innerHTML = localStorage[datetime + "_" + "eventAttendanceList"];
            }
            else {
                monthTable.children[i].appendChild(MonthTable.templates["monthTable__cell"].cloneNode(true));
            }

            //если дня не существует, помечаем ячейку пустой и не записываем дату в ячейку  
            if (dayCounter <= 0) {
                monthTable.children[i].children[k].classList.add("monthTable__cell_empty");
                monthTable.children[i].children[k].children[0].innerHTML = "";

            }
            else {
                
                monthTable.children[i].children[k].children[0].innerHTML = dayCounter;
                //прописываем datetime дял тега time ячейки
                monthTable.children[i].children[k].children[0].setAttribute("datetime", datetime);
                
                if (dayCounter == today) {
                    monthTable.children[i].children[k].classList.add("monthTable__cell_today");
                }
            }
        }
    }

    //Расставляем названия дней недели
    for (var i = 0; i < 7; i++) {
        var cellDate = monthTable.children[0].children[i].children[0];
        cellDate.innerHTML = (cellDate.innerHTML == "") ? dayNames[i] : dayNames[i] + ", " + cellDate.innerHTML;
    }

    ////////////////////////////////
    //Запоминаем ссылку на главный узел календаря 
    this.node = monthTable;       
    
    this.selectedCell; 

    this.date = date;
    ////////////////////////////////    

    //Функция для отображения календаря
    this.placeBefore = function (left, top, before) {

        before = before || nearbyNode;
        this.node.style.left = left || this.node.style.left;
        this.node.style.top = top || this.node.style.top;        

        before.parentNode.insertBefore(this.node, before);
    };

    //Функция переписывает узел на дату date
    this.changeDate = function (newDate) {

        this.date = newDate;
        var f = this.node.onclick;
        this.node.parentNode.removeChild(this.node);
        this.node = new MonthTable(newDate).node.cloneNode(true);
        this.node.onclick = f;

    };

    //перерисовываем календарь. По уполчанию - на ту же дату.
    this.updateView = function (newDate) {

        newDate = newDate || this.date;

        this.changeDate(newDate);
        this.placeBefore();
        this.clearSelection();
    };

    //Создает строку с датой, месяц написан словом. По уполчанию - дата выделенной ячейки
    this.makeDateString = function (month, day) {

        if (!month && !day) {
            var datetime = this.selectedCell.getElementsByTagName("time")[0].getAttribute("datetime") + "_";

            day = +datetime.slice(8, 10);
            month = +datetime.slice(5, 7) - 1;
        }

        return day + " " + monthNamesInCase[month];
    };

    //удаляет выделенную ячейку
    this.clearSelection = function () {

        if (this.selectedCell) {
            this.selectedCell.classList.remove("monthTable__cell_selected");
            this.selectedCell = null;
        };
    };

    //функция выделяет ячейку на соответствующую дату в будущем
    this.selectCell = function (month, day, year) {

        var today = new Date();

        var jumpDate; //дата, куда следует переместиться

        if (year) {

            jumpDate = new Date(year, month, day);
        }
        else {
        console.log("today.getMonth()" + today.getMonth());
        console.log("month" + month);
        console.log("today.getDate()" + today.getDate());
        console.log("day" + day);
            if ((today.getMonth() > month) || (today.getMonth() == month && today.getDate() > day)) {
                //если в этом году искомый месяц прошел, или, при одинаковом месяце
                //сегодняшнее число больше, то создаем календарь на след. год
                jumpDate = new Date(today.getFullYear() + 1, month, day);
            }
            else {
                jumpDate = new Date(today.getFullYear(), month, day);
            }
        }

        //если в месяце меньше дней, чем искомая дата, выделим ячейку последнего числа нужного месяца
        var daysInMonth = new Date(jumpDate.getFullYear(), month + 1, 0).getDate();
        if (daysInMonth < day) {
            day = daysInMonth;
            jumpDate = new Date(jumpDate.getFullYear(), month, day);
        }        

        var startDay = new Date(jumpDate.getFullYear(), month, 1).getDay(); //день начала месяца

        startDay = (startDay == 0) ? 6 : (startDay - 1);//теперь понедельник - 0, воскресенье - 6

        var weekIndex = Math.floor((startDay + day - 1) / 7); //номер недели (включая неполные)       

        var dayInWeek = day + startDay - 7 * weekIndex - 1; //номер дня в неделе
        console.log(dayInWeek);

        this.updateView(jumpDate);

        this.selectedCell = this.node.getElementsByClassName("monthTable__row")[weekIndex].getElementsByClassName("monthTable__cell")[dayInWeek];
        this.selectedCell.classList.add("monthTable__cell_selected");

        console.log(this.date);
    };

    //Функция позволяет привязать к таблице элементы управления
    //controller - узел элемента управления (листалки, формы, кнопки - что угодно.
    //Для каждого элемента можно прописать свой обработчик)
    //handler - обработчик события (например, при клике на элемент управления, что-то происходит с календарем)
    //eventType - тип события
    this.addController = function (controller, handler, eventType) {       

        eventType = eventType || "onclick";

        if (eventType == "onclick") {

            controller.onclick = function (event) {

                handler = handler.bind(controller);
                handler(managedMonthTable, event);
            };
        }
    };

    //Подготовительные операции для добавленных элементов управления
    this.initController = function (initFunction) {

        initFunction(managedMonthTable);
    };  

}

//Создает шаблонные узлы для использования в классе monthTable
MonthTable.setTemplates = function () {

    var templates = document.getElementsByClassName("monthTableTemplate");

    //статическая переменная для хранения шаблонов
    this.templates = {};

    for (var i = 0; i < templates.length; i++) {
        if (templates[i].classList.contains("monthTable")) {
            this.templates["monthTable"] = templates[i].cloneNode(false);
            this.templates["monthTable"].classList.remove("monthTableTemplate");
            this.templates["monthTable"].classList.remove("hidden");
            this.templates["monthTable"].id = "";
        }
        else if (templates[i].classList.contains("monthTable__row")) {
            this.templates["monthTable__row"] = templates[i].cloneNode(false);
            this.templates["monthTable__row"].classList.remove("monthTableTemplate");
            this.templates["monthTable__row"].id = "";
        }
        else if (templates[i].classList.contains("monthTable__cell") &&
                !templates[i].classList.contains("monthTable__cell_filled")) {
            this.templates["monthTable__cell"] = templates[i].cloneNode(true);
            this.templates["monthTable__cell"].classList.remove("monthTableTemplate");
            this.templates["monthTable__cell"].id = "";
        }
        else if (templates[i].classList.contains("monthTable__cell_filled")) {
            this.templates["monthTable__cell_filled"] = templates[i].cloneNode(true);
            this.templates["monthTable__cell_filled"].classList.remove("monthTableTemplate");
            this.templates["monthTable__cell_filled"].id = "";
        }
    }
};

////////////////////////


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


//листалка месяцев
var monthSelector = document.getElementById("monthSelector");
//базовая форма добавления события
var basicForm = document.getElementById("basicForm");
//расширенная форма
var detailForm = document.getElementById("detailForm");
//кнопка добавления события
var addEventBasicButton = document.getElementById("addEventBasic");
//запоминаем ссылки на поля расширенной формы
var detailFormInputFields = getDetailFormInputFields();
//Регулярное выражение для поля ввода события в базовой форме (пример - "5 марта, 14:55, событие")
var addEventBasicRegExp = /(\d{1,2})\s([А-ЯЁа-я]{3,8})\s?,\s?(\d{1,2}):(\d{2})\s?,\s?([\d\D]+)/;

//Создаем шаблоны календаря
MonthTable.setTemplates();

monthTableMain = new MonthTable(new Date(), document.getElementById("monthTable"));
//размещаем календарь
monthTableMain.placeBefore();

//Привязываем элементы управления к календарю
monthTableMain.addController(monthSelector, monthSelectorOnclick);
monthTableMain.addController(monthTableMain.node, monthTableMainOnclick);
monthTableMain.addController(basicForm, basicFormOnclick);
monthTableMain.addController(detailForm, detailFormOnclick);
monthTableMain.addController(addEventBasicButton, addEventBasicButtonOnclick);
//Инициализируем элементы управления
monthTableMain.initController(monthSelectorInitialiser);

////////////Поиск/////////
Search.setTemplates();
var searchMain = new Search();

(function () {
    var boxNode = document.getElementsByClassName("search")[0];
    searchMain.linkInput(boxNode);
    console.log(searchMain.boxNode.onclick);
})();

//Заглушка для обработчика кликов по результатам поиска
//Обработчик должен привязываться через addController
addEvent(searchMain.resultsNode, "click", function (event) {

    event = event || window.event;
    var target = event.target || event.srcElement;    

    while (!target.classList.contains("searchResults__itemSelectArea")) {
        //Если клик вне ячеек
        if (target == searchMain.resultsNode) return;
        target = target.parentNode;
    }

    var datetime = target.getElementsByClassName("searchResults__itemText")[0].getAttribute("datetime");
    
    year = +datetime.slice(0, 4);
    day = +datetime.slice(8, 10);
    month = +datetime.slice(5, 7) - 1;

    monthTableMain.selectCell(month, day, year);

    //обновляем листалку
    var monthSelector__month = monthSelector.getElementsByClassName("monthSelector__month")[0];
    monthSelector__month.innerHTML = monthNames[monthTableMain.date.getMonth()] + " " + monthTableMain.date.getFullYear();
});

////////////Главный обработчик/////////
document.onclick = function (event) {

    event = event || window.event;
    var target = event.target || event.srcElement;

    while (target != this) {

        if (target == searchMain.resultsNode) {
            break;
        }

        if (target == searchMain.boxNode) {
            break;
        }

        target = target.parentNode;
    }

    if (target == this) {
        searchMain.hideResults();
    };

};
///////////
addEvent(searchMain.inputNode, "focus", function ()
{
    hideDetailForm();
    hideBasicForm();
    monthTableMain.clearSelection();
});


//По клику на ячейки выделяем их и показываем содержимое в popup'е
function monthTableMainOnclick(managedMonthTable, event) {

    event = event || window.event;
    var target = event.target || event.srcElement;

    //Если клик произошел по содержимому ячейки, доведем target до самой ячейки
    while (!target.classList.contains("monthTable__cell")) {

        //Если клик вне ячеек
        if (target == this) return;

        target = target.parentNode;
    }

    //Нас интересуют клики только по непустым ячейкам        
    if (target.classList.contains("monthTable__cell_empty")) return;

    //Проверяем, была ли выделена ячейка, на который кликнули        
    var isSelected = target.classList.contains("monthTable__cell_selected");

    //Одновременно может быть выделена только одна ячейка, поэтому сначала 
    //снимаем выделение всех ячеек..
    managedMonthTable.clearSelection();

    //..затем, если ячейка изначально не была выделена, то выделяем.
    //если была, то выделение снялось в предыдущем цикле
    if (!isSelected) {
        target.classList.add("monthTable__cell_selected");
        //Запоминаем выделенную ячейку для обработчиков
        managedMonthTable.selectedCell = target;        
        
        var localStorageIdPrefix = managedMonthTable.selectedCell.getElementsByTagName("time")[0].getAttribute("datetime") + "_";
        showDetailForm(
            managedMonthTable,
            localStorage[localStorageIdPrefix + "eventName"],
            managedMonthTable.makeDateString(),
            localStorage[localStorageIdPrefix + "eventAttendanceList"],
            localStorage[localStorageIdPrefix + "eventDescription"]);
        
    }
    else {
        hideDetailForm();
    }
}

function monthSelectorOnclick(managedMonthTable, event) {     
  
        event = event || window.event;
        var target = event.target || event.srcElement;
        
        var date = managedMonthTable.date;

        //Доводим target до кнопки, если клик был по ее содежимому
        while (!target.classList.contains("monthSelector__buttonLeft") &&
               !target.classList.contains("monthSelector__buttonRight") &&
               !target.classList.contains("monthSelector__buttonToday")) {

            //Если клик вне кнопок
            if (target == this) { return; }

            target = target.parentNode;
        }

        if (target.classList.contains("monthSelector__buttonLeft")) {

            managedMonthTable.changeDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
            managedMonthTable.placeBefore();
        }
        else if (target.classList.contains("monthSelector__buttonRight")) {

            managedMonthTable.changeDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
            managedMonthTable.placeBefore();

        }
        else if (target.classList.contains("monthSelector__buttonToday")) {

            managedMonthTable.changeDate(new Date());
            managedMonthTable.placeBefore();
        }

        date = managedMonthTable.date;

        var monthSelector__month = this.getElementsByClassName("monthSelector__month")[0];
        monthSelector__month.innerHTML = monthNames[date.getMonth()] + " " + date.getFullYear();

        detailForm.classList.add("invisible");   
}

function monthSelectorInitialiser(managedMonthTable) {    
    
    //Присваиваем листалке дату, на которую отобрадается календарь
    var monthSelector__month = monthSelector.getElementsByClassName("monthSelector__month")[0];
    monthSelector__month.innerHTML = monthNames[managedMonthTable.date.getMonth()] + " " + managedMonthTable.date.getFullYear();
    //Запрещаем выделение при быстром перелистывании месяцев
    monthSelector.onmousedown = monthSelector.onselectstart = function () { return false; }
}

function basicFormOnclick(managedMonthTable, event) {

    event = event || window.event;
    var target = event.target || event.srcElement;

    if (target.classList.contains("popup__close")) { //нажали на крестик
        this.classList.add("invisible");
    }
    else if (target.classList.contains("button_submit")) { //нажали кнопку "создать"

        
        var inputList = this.getElementsByTagName("input");
        for (var i = 0; i < inputList.length; i++) {            
            if (inputList[i].getAttribute("name") == "eventString") {
               var eventString = inputList[i].value; break;
            }
        }

        if (eventString)
        {
            //заносим информацию из строки в массив
            var eventParameters = addEventBasicRegExp.exec(eventString);

            //если введенная строка не соответствует формату
            if (!eventParameters) { return;}
            if (+eventParameters[1] < 1 || +eventParameters[1] > 31) { return; }
            eventParameters[2] = eventParameters[2].slice(0,3);
            var monthIndex;

            //ищем номер месяца, проверяя 3 буквы месяца из строки 
            for (var i = 0; i < monthNamesInCase.length; i++) {
                if (eventParameters[2].toLowerCase() == (monthNamesInCase[i].slice(0, 3).toLowerCase())) {
                    monthIndex = i;
                }
            }
            
            if (!monthIndex) { return; }

            //выделяем нужную ячейку
            managedMonthTable.selectCell(monthIndex, +eventParameters[1]);

            //обновляем листалку
            var monthSelector__month = monthSelector.getElementsByClassName("monthSelector__month")[0];
            monthSelector__month.innerHTML = monthNames[managedMonthTable.date.getMonth()] + " " + managedMonthTable.date.getFullYear();

            //скрываем базовую форму и показываем детальную с заполненными параметрами
            this.classList.add("invisible");
            showDetailForm(managedMonthTable, eventParameters[5], managedMonthTable.makeDateString()); 
        }
    }
}

function detailFormOnclick(managedMonthTable, event) {  

    event = event || window.event;
    var target = event.target || event.srcElement;

    //Идентификаторы в localStorage будут на основе даты ячейки
    var localStorageIdPrefix = managedMonthTable.selectedCell.getElementsByTagName("time")[0].getAttribute("datetime") + "_";

    if (target.classList.contains("popup__close")) {
        managedMonthTable.clearSelection();
        this.classList.add("invisible");
    }
    else if (target.classList.contains("button_submit")) { //кнопка "готово"      
        
        //записываем информацию из полей формы в localStorage
        //если задано название события
        if (detailFormInputFields[0].value != "") {
            try {
                localStorage[localStorageIdPrefix + "eventName"] = detailFormInputFields[0].value;
                localStorage[localStorageIdPrefix + "eventAttendanceList"] = detailFormInputFields[2].value;
                localStorage[localStorageIdPrefix + "eventDescription"] = detailFormInputFields[3].value;
                localStorage[localStorageIdPrefix + "eventDate"] = managedMonthTable.makeDateString();                

            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert("Локальное хранилище переполнено");
                }
            }
            managedMonthTable.updateView(); //обновляем календарь, чтобы отобразить записанное событие
            hideDetailForm();
        }
    }
    else if (target.classList.contains("button_cancel")) { //кнопка "удалить" 
        localStorage.removeItem(localStorageIdPrefix + "eventName");
        localStorage.removeItem(localStorageIdPrefix + "eventAttendanceList");
        localStorage.removeItem(localStorageIdPrefix + "eventDescription");
        localStorage.removeItem(localStorageIdPrefix + "eventDate");
        managedMonthTable.updateView();       
        hideDetailForm();
    }
}

function addEventBasicButtonOnclick(managedMonthTable, event) {

    event = event || window.event;
    var target = event.target || event.srcElement;

    managedMonthTable.clearSelection(); 
    toggleBasicForm(managedMonthTable); //нажатием на кнопку мы можем и показать и скрыть форму
}

//положение формы определяется положением ячейки, к которой она относится.
//форма всегда стремится к центру календаря
function showDetailForm(managedMonthTable) {   

    //Скрываем this.basicForm - может быть активна только одна форма
    basicForm.classList.add("invisible");

    //уничтожаем стрелку - каджый раз рисуем новую
    if (detailForm.getElementsByClassName("popupArrow")) {            
        detailForm.removeChild(detailForm.getElementsByClassName("popupArrow")[0]);
    }

    //вычисляем координаты ячейки относительно календаря
    var cellCoords = {};
    var rowRect = managedMonthTable.node.children[0].getBoundingClientRect();
    var cellRect = managedMonthTable.selectedCell.getBoundingClientRect();
    cellCoords.top = cellRect.top - rowRect.top;
    cellCoords.left = cellRect.left - rowRect.left;

    //располагаем popup 
    var cellDimensions = {};       
    cellDimensions.width = cellRect.right - cellRect.left;
    cellDimensions.height = cellRect.bottom - cellRect.top;

    //вычисляем позицию ячейки
    var cellPosition = {};
    cellPosition.v = Math.round(cellCoords.top / cellDimensions.height);
    cellPosition.h = Math.round(cellCoords.left / cellDimensions.width);

    //определяем угол popup'а, примыкающий к ячейке
    var popupPosition = {};        
    if (cellPosition.v <= 2) { popupPosition.v = "top"; }
    else { popupPosition.v = "bottom"; }
    if (cellPosition.h <= 3) { popupPosition.h = "right"; }
    else { popupPosition.h = "left"; }        

    //располагаем стрелку в popup'е
    var arrow = document.createElement("div");
    arrow.classList.add("popupArrow");        
    arrow.classList.add("popupArrow_" + popupPosition.h); //стрелка всегда располагается горизонтально

    //высота стрелки зависит от того, в верхней или нижней части календаря 
    //находится выделенная ячейка 
    var popupShift = 20, //сдвиг popup'а от края ячейки
        arrowShift = 0, //сдвиг стрелки от края ячейки
        arrowWidth = 12,
        arrowHeight = 27;

    if(popupPosition.v == "top"){
        arrow.style.top = (popupShift + arrowShift) + "px";
        arrow.style.bottom = null;
    }
    else {
        arrow.style.bottom = (popupShift + cellDimensions.height - arrowShift - arrowHeight) + "px";
        arrow.style.top = null;
    }        

    //располагаем popup 
    var popupDimensions = {};        
    var popupRect = detailForm.getBoundingClientRect();
    popupDimensions.width = popupRect.right - popupRect.left;
    popupDimensions.height = popupRect.bottom - popupRect.top;

    if (popupPosition.v == "top") {
        detailForm.style.top = (cellCoords.top + rowRect.top - popupShift) + "px";
    }
    else {
        detailForm.style.top = (cellCoords.top - popupDimensions.height + cellDimensions.height + rowRect.top + popupShift) + "px";
    }

    if (popupPosition.h == "right") {
        detailForm.style.left = (cellCoords.left + cellDimensions.width + rowRect.left + arrowWidth) + "px";
    }
    else {
        detailForm.style.left = (cellCoords.left - popupDimensions.width + rowRect.left - arrowWidth) + "px";
    }
          
    //////////////////////////////////////////////////////////
    //в дополнительных аргументах передаются заполненные поля    
    //если поле заполнено, показываем готовое, если нет - показываем поле для заполнения
    if (arguments[1]) {        
        showReadyField(0, arguments[1]);
    }
    else {
        showInputField(0);        
    }
    //-------------------------------------       
    if (arguments[2]) {       
        showReadyField(1, arguments[2]);
    }
    else {
        showInputField(1);
    }
    //-------------------------------------        
    if (arguments[3]) {
        showReadyField(2, arguments[3], "<div class='popup__subheader'>Участники:</div>" + arguments[3]);        
    }
    else {
        showInputField(2);        
    }
    //-------------------------------------
    if (arguments[4]) {
        detailFormInputFields[3].value = arguments[4];
        if (detailForm.getElementsByClassName("placeholder").length > 0) {
            detailForm.getElementsByClassName("placeholder")[3].classList.add("hidden");//ie плейсхолдер
            detailFormInputFields[3].classList.remove("hidden");
        }
    }
    else {
        detailFormInputFields[3].value = "";        
        if (detailForm.getElementsByClassName("placeholder").length > 0) {
            detailForm.getElementsByClassName("placeholder")[3].classList.remove("hidden");//ie плейсхолдер
            detailFormInputFields[3].classList.add("hidden");
        }
    }
    //////////////////////////////////////////////////////////  
    
    //прикрепляем стрелку
    detailForm.appendChild(arrow);
    //Отображаем popup
    detailForm.classList.remove("invisible");
}

function hideDetailForm() {
    detailForm.classList.add("invisible");
}

function toggleBasicForm() {

    //скрываем this.detailForm - должно быть видно только одну форму
    detailForm.classList.add("invisible");
    basicForm.classList.toggle("invisible");   
};

function hideBasicForm() {
    basicForm.classList.add("invisible");
}

//собирает в массив все поля ввода подробной формы - для удобства
function getDetailFormInputFields() {

    var fieldList = ["none", "none", "none", "none"];
    var inputList = detailForm.getElementsByTagName("input");
    for (var i = 0; i < inputList.length; i++) {
        
        //if(inputList[i].classList.contains("placeholder")){ continue;}; //если выбирать по классам

        if (inputList[i].getAttribute("name") == "eventName") {
            
            fieldList[0] = inputList[i];            
        }
        if (inputList[i].getAttribute("name") == "eventDate") {
           
            fieldList[1] = inputList[i];
        }
        if (inputList[i].getAttribute("name") == "eventAttendanceList") {            
            fieldList[2] = inputList[i];
        }
    }
    fieldList[3] = document.getElementsByName("eventDescription")[0];
    
    return fieldList;
}

//отображает поле ввода вместо поля с готовым текстом
//функция для detailForm
function showReadyField(index, value, html) {

    html = html || value;

    var field;

    switch (index) {
        case 0:
            field = detailForm.getElementsByClassName("popup__header")[0];
            break;
        case 1:
            field = detailForm.getElementsByTagName("time")[0];
            break;
        case 2:
            field = document.getElementsByClassName("detailForm__attendanceList")[0];
            break;
    }    

    //console.log(field);

    field.classList.remove("hidden");
    field.innerHTML = html;
    detailFormInputFields[index].classList.add("hidden");
    detailFormInputFields[index].value = value;
    if (IE <= 9) {
        detailForm.getElementsByClassName("placeholder")[index].classList.add("hidden");//ie плейсхолдер
    }   
}

//отображает поле с готовым текстом вместо поля ввода
//функция для detailForm
function showInputField(index) {

    var field;

    switch (index) {
        case 0:
            field = detailForm.getElementsByClassName("popup__header")[0];
            break;
        case 1:
            field = detailForm.getElementsByTagName("time")[0];
            break;
        case 2:
            field = document.getElementsByClassName("detailForm__attendanceList")[0];
            break;
    }

    field.classList.add("hidden");
    
    detailFormInputFields[index].classList.remove("hidden");
    
    detailFormInputFields[index].value = "";
    if (IE <= 9) {
        detailFormInputFields[index].classList.add("hidden");
        detailForm.getElementsByClassName("placeholder")[index].classList.remove("hidden");//ie плейсхолдер
    }
}