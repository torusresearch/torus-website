/* eslint-disable */
import { shape } from 'prop-types'
import { BrowserRouter } from 'react-router-dom'

const { shallow, mount } = require('enzyme')

module.exports = {
  shallowWithStore,
  mountWithStore,
  mountWithRouter,
}

function shallowWithStore(component, store) {
  const context = {
    store,
  }
  return shallow(component, { context })
}

function mountWithStore(component, store) {
  const context = {
    store,
  }
  return mount(component, { context })
}

function mountWithRouter(node) {
  // Instantiate router context
  const router = {
    history: new BrowserRouter().history,
    route: {
      location: {},
      match: {},
    },
  }

  const createContext = () => ({
    context: { router, t: () => {} },
    childContextTypes: { router: shape({}), t: () => {} },
  })

  return mount(node, createContext())
}
