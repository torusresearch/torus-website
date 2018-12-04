// ==UserScript==
// @name       Torus
// @namespace  http://tor.us
// @version    0.2
// @description  dough or donut there is no rye
// @include *
// @copyright  None
// @run-at document-start
// ==/UserScript==
if ((new URL(window.location.href).searchParams.get('torus_specific_identifier')) == 1) {
  var sc = document.createElement("script");
  sc.setAttribute("src", "https://localhost:3000/embed.min.js");
  sc.setAttribute("type", "text/javascript");
  console.log(document.getElementsByTagName("html")[0])
  document.getElementsByTagName("html")[0].appendChild(sc);
}
// console.log(document)
// document.insertBefore(document, sc);
