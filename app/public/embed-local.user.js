// ==UserScript==
// @name       Torus Local User Script
// @namespace  http://tor.us
// @version    0.2
// @description  dough or donut there is no rye
// @include *
// @copyright  None
// @run-at document-start
// ==/UserScript==
// if ((new URL(window.location.href).searchParams.get('torus')) == 1) {

var whitelist = [
  'etheremon.com',
  'opensea.io',
  'cryptostrikers.com',
  'axieinfinity.com',
  'mlbcryptobaseball.com',
  'mycryptoheroes.net',
  'blockchaincuties.com',
  'cryptokitties.co',
  'mycrypto.com',
  'myetherwallet.com',
  'digix.global',
  'danfinlay.github.io'
]

var inWhiteList = false
whitelist.map(function(url) {
  if (window.location.hostname.indexOf(url) !== -1) {
    inWhiteList = true
  }
})
if (inWhiteList) {
  var sc = document.createElement('script')
  sc.setAttribute('src', 'https://localhost:3000/embed.min.js')
  // sc.setAttribute('integrity', 'sha384-1cJ04EyKLg38pCpT1TLw5u68BpSEH6CIfaZeMacZihPyMGdQHG+KGjj3fPrNC739')
  sc.setAttribute('crossorigin', 'anonymous')
  sc.setAttribute('type', 'text/javascript')
  sc.setAttribute('style-color', '#75b4fd')
  sc.setAttribute('style-position', 'bottom-left')
  sc.setAttribute('style-padding', '8px')
  document.getElementsByTagName('html')[0].appendChild(sc)
}
