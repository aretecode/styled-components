// @flow
/* eslint-disable camelcase, no-undef */

// let __webpack_nonce__: string

export const scoped = {
  __webpack_nonce__: undefined,
  get nonce() {
    // return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null
    return scoped.__webpack_nonce__ || typeof __webpack_nonce__ !== 'undefined'
      ? __webpack_nonce__
      : null
  },
}
export const mockReset = () => {
  scoped.__webpack_nonce__ = undefined
}
export const mockImplementation = value => {
  scoped.__webpack_nonce__ = value
}

export default () => scoped.nonce
