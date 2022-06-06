/* eslint-disable simple-import-sort/imports */
// Disable ESLint import sorting because '@sentry' require 'vue' and 'browser' packages to be imported before 'tracking' package
import * as Sentry from '@sentry/vue'
import { Integrations as BrowserIntegrations } from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import LoglevelSentryPlugin, { redactBreadcrumbData } from '@toruslabs/loglevel-sentry'
import log from 'loglevel'

import config from '../config'
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
    integrations: [
      new BrowserIntegrations.Breadcrumbs({ console: false }),
      new BrowserTracing({
        tracingOrigins: [config.api, config.metadataHost, config.commonApiHost],
      }),
    ],
    sampleRate: getSampleRate(),
    tracesSampleRate: getSampleRate(),
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
