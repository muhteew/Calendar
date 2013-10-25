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