// @flow

/**
 * @todo EMPTY_OBJ
 * Parse errors.md and turn it into a simple hash of code: message
 */
const ERRORS =
  process.env.NODE_ENV !== 'production'
    ? require('./errorDevelopoment').default
    : {}

/**
 * super basic version of sprintf
 */
function format(...args) {
  let a = args[0]
  const b = []
  let c

  for (c = 1; c < args.length; c += 1) {
    b.push(args[c])
  }

  b.forEach(d => {
    a = a.replace(/%[a-z]/, d)
  })

  return a
}

/**
 * Create an error file out of errors.md for development and a simple web link to the full errors
 * in production mode.
 */
export default class StyledComponentsError extends Error {
  constructor(code: string | number, ...interpolations: Array<any>) {
    if (process.env.NODE_ENV === 'production') {
      super(
        `An error occurred. See https://github.com/styled-components/styled-components/blob/master/src/utils/errors.md#${code} for more information. ${
          interpolations
            ? `Additional arguments: ${interpolations.join(', ')}`
            : ''
        }`
      )
    } else {
      super(format(ERRORS[code], ...interpolations).trim())
    }
  }
}
