import { validatorFromFunction } from './utils'

export const exists = validatorFromFunction(value => !!value)

export const length = validatorFromFunction((string, {min, max} = {}) => {
  if (min === undefined && max === undefined) {
    throw new Error('length requires at least one parameter!')
  }

  const hasMinLength = min !== undefined ? string.length >= min : true
  const hasMaxLength = max !== undefined ? string.length <= max : true
  return hasMinLength && hasMaxLength
}, true)

export const number = validatorFromFunction((value, {min, max} = {}) => {
  const isNumber = !isNaN(value)
  const hasMinValue = min !== undefined ? parseInt(value) >= min : true
  const hasMaxValue = max !== undefined ? parseInt(value) <= max : true
  return isNumber && hasMinValue && hasMaxValue
}, true)

export const regex = validatorFromFunction((value, pattern) => value.match(pattern) !== null, true)

export const equals = validatorFromFunction((value, expectedValue) => value === expectedValue, false)

export default {
  exists,
  length,
  number,
  regex,
  equals
}
