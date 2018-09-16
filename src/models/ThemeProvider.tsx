// @flow
import React, { createContext, Component } from 'react'
import { ReactElement as Element } from 'react'
import memoize from 'memoize-one'
import StyledError from '../utils/error'
import isFunction from '../utils/isFunction'

export type Theme = { [key: string]: any }

type Props = {
  children?: Element<any>
  theme: Theme | ((outerTheme: Theme) => void)
}

const ThemeContext = createContext()

export const ThemeConsumer = ThemeContext.Consumer
export type ThemeProviderGetContext = (
  theme: Theme | ((outerTheme: Theme) => void),
  outerTheme?: Theme
) => Theme

/**
 * Provide a theme to an entire react component tree via context
 */
export default class ThemeProvider extends Component<Props> {
  // getContext: ThemeProviderGetContext
  // renderInner: Function

  constructor(props: Props) {
    super(props)
    this.getContext = memoize(this.getContext.bind(this))
    this.renderInner = this.renderInner.bind(this)
  }

  render() {
    if (!this.props.children) return null

    return <ThemeContext.Consumer>{this.renderInner}</ThemeContext.Consumer>
  }

  renderInner(outerTheme?: Theme) {
    const context = this.getContext(this.props.theme, outerTheme)

    return (
      <ThemeContext.Provider value={context}>
        {React.Children.only(this.props.children)}
      </ThemeContext.Provider>
    )
  }

  /**
   * Get the theme from the props, supporting both (outerTheme) => {}
   * as well as object notation
   */
  getTheme(theme: (outerTheme: Theme) => void, outerTheme: Theme) {
    if (isFunction(theme)) {
      const mergedTheme = theme(outerTheme)

      if (
        (process.env.NODE_ENV !== 'production' && mergedTheme === null) ||
        Array.isArray(mergedTheme) ||
        typeof mergedTheme !== 'object'
      ) {
        throw new StyledError(7)
      }
      return mergedTheme
    }

    if (theme === null || Array.isArray(theme) || typeof theme !== 'object') {
      throw new StyledError(8)
    }

    return { ...outerTheme, ...(theme as object) }
  }

  getContext(theme: (outerTheme: Theme) => void, outerTheme?: Theme) {
    return this.getTheme(theme, outerTheme)
  }
}