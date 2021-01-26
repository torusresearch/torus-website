import { Integrations } from '@sentry/browser'
import * as Sentry from '@sentry/vue'
import LoglevelSentryPlugin from '@toruslabs/loglevel-sentry'
import log from 'loglevel'

export function installSentry(Vue) {
  if (!process.env.VUE_APP_SENTRY_DSN) return

  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    environment: process.env.VUE_APP_TORUS_BUILD_ENV,
    release: `torus-website@${process.env.VUE_APP_TORUS_BUILD_VERSION}`,
    autoSessionTracking: true,
    integrations: [new Integrations.Breadcrumbs({ console: false })],
    sampleRate: 1,
  })

  const plugin = new LoglevelSentryPlugin(Sentry)
  plugin.install(log)
}

export function setSentryEnabled(enabled) {
  const client = Sentry.getCurrentHub().getClient()
  if (!client) return

  client.getOptions().enabled = enabled
}
