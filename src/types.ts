import { ComponentType } from 'react'

// @flow
export type InterpolationFunction = ((
  executionContext: Object
) => Interpolation)
export type InterpolationPrimitives = string | number

export type InterpolationType = InterpolationPrimitives | InterpolationFunction
export type Interpolation = InterpolationType | Array<InterpolationType>

/* todo: I want this to actually be an array of Function | string but that causes errors */
export type RuleSet = Array<Interpolation>

/* eslint-disable no-undef */
export type Target = string | ComponentType<any>

export type NameGenerator = (hash: number) => string

export type Flattener = (
  chunks: Array<Interpolation>,
  executionContext: Object
) => Array<Interpolation>

export type Stringifier = (
  rules: Array<Interpolation>,
  selector: string,
  prefix: string
) => Array<string>

export type StyleSheet = {
  create: Function
}
