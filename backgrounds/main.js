'use strict'

var debug = false
var mode = 0

let regexes = []

function normalizeData (data) {
  if (!data.simpleBlocker) {
    data = {
      simpleBlocker: {
        regexes: '',
        debug: debug,
        mode: mode
      }
    }
  }

  return data
}

function updateCacheVar (strRegexArray, lmode, ldebug) {
  mode = lmode
  debug = ldebug
  regexes = []
  for (let r of strRegexArray) {
    if (r && !(r.trim()).startsWith('//')) { // non-empty lines that aren't comments
      try {
        regexes.push(new RegExp(r))
      } catch (e) {
        // silent
      }
    }
  }
}

function save (stringRegexes, lmode, ldebug) { // eslint-disable-line no-unused-vars
  browser.storage.local.get('simpleBlocker').then((data) => {
    data = normalizeData(data)
    data.simpleBlocker.regexes = stringRegexes
    data.simpleBlocker.mode = lmode
    data.simpleBlocker.debug = ldebug
    browser.storage.local.set(data)
    updateCacheVar(
      stringRegexes.split(/\r?\n/),
      lmode,
      ldebug
    )
  })
}

function retrieve () { // eslint-disable-line no-unused-vars
  return browser.storage.local.get('simpleBlocker').then((data) => {
    data = normalizeData(data)
    updateCacheVar(
      data.simpleBlocker.regexes.split(/\r?\n/),
      data.simpleBlocker.mode,
      data.simpleBlocker.debug
    )

    return data.simpleBlocker
  })
}

function filterRequest (request) {
  let cancel = mode == '1'
  for (let regex of regexes) {
    if (mode === '0' && regex.test(request.url)) {
      cancel = true
      break
    }
    if (mode === '1' && regex.test(request.url)) {
        cancel = false
        break
    }
  }

  if (debug === '1' && cancel == true) {
        console.log('Canceled request: ' + request.url)
  }
  return { cancel: cancel }
}

browser.storage.local.get('simpleBlocker').then((data) => {
  data = normalizeData(data)
  updateCacheVar(
    data.simpleBlocker.regexes.split(/\r?\n/),
    data.simpleBlocker.mode,
    data.simpleBlocker.debug
  )

  // browser.storage.local.remove("simpleBlocker")
})

browser.webRequest.onBeforeRequest.addListener(
  filterRequest,
  { urls: ['<all_urls>'] },
  ['blocking']
)
