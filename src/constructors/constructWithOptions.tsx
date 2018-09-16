/**
 * @todo
 * 1. types on fn
 * 2. some additional enhancements can be added here
 */
// @flow
import { isValidElementType } from 'react-is'
import css from './css'
import StyledError from '../utils/error'
import { EMPTY_OBJECT } from '../utils/empties'

import { Target, ConstructWithOptionsTemplateFunction, ConstructWithOptionsOptions } from '../types'

export default function constructWithOptions(
  componentConstructor: Function,
  tag: Target,
  options: ConstructWithOptionsOptions = EMPTY_OBJECT
) {
  if (!isValidElementType(tag)) {
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