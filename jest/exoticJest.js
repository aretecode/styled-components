/**
 * @see https://github.com/wmonk/create-react-app-typescript/issues/185
 */
require('./jsdom')

const Enzyme = require('enzyme')
const adapter = require('enzyme-adapter-react-16')

const Adapter = adapter.default || adapter
Enzyme.configure({ adapter: new Adapter() })

// @flow
// eslint-disable-next-line no-underscore-dangle
global.__SERVER__ = typeof document === 'undefined'
