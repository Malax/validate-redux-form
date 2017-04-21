import { validate } from './index'

export const validatorFromFunction = (validationFunction) => {
  return function (params) {
    const argumentsAsArray = [].slice.apply(arguments)
    return (message) => (value) => validationFunction.apply(this, [value, ...argumentsAsArray]) ? null : message
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
})

export const number = validatorFromFunction((value, {minValue, maxValue} = {}) => {
  const isNumber = !isNaN(value)
  const hasMinValue = minValue !== undefined ? parseInt(value) >= minValue : true
  const hasMaxValue = maxValue !== undefined ? parseInt(value) <= maxValue : true
  return isNumber && hasMinValue && hasMaxValue
})

export const regex = validatorFromFunction((value, pattern) => value.match(pattern) !== null)

export const array = (validationSpec, {min = 0} = {}) => (value) => {
  const normalizedValue = value.concat(new Array(Math.max(0, min - value.length)).fill({}))
  return normalizedValue.map(v => validate(v, validationSpec))
}

export default {
  validatorFromFunction,
  combine,
  exists,
  length,
  number,
  regex,
  array
}
