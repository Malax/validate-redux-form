import { expect } from 'chai'
import { validators, validatorFromFunction, array, combine } from '../src/index'

describe('utils', function () {
  describe('validatorFromFunction', function () {
    const validator = validatorFromFunction(value => value > 23)

    it('should return a correct validator function', function () {
      expect(validator).to.be.a('function')
      expect(validator()).to.be.a('function')
      expect(validator()('failed')).to.be.a('function')
    })

    it('should return the error when the given function returns false', function () {
      expect(validator()('failed')(10)).to.equal('failed')
    })

    it('should return null when the given function returns true', function () {
      expect(validator()('failed')(42)).to.equal(null)
    })

    it('should pass a parameter to the function', function () {
      const validatorWithParam = validatorFromFunction((value, param) => value > param)
      expect(validatorWithParam(5)('failed')(4)).to.equal('failed')
      expect(validatorWithParam(5)('failed')(6)).to.equal(null)
    })

    it('should pass multiple parameters to the function', function () {
      const validatorWithParam = validatorFromFunction((value, min, max) => value > min && value < max)
      expect(validatorWithParam(23, 42)('failed')(22)).to.equal('failed')
      expect(validatorWithParam(23, 42)('failed')(43)).to.equal('failed')
      expect(validatorWithParam(23, 42)('failed')(30)).to.equal(null)
    })
  })

  describe('combine', function () {
    it('should return the first error', function () {
      const combinedValidator = combine(
        validators.length({min: 3})('to-short'),
        validators.length({min: 5})('to-short-2')
      )

      expect(combinedValidator('a')).to.equal('to-short')
      expect(combinedValidator('abcd')).to.equal('to-short-2')
    })

    it('should return null if no validator returns an error', function () {
      const combinedValidator = combine(
        validators.length({min: 0})('to-short'),
        validators.length({min: 2})('to-short-2')
      )

      expect(combinedValidator('abcd')).to.equal(null)
    })
  })

  describe('array', function () {
    it('should apply the given validation to all elements', function () {
      const result = array({ foo: () => 'err'})([{}, {}])
      expect(result).to.be.a('array')
      expect(result).to.have.deep.property('[0].foo', 'err')
      expect(result).to.have.deep.property('[1].foo', 'err')
    })

    it('should allow to specify a minimum amount of elements', function () {
      const result = array({ foo: () => 'err'}, {min: 2})([])
      expect(result).to.be.a('array')
      expect(result).to.have.deep.property('[0].foo', 'err')
      expect(result).to.have.deep.property('[1].foo', 'err')
    })

    it('should work when the value is undefined', function () {
      const result = array({ foo: () => 'err'}, {min: 1})(undefined)
      expect(result).to.have.deep.property('[0].foo', 'err')
    })
  })
})
