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
