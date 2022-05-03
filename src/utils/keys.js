import { subkey } from '@toruslabs/openlogin-subkey'

import torus from '../torus'

export const getScopedAddress = (tKey, projectId) => {
  const scopedKey = subkey(tKey, Buffer.from(projectId, 'base64'))
  return torus.generateAddressFromPrivKey(scopedKey)
}
