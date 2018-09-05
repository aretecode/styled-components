// @flow
import { ClassicComponentClass } from 'react'

/**
 * @todo dedupe reuse
 */
/* eslint-disable no-undef */
export default function getComponentName(
  target: ClassicComponentClass<any>
): string {
  return target.displayName || target.name || 'Component'
}
