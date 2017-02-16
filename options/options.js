"use strict";

let background = browser.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    background.retrieve().then((data) => {
        document.querySelector('#regexes').value = data;
    });
});

document.querySelector('#regexes').addEventListener('keydown', function (e) {
    document.querySelector('aside').classList.remove('visible');
});

document.querySelector('#submit').addEventListener('click', function (e) {
    e.preventDefault();
    background.save(document.querySelector('#regexes').value);
    document.querySelector('aside').classList.add('visible');
});