import { ComponentType } from 'react'

// @flow
export type InterpolationFunction = ((
  executionContext: Object
) => Interpolation)
export type InterpolationPrimitives = string | number

export type InterpolationType = InterpolationPrimitives | InterpolationFunction
export type Interpolation = InterpolationType | Array<InterpolationType>

export type RuleSet = Array<Interpolation>

export type Styles =
  | Array<string>
  | Object
  | ((executionContext: Object) => Interpolation)

export type Target = string | ComponentType<any>


export type ConstructWithOptionsOptions = {
  attrs?: { [key: string]: any }
  [key: string]: any
}
export interface ConstructWithOptionsTemplateFunction extends Function {
  (...args: any[]): any
  withConfig(config: any): any
  attrs(attrs?: any): any
}

export type NameGenerator = (hash: number) => string

export type CSSConstructor = (
  strings: Array<string>,
  ...interpolations: Array<Interpolation>
) => RuleSet
export type StyleSheet = {
  create: Function,
}

export type Flattener = (
  chunks: Array<Interpolation>,
  executionContext: Object,
  styleSheet: Object
) => Array<Interpolation>

export type Stringifier = (
  rules: Array<Interpolation>,
  selector: string,
  prefix: string
) => Array<string>
