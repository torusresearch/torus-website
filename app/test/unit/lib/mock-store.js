/* eslint-disable */
const { createStore } = require('redux')
const { applyMiddleware } = require('redux')
const thunkMiddleware = require('redux-thunk').default
const { createLogger } = require('redux-logger')

const rootReducer = function () {}

module.exports = configureStore

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(createStore)

function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
