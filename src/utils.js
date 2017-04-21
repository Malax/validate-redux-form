import { validate } from './index'

export function combine (/* validators */) {
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

export function array (validationSpec, {min = 0} = {}) {
  return (valueOrUndefined) => {
    const value = valueOrUndefined || []
    const normalizedValue = value.concat(new Array(Math.max(0, min - value.length)).fill({}))
    return normalizedValue.map(v => validate(v, validationSpec))
  }
}

export function validatorFromFunction (validationFunction, undefinedIsError) {
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
