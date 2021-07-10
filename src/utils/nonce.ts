// @flow
/* eslint-disable camelcase, no-undef */

// let __webpack_nonce__: string

function getOrCall(x: () => string | string) {
  return typeof x === 'function' ? x() : x
}
function getGlobal(key: string) {
  return typeof global === 'object' && global[key] !== 'undefined'
    ? getOrCall(global[key])
    : null
}

export const scoped = {
  __webpack_nonce__: undefined,
  get nonce() {
    // return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null
    return getOrCall(scoped.__webpack_nonce__) || getGlobal('__webpack_nonce__')
  },
}
export const mockReset = () => {
  scoped.__webpack_nonce__ = undefined
}
export const mockImplementation = value => {
  scoped.__webpack_nonce__ = value
}

export default () => scoped.nonce
