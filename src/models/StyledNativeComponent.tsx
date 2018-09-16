// @flow
import hoist from 'hoist-non-react-statics'
import React, { createElement, PureComponent, ComponentType } from 'react'
import determineTheme from '../utils/determineTheme'
import { EMPTY_OBJECT } from '../utils/empties'
import generateDisplayName from '../utils/generateDisplayName'
import isFunction from '../utils/isFunction'
import isTag from '../utils/isTag'
import isDerivedReactComponent from '../utils/isDerivedReactComponent'
import isStyledComponent from '../utils/isStyledComponent'
import once from '../utils/once'
import { ThemeConsumer } from './ThemeProvider'

import { Theme } from './ThemeProvider'
import { RuleSet, Target } from '../types'

const warnInnerRef = once(() =>
  // eslint-disable-next-line no-console
  console.warn(
    'The "innerRef" API has been removed in styled-components v4 in favor of React 16 ref forwarding, use "ref" instead like a typical component.'
  )
)

export interface BaseStyledNativeComponentRoot {
  setNativeProps(args: any): void
  [key: string]: any
}
export interface NativeComponentOptions {
  attrs: any
  displayName?: string
  ParentComponent?: ComponentType
  [key: string]: any
}

// $FlowFixMe
class BaseStyledNativeComponent extends PureComponent<any, any> {
  root?: BaseStyledNativeComponentRoot

  attrs = {}

  render() {
    return (
      <ThemeConsumer>
        {(theme?: Theme) => {
          const {
            as: renderAs,
            forwardedClass,
            forwardedRef,
            innerRef,
            style = [],
            ...props
          } = this.props

          const { defaultProps, target } = forwardedClass

          let generatedStyles
          if (theme !== undefined) {
            const themeProp = determineTheme(this.props, theme, defaultProps)
            generatedStyles = this.generateAndInjectStyles(
              themeProp,
              this.props
            )
          } else {
            generatedStyles = this.generateAndInjectStyles(
              theme || EMPTY_OBJECT,
              this.props
            )
          }

          const propsForElement = {
            ...this.attrs,
            ...props,
            style: [generatedStyles].concat(style),
          }

          if (forwardedRef) propsForElement.ref = forwardedRef
          if (process.env.NODE_ENV !== 'production' && innerRef) warnInnerRef()

          return createElement(renderAs || target, propsForElement)
        }}
      </ThemeConsumer>
    )
  }

  buildExecutionContext(theme: any, props: any, attrs: any) {
    const context = { ...props, theme }

    if (attrs === undefined) return context

    this.attrs = {}

    let attr
    let key

    /* eslint-disable guard-for-in */
    for (key in attrs) {
      attr = attrs[key]

      this.attrs[key] =
        isFunction(attr) &&
        !isDerivedReactComponent(attr) &&
        !isStyledComponent(attr)
          ? attr(context)
          : attr
    }
    /* eslint-enable */

    return { ...context, ...this.attrs }
  }

  generateAndInjectStyles(theme: any, props: any) {
    const { inlineStyle } = props.forwardedClass

    const executionContext = this.buildExecutionContext(
      theme,
      props,
      props.forwardedClass.attrs
    )

    return inlineStyle.generateStyleObject(executionContext)
  }

  setNativeProps(nativeProps: Object) {
    if (this.root !== undefined) {
      // $FlowFixMe
      this.root.setNativeProps(nativeProps)
    } else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'setNativeProps was called on a Styled Component wrapping a stateless functional component.'
      )
    }
  }
}

export default (InlineStyle: Function) => {
  const createStyledNativeComponent = (
    target: Target,
    options: NativeComponentOptions,
    rules: RuleSet
  ) => {
    const {
      attrs,
      displayName = generateDisplayName(target),
      ParentComponent = BaseStyledNativeComponent,
    } = options

    const isClass = !isTag(target)
    const isTargetStyledComp = isStyledComponent(target)

    const StyledNativeComponent = React.forwardRef((props, ref) => (
      <ParentComponent
        {...props}
        forwardedClass={StyledNativeComponent}
        forwardedRef={ref}
      />
    ))

    const finalAttrs =
      // $FlowFixMe
      isTargetStyledComp && target.attrs ? { ...target.attrs, ...attrs } : attrs

    /**
     * forwardRef creates a new interim component, which we'll take advantage of
     * instead of extending ParentComponent to create _another_ interim class
     */

    // $FlowFixMe
    StyledNativeComponent.attrs = finalAttrs

    StyledNativeComponent.displayName = displayName

    // $FlowFixMe
    StyledNativeComponent.inlineStyle = new InlineStyle(
      // $FlowFixMe
      isTargetStyledComp ? target.inlineStyle.rules.concat(rules) : rules
    )

    // $FlowFixMe
    StyledNativeComponent.styledComponentId = 'StyledNativeComponent'
    // $FlowFixMe
    StyledNativeComponent.target = isTargetStyledComp ? target.target : target
    // $FlowFixMe
    StyledNativeComponent.withComponent = function withComponent(tag: Target) {
      const { displayName: _, componentId: __, ...optionsToCopy } = options
      const newOptions = {
        ...optionsToCopy,
        attrs: finalAttrs,
        ParentComponent,
      }

      return createStyledNativeComponent(tag, newOptions, rules)
    }

    if (isClass) {
      // $FlowFixMe
      hoist(StyledNativeComponent, target, {
        // all SC-specific things should not be hoisted
        attrs: true,
        displayName: true,
        inlineStyle: true,
        styledComponentId: true,
        target: true,
        warnTooManyClasses: true,
        withComponent: true,
      })
    }

    return StyledNativeComponent
  }

  return createStyledNativeComponent
}