"use strict";

let background = browser.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    background.retrieve().then((data) => {
      document.querySelector('#regexes').value = data.regexes;
      document.querySelector('input[name="mode"][value="' + data.mode + '"]').checked = true;
      document.querySelector('input[name="debugging"][value="' + data.debug + '"]').checked = true;
    });
});

document.querySelector('#regexes').addEventListener('keydown', function (e) {
    document.querySelector('aside').classList.remove('visible');
});

document.querySelector('#submit').addEventListener('click', function (e) {
    e.preventDefault();
    background.save(document.querySelector('#regexes').value,
      document.querySelector('input[name="mode"]:checked').value,
      document.querySelector('input[name="debugging"]:checked').value
      );
    document.querySelector('aside').classList.add('visible');
});
