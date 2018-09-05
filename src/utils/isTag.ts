// @flow
import { Target } from '../types'

export default function isTag(target: Target) /* : %checks */ {
  return typeof target === 'string'
}
