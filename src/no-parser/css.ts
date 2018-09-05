import { Interpolation, RuleSet } from '../types'
import flatten from './flatten'

export default (interpolations: Array<Interpolation>): RuleSet =>
  flatten(interpolations)
