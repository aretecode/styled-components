// @flow
import { readFileSync } from 'fs'

const markdownPath = `${__dirname}/errors.md`
const md = readFileSync(markdownPath, 'utf8')

export default md
  .split(/^#/gm)
  .slice(1)
  .reduce((errors, str) => {
    // @note - this was escaped with \\ which broke when evaling.console..
    const pieces = str.split(/^.*?(\d+)\s*\n/)
    const [, code, message] = pieces
    // const code = str.match(/\d+/)
    // console.log({ pieces, code, message })
    errors[code] = message
    return errors
  }, {})
