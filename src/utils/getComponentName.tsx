/**
 * @todo dedupe reuse
 */
/* eslint-disable no-undef */
export default function getComponentName(target: ReactClass<any>): string {
  return target.displayName || target.name || 'Component'
}
