/* eslint-disable import/extensions */
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// eslint-disable-next-line import/first
import './helper.mjs'

globalThis.indexedDB = {}
