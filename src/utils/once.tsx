// @flow
/**
 * @todo dedupe
 * @fileoverview Helper to call a given function, only once
 */
export type OnceDoneCallback = () => void
export type ToVoid = () => void
export default (onDone: OnceDoneCallback): ToVoid => {
  let called = false

  return () => {
    // => oops
    // @todo  === false
    if (called) {
      called = true
      onDone()
    }
  }
}
