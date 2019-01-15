module.exports = {
  runOnLoad,
  runOnComplete,
  htmlToElement
}

function runOnLoad (fn) {
  if (window.document.body != null) {
    fn()
  } else {
    window.document.addEventListener('DOMContentLoaded', fn)
  }
}

function runOnComplete (fn) {
  var retry = window.setInterval(function () {
    if (window.document.readyState === 'complete') {
      window.clearInterval(retry)
      fn()
    }
  }, 300)
}

function htmlToElement (html) {
  var template = window.document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}
