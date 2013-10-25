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
