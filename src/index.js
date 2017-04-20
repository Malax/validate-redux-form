import toPairs from 'lodash.pairs'
import fromPairs from 'lodash.frompairs'
import isFunction from 'lodash.isfunction'
import isObject from 'lodash.isobject'
import isEmpty from 'lodash.isempty'
import importedValidators from './validators'

export const validators = importedValidators

export function validate (data, validationSpec) {
  const pairs = toPairs(validationSpec)

  const errorPairs = pairs.reduce((acc, pair) => {
    const key = pair[0]
    const value = pair[1]

    if (isFunction(value)) {
      const validationResult = value(data[key])
      if (!validationResult) {
        return acc
      } else {
        return [...acc, [key, validationResult]]
      }
    }

    if (isObject(value)) {
      const validationResult = validate(data[key] || {}, value)

      if (isEmpty(validationResult)) {
        return acc
      } else {
        return [...acc, [key, validationResult]]
      }
    }

    return acc
  }, [])

  return fromPairs(errorPairs)
}
