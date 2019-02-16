const device = {
  Android() {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPod|iPad/i)
  },
  Chrome() {
    return navigator.userAgent.match(/Chrome/i)
  },
  Firefox() {
    return navigator.userAgent.match(/Firefox/i)
  },
  Safari() {
    return navigator.userAgent.match(/Safari/i)
  },
  OperaMini() {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  IE() {
    return navigator.userAgent.match(/MSIE/i)
  },
  Edge() {
    return navigator.userAgent.match(/Edge/i)
  },
  Windows() {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any() {
    return !!(device.Android() || device.BlackBerry() || device.iOS() || device.OperaMini() || device.Windows())
  }
}

const isMobile = device.any()
const isChrome = !!device.Chrome()
const isFirefox = !!device.Firefox()
const isSafari = !!device.Safari()
const isOperaMini = !!device.OperaMini()
const isIE = !!device.IE()
const isEdge = !!device.Edge()

const chromeVersion = isChrome && parseInt(navigator.userAgent.match(new RegExp('Chrome/([0-9]+).'))[1], 10)
const firefoxVersion = isFirefox && parseInt(navigator.userAgent.match(new RegExp('Firefox/([0-9]+).'))[1], 10)

export { device, isChrome, isFirefox, isSafari, isOperaMini, isIE, isEdge, isMobile, chromeVersion, firefoxVersion }
