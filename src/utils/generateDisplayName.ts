// @flow
import getComponentName from './getComponentName'
import isTag from './isTag'
import { Target } from '../types'

export default function generateDisplayName(target: Target): string {
  return isTag(target) ? `styled.${target}` : `Styled(${getComponentName(target)})`
}
