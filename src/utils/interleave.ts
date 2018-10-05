// @flow
import { Interpolation } from '../types'

export default (
  strings: Array<string>,
  interpolations: Array<Interpolation>
): Array<Interpolation> => {
  const result = [strings[0]]

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i] as any, strings[i + 1])
  }

  return result
}
