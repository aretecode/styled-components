// @flow
export default function isFunction(x: any): x is Function {
  return typeof x === 'function'
}
