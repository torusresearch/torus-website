import log from 'loglevel'

import { valuesFor } from './util'

function txHelper(unapprovedTxs, unapprovedMsgs, personalMsgs, typedMessages, network) {
  log.debug('tx-helper called with params:')
  log.debug({ unapprovedTxs, unapprovedMsgs, personalMsgs, typedMessages, network })

  const txValues = network ? valuesFor(unapprovedTxs).filter((txMeta) => txMeta.metamaskNetworkId === network) : valuesFor(unapprovedTxs)
  log.debug(`tx helper found ${txValues.length} unapproved txs`)

  const messageValues = valuesFor(unapprovedMsgs)
  log.debug(`tx helper found ${messageValues.length} unsigned messages`)
  let allValues = txValues.concat(messageValues)

  const personalValues = valuesFor(personalMsgs)
  log.debug(`tx helper found ${personalValues.length} unsigned personal messages`)
  allValues = allValues.concat(personalValues)

  const typedValues = valuesFor(typedMessages)
  log.debug(`tx helper found ${typedValues.length} unsigned typed messages`)
  allValues = allValues.concat(typedValues)

  allValues = allValues.sort((a, b) => a.time - b.time)

  return allValues
}

export default txHelper
