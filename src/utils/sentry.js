import { Integrations } from '@sentry/browser'
import * as Sentry from '@sentry/vue'
import LoglevelSentryPlugin from '@toruslabs/loglevel-sentry'
import log from 'loglevel'

function getSampleRate() {
  try {
    return Number.parseFloat(process.env.VUE_APP_SENTRY_SAMPLE_RATE)
  } catch {
    return 0.2
  }
}

export function installSentry(Vue) {
  if (!process.env.VUE_APP_SENTRY_DSN) return

  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    environment: process.env.VUE_APP_TORUS_BUILD_ENV,
    release: `torus-website@${process.env.VUE_APP_TORUS_BUILD_VERSION}`,
    autoSessionTracking: true,
    integrations: [new Integrations.Breadcrumbs({ console: false })],
    sampleRate: getSampleRate(),
    normalizeDepth: 5,
  })

  const plugin = new LoglevelSentryPlugin(Sentry)
  plugin.install(log)
}

export function setSentryEnabled(enabled) {
  const client = Sentry.getCurrentHub().getClient()
  if (!client) return

  client.getOptions().enabled = enabled
}
