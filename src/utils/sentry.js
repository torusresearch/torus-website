import * as Sentry from '@sentry/vue'
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
    tracesSampleRate: getSampleRate(),
  })

  const defaultFactory = log.methodFactory
  log.methodFactory = (method, level, name) => {
    const defaultMethod = defaultFactory(method, level, name)

    switch (method) {
      case 'error':
        return (err, ...messages) => {
          Sentry.captureException(err, {
            extra: {
              messages,
            },
          })
          defaultMethod(err, ...messages)
        }
      default:
        return defaultMethod
    }
  }

  log.setLevel(log.getLevel())
}

export function setSentryEnabled(enabled) {
  const client = Sentry.getCurrentHub().getClient()
  if (!client) return

  client.getOptions().enabled = enabled
}
