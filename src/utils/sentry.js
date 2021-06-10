import { Integrations } from '@sentry/browser'
import * as Sentry from '@sentry/vue'
import LoglevelSentryPlugin, { redactBreadcrumbData } from '@toruslabs/loglevel-sentry'
import log from 'loglevel'

import { UserError } from './utils'

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
    ignoreErrors: [
      // Happen when user click 'X' on the browser (ref https://forum.sentry.io/t/typeerror-failed-to-fetch-reported-over-and-overe/8447/2)
      'TypeError: Failed to fetch', // All except iOS and Firefox
      'TypeError: cancelled', // iOS
      'TypeError: NetworkError when attempting to fetch resource.', // Firefox
    ],
    beforeSend(event, hint) {
      if (hint.originalException && hint.originalException instanceof UserError) return null // Ignore errors by user
      return event
    },
    beforeBreadcrumb(breadcrumb) {
      breadcrumb.data = redactBreadcrumbData(breadcrumb.data)
      return breadcrumb
    },
  })

  const plugin = new LoglevelSentryPlugin(Sentry)
  plugin.install(log)
}

export function setSentryEnabled(enabled) {
  const client = Sentry.getCurrentHub().getClient()
  if (!client) return

  client.getOptions().enabled = enabled
}
