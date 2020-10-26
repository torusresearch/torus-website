/* eslint-disable */
module.exports = class ExtensionPlugin {
  constructor() {}

  apply(compiler) {
    const ID = 'vue-extension'
    const manifestName = 'manifest.json'
    compiler.hooks.emit.tap(ID, (compilation) => {
      try {
        // const manifest = JSON.parse(compilation.assets[manifestName].source())
        const manifest = {}
        manifest.name = 'Torus Extension'
        manifest.manifest_version = 2
        manifest.version = '1.0'
        manifest.description = 'Torus Extension'
        manifest.browser_action = {
          default_popup: 'index.html',
          default_src: 'index.html',
        }
        manifest.permissions = ['activeTab', 'storage']
        manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; object-src 'self';`
        const newManifestSource = JSON.stringify(manifest)
        compilation.assets[manifestName] = {
          source: () => newManifestSource,
          size: () => newManifestSource.length,
        }
      } catch (error) {
        console.error('Could not run service worker integrity plugin', error)
      }
    })
  }
}
