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

