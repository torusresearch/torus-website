import txStateHistoryHelper from '../../../src/controllers/utils/tx-state-history-helper'

export default createTxMeta

function createTxMeta(partialMeta) {
  const txMeta = { status: 'unapproved', txParams: {}, ...partialMeta }
  // initialize history
  txMeta.history = []
  // capture initial snapshot of txMeta for history
  const snapshot = txStateHistoryHelper.snapshotFromTxMeta(txMeta)
  txMeta.history.push(snapshot)
  return txMeta
}
