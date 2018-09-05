// @flow
import Stringifier from './stringifier'

export default function stringify(node, builder?: any) {
  const str = new Stringifier(builder)
  str.stringify(node)
}
