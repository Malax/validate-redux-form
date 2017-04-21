import { expect } from 'chai'
import { validatorFromFunction, combine, exists, length, number, regex, array } from '../src/validators'

describe('Validators', function () {
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
      const combinedValidator = combine(length({min: 3})('to-short'), length({min: 5})('to-short-2'))
      expect(combinedValidator('a')).to.equal('to-short')
      expect(combinedValidator('abcd')).to.equal('to-short-2')
    })

    it('should return null if no validator returns an error', function () {
      const combinedValidator = combine(length({min: 0})('to-short'), length({min: 2})('to-short-2'))
      expect(combinedValidator('abcd')).to.equal(null)
    })
  })

  describe('number', function () {
    it('should work without any parameters', function () {
      expect(number()('nan')('23')).to.equal(null)
      expect(number()('nan')('asd')).to.equal('nan')
    })

    it('should work with a min number of zero', function () {
      expect(number({minValue: 0})('nan')('23')).to.equal(null)
      expect(number({minValue: 0})('nan')('-23')).to.equal('nan')
    })

    it('should work with a max number of zero', function () {
      expect(number({maxValue: 0})('nan')('23')).to.equal('nan')
      expect(number({maxValue: 0})('nan')('-23')).to.equal(null)
    })

    it('should work with a max and min number', function () {
      expect(number({minValue: 0, maxValue: 12})('nan')('23')).to.equal('nan')
      expect(number({minValue: 0, maxValue: 12})('nan')('-23')).to.equal('nan')
      expect(number({minValue: 0, maxValue: 12})('nan')('11')).to.equal(null)
    })
  })

  describe('length', function () {
    it('should throw an exception when used without a parameter', function () {
      expect(() => length()('err')('')).to.throw('length requires at least one parameter!')
    })

    it('should check correctly for minimum length', function () {
      expect(length({min: 3})('err')('foo')).to.equal(null)
      expect(length({min: 3})('err')('fo')).to.equal('err')
    })

    it('should check correctly for maximum length', function () {
      expect(length({max: 3})('err')('foobar')).to.equal('err')
      expect(length({max: 3})('err')('foo')).to.equal(null)
    })
  })

  describe('exists', function () {
    it('should return the error if the value is undefined', function () {
      expect(exists()('error')(undefined)).to.equal('error')
    })

    it('should return null if the value is defined', function () {
      expect(exists()('error')('something')).to.equal(null)
    })
  })

  describe('regex', function () {
    it('should return the error if the regex does not match the value', function () {
      expect(regex(/[a-z]{3}/)('nomatch')('ab1')).to.equal('nomatch')
    })

    it('should return null if the regex does match the value', function () {
      expect(regex(/[a-z]{3}/)('nomatch')('abz')).to.equal(null)
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
