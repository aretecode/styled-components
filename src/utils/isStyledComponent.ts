// @flow
import { Target } from '../types'

export default function isStyledComponent(target: Target) {
  return target && typeof target.styledComponentId === 'string'
}
