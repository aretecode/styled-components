// @flow
import { Interpolation } from '../types'

// had return Array<string> which was wrong, automatic types worked better
const stringifyRules = (
  rules: Array<Interpolation>,
  selector: string | any,
  prefix: string | any
) => [
  rules.reduce(
    (str: string, partial: Interpolation, index: number): string =>
      str +
      // NOTE: This is to not prefix keyframes with the animation name
      ((index > 0 || !prefix) && selector ? selector : '') +
      (partial && Array.isArray(partial)
        ? partial.join('')
        : partial.toString()),
    ''
  ),
]

export default stringifyRules
