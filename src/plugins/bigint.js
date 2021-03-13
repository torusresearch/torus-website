import bigInt from 'big-integer'
import log from 'loglevel'

log.info('bigint checking')
if (typeof BigInt === 'undefined') {
  log.info('bigint unavailable')
  window.BigInt = bigInt
} else {
  log.info('bigint available')
}
