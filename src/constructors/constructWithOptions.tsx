/**
 * @todo
 * 1. types on fn
 * 2. some additional enhancements can be added here
 */
// @flow
import { isValidElementType } from 'react-is'
import StyledError from '../utils/error'
import { EMPTY_OBJECT } from '../utils/empties'
import { Target } from '../types'

export type ConstructWithOptionsOptions = {
  attrs?: { [key: string]: any }
  [key: string]: any
}
export interface ConstructWithOptionsTemplateFunction extends Function {
  (...args: any[]): any
  withConfig(config: any): any
  attrs(attrs?: any): any
}

export default (css: Function) => {
  const constructWithOptions = (
    componentConstructor: Function,
    tag: Target,
    options: ConstructWithOptionsOptions = EMPTY_OBJECT
  ) => {
    if (!isValidElementType(tag) || tag === null || tag === undefined) {
      throw new StyledError(1, String(tag))
    }

    /* This is callable directly as a template function */
    // $FlowFixMe: Not typed to avoid destructuring arguments
    const templateFunction = (...args) =>
      componentConstructor(tag, options, css(...args))

    /* If config methods are called, wrap up a new template function and merge options */
    ;(templateFunction as ConstructWithOptionsTemplateFunction).withConfig = config =>
      constructWithOptions(componentConstructor, tag, { ...options, ...config })
    ;(templateFunction as ConstructWithOptionsTemplateFunction).attrs = attrs =>
      constructWithOptions(componentConstructor, tag, {
        ...options,
        attrs: { ...(options.attrs || EMPTY_OBJECT), ...attrs },
      })

    return templateFunction as ConstructWithOptionsTemplateFunction
  }

  return constructWithOptions
}
