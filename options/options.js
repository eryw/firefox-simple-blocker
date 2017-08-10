'use strict'

let tout
let background = browser.extension.getBackgroundPage()

let autoSave = function (e) {
  e.stopPropagation()
  clearTimeout(tout)

  tout = setTimeout(function () {
    background.save(document.querySelector('#regexes').value,
      document.querySelector('input[name="mode"]:checked').value,
      document.querySelector('input[name="debugging"]:checked').value
    )
  }, 1000)
}

document.addEventListener('DOMContentLoaded', function () {
  background.retrieve().then((data) => {
    document.querySelector('#regexes').value = data.regexes
    document.querySelector('input[name="mode"][value="' + data.mode + '"]').checked = true
    document.querySelector('input[name="debugging"][value="' + data.debug + '"]').checked = true
  })
})

document.querySelectorAll('input').forEach(el => el.addEventListener('change', autoSave))
document.querySelectorAll('textarea').forEach(el => el.addEventListener('keypress', autoSave))
