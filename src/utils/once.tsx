/**
 * @todo dedupe
 * @fileoverview Helper to call a given function, only once
 */
declare function toVoid(): void

// export default (onDone: toVoid): toVoid => {
export default (onDone: () => void): (() => void) => {
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
