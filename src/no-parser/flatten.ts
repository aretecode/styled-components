/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable no-negated-condition */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable complexity */
import { isPlainObject, isObj } from 'exotic'
import { Interpolation } from '../types'
import _flatten, { objToCss } from '../utils/flatten'

const isRuleSet = (interpolation: Interpolation): boolean =>
  !!(
    interpolation &&
    Array.isArray(interpolation) &&
    interpolation.length > 0 &&
    interpolation[0] &&
    Array.isArray(interpolation[0])
  )

const flatten = (
  chunks: Array<Interpolation>,
  executionContext?: Object
): Array<Interpolation> => {
  /* Fall back to old flattener for non-rule-set chunks */
  if (!isRuleSet(chunks)) {
    return _flatten(chunks, executionContext)
  }

  return chunks.reduce(
    (
      ruleSet: Array<Interpolation>,
      chunk: Interpolation | any
    ): Array<Interpolation> => {
      if (!Array.isArray(chunk)) {
        return ruleSet
      }

      let appendChunks = []

      const newChunk = chunk.reduce(
        (
          rules: Array<Interpolation>,
          rule: Interpolation | any
        ): Array<Interpolation> => {
          /* Remove falsey values */
          if (
            rule === undefined ||
            rule === null ||
            rule === false ||
            rule === ''
          ) {
            return rules
          }

          /* Flatten nested rule set */
          if (isRuleSet(rule)) {
            // $FlowFixMe Don't know what's wrong here
            appendChunks = [...appendChunks, ...flatten(rule, executionContext)]
            return rules
          }

          /* Stringify unexpected array */
          if (Array.isArray(rule)) {
            return [...rules, ..._flatten(rule, executionContext)]
          }

          /* Either execute or defer the function */
          if (typeof rule === 'function') {
            if (executionContext) {
              const res = rule(executionContext)

              if (isRuleSet(res)) {
                appendChunks = [
                  ...appendChunks,
                  // $FlowFixMe Don't know what's wrong here
                  ...flatten(res, executionContext),
                ]
                return rules
              }

              /* Flatten non-ruleset values */
              return [...rules, ...flatten([res], executionContext)]
            } else {
              return [...rules, rule]
            }
          }

          /* Handle other components */
          if (
            isObj(rule) &&
            // @todo hasOwnProp
            rule.hasOwnProperty('styledComponentId')
          ) {
            return [...rules, `.${rule.styledComponentId}`]
          }

          /* Convert object to css string */
          if (isObj(rule) && isPlainObject(rule)) {
            return [...rules, objToCss(rule)]
          }

          return [...rules, rule.toString()]
        },
        []
      )

      if (executionContext) {
        const newChunkStr = newChunk.join('')
        if (appendChunks.length) {
          return [...ruleSet, newChunkStr, ...appendChunks]
        }

        return [...ruleSet, newChunkStr]
      }

      return [...ruleSet, newChunk, ...appendChunks]
    },
    []
  )
}

export default flatten
