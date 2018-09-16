// @flow
import { Target, StyledComponentTarget } from '../types'

export default function isStyledComponent(target: Target) {
  return (
    target &&
    typeof (target as StyledComponentTarget).styledComponentId === 'string'
  )
}
