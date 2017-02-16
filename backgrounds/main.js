"use strict";

let storage = browser.storage.local.get("simpleBlocker");

let regexes = [];

function normalizeData(data) {
    if (!data.simpleBlocker) {
        data = {
            simpleBlocker: {
                regexes: ''
            }
        };
    }

    return data;
}

function updateRegexes(strRegexArray) {
    regexes = [];
    for (let r of strRegexArray) {
        if (r) {
            regexes.push(new RegExp(r));
        }
    }
}

function save(stringRegexes) {
    storage.then((data) => {
        data = normalizeData(data);
        data.simpleBlocker.regexes = stringRegexes;
        browser.storage.local.set(data);
        updateRegexes(stringRegexes.split(/\r?\n/));
    });
}

function retrieve() {
    return storage.then((data) => {
        data = normalizeData(data);
        updateRegexes(data.simpleBlocker.regexes.split(/\r?\n/));

        return data.simpleBlocker.regexes;
    });
}

function filterRequest(request) {
    let cancel = false;
    for (let regex of regexes) {
        if (regex.test(request.url)) {
            cancel = true;
            break;
        }
    }

    return { cancel: cancel };
}

storage.then((data) => {
    data = normalizeData(data);
    updateRegexes(data.simpleBlocker.regexes.split(/\r?\n/))
});

browser.webRequest.onBeforeRequest.addListener(
    filterRequest,
    {urls: ["<all_urls>"]},
    ["blocking"]
);
