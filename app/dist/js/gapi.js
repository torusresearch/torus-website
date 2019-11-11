const scriptNode = document.createElement('script')
scriptNode.src = 'https://apis.google.com/js/api.js'
scriptNode.type = 'text/javascript'
scriptNode.charset = 'utf-8'
document.getElementsByTagName('head')[0].appendChild(scriptNode)
