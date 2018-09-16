// @flow
/**
 * This sets up our end-to-end test suite, which essentially makes sure
 * our public API works the way we promise/want
 */
import 'jest'
import _styled from '../src/constructors/styled'
import css from '../src/constructors/css'
import _constructWithOptions from '../src/constructors/constructWithOptions'
import StyleSheet from '../src/models/StyleSheet'
import flatten from '../src/utils/flatten'
import stringifyRules from '../src/utils/stringifyRules'
import _StyledComponent from '../src/models/StyledComponent'
import _ComponentStyle from '../src/models/ComponentStyle'

import noParserCss from '../src/no-parser/css'
import noParserFlatten from '../src/no-parser/flatten'
import noParserStringifyRules from '../src/no-parser/stringifyRules'

/* Ignore hashing, just return class names sequentially as .a .b .c etc */
let index = 0
let inputs = {}
let seededClassnames = []

const classNames = input => {
  const seed = seededClassnames.shift()
  if (seed) return seed

  return inputs[input] || (inputs[input] = String.fromCodePoint(97 + index++))
}

export const seedNextClassnames = (names: Array<string>) =>
  (seededClassnames = names)
export const resetStyled = (isServer: boolean = false) => {
  if (!isServer) {
    if (!document.head) {
      throw new Error(
        process.env.NODE_ENV !== 'production' ? 'Missing document <head>' : ''
      )
    }
    document.head.innerHTML = ''
  }

  StyleSheet.reset(isServer)
  index = 0
  inputs = {}

  const ComponentStyle = _ComponentStyle(classNames, flatten, stringifyRules)
  const constructWithOptions = _constructWithOptions(css)
  const StyledComponent = _StyledComponent(ComponentStyle, constructWithOptions)

  return _styled(StyledComponent, constructWithOptions)
}

export const resetNoParserStyled = () => {
  if (!document.head) {
    throw new Error(
      process.env.NODE_ENV !== 'production' ? 'Missing document <head>' : ''
    )
  }
  document.head.innerHTML = ''
  StyleSheet.reset()
  index = 0

  const ComponentStyle = _ComponentStyle(
    classNames,
    noParserFlatten,
    noParserStringifyRules
  )
  const constructWithOptions = _constructWithOptions(noParserCss)
  const StyledComponent = _StyledComponent(ComponentStyle, constructWithOptions)

  return _styled(StyledComponent, constructWithOptions)
}

const stripComments = (str: string) => str.replace(/\/\*.*?\*\/\n?/g, '')

export const stripWhitespace = (str: string) =>
  str
    .trim()
    .replace(/([;\{\}])/g, '$1  ')
    .replace(/\s+/g, ' ')

export const expectCSSMatches = (
  _expectation: string,
  opts: { ignoreWhitespace: boolean } = { ignoreWhitespace: true }
) => {
  // NOTE: This should normalise both CSS strings to make irrelevant mismatches less likely
  const expectation = _expectation
    .replace(/ {/g, '{')
    .replace(/:\s+/g, ':')
    .replace(/:\s+;/g, ':;')

  const css = Array.from(document.querySelectorAll('style'))
    .map(tag => tag.innerHTML)
    .join('\n')
    .replace(/ {/g, '{')
    .replace(/:\s+/g, ':')
    .replace(/:\s+;/g, ':;')

  if (opts.ignoreWhitespace) {
    const stripped = stripWhitespace(stripComments(css))
    expect(stripped).toEqual(stripWhitespace(expectation))
    return stripped
  } else {
    expect(css).toEqual(expectation)
    return css
  }
}
