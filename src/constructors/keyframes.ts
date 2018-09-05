// @flow
import hashStr from '../../vendor/glamor/hash'
import { Interpolation, NameGenerator, Stringifier } from '../types'
import StyleSheet from '../models/StyleSheet'

// @todo - dedupe
const replaceWhitespace = (str: string): string => str.replace(/\s|\\n/g, '')

type KeyframesFn = (
  strings: Array<string>,
  ...interpolations: Array<Interpolation>
) => string

export default (
  nameGenerator: NameGenerator,
  stringifyRules: Stringifier,
  css: Function
): KeyframesFn => (...arr): string => {
  const styleSheet = StyleSheet.master
  const rules = css(...arr)
  const name = nameGenerator(hashStr(replaceWhitespace(JSON.stringify(rules))))
  const id = `sc-keyframes-${name}`

  if (!styleSheet.hasNameForId(id, name)) {
    styleSheet.inject(id, stringifyRules(rules, name, '@keyframes'), name)
  }

  return name
}
