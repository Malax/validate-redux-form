import { validate } from './index'

export const validatorFromFunction = (validationFunction, undefinedIsError) => {
  return function (params) {
    const argumentsAsArray = [].slice.apply(arguments)
    return (message) => (value) => {
      if (undefinedIsError && value === undefined) {
        return message
      }

      return validationFunction.apply(this, [value, ...argumentsAsArray]) ? null : message
    }
  }
}

export function combine (validators) {
  return (value) => {
    for (let i = 0; i < arguments.length; i++) {
      const result = arguments[i](value)
      if (result) {
        return result
      }
    }

    return null
  }
}

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

export const array = (validationSpec, {min = 0} = {}) => (valueOrUndefined) => {
  const value = valueOrUndefined || []
  const normalizedValue = value.concat(new Array(Math.max(0, min - value.length)).fill({}))
  return normalizedValue.map(v => validate(v, validationSpec))
}

export const equals = validatorFromFunction((value, expectedValue) => value === expectedValue, false)

export default {
  validatorFromFunction,
  combine,
  exists,
  length,
  number,
  regex,
  array,
  equals
}
