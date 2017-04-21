import { expect } from 'chai'
import { validators } from '../src/index'

describe('validators', function () {
  const ERROR_STRING = '0xDEADBEEF'

  describe('number', function () {
    it('should work without any parameters', function () {
      expect(validators.number()(ERROR_STRING)('23')).to.equal(null)
      expect(validators.number()(ERROR_STRING)('asd')).to.equal(ERROR_STRING)
    })

    it('should work with a min number of zero', function () {
      expect(validators.number({min: 0})(ERROR_STRING)('23')).to.equal(null)
      expect(validators.number({min: 0})(ERROR_STRING)('-23')).to.equal(ERROR_STRING)
    })

    it('should work with a max number of zero', function () {
      expect(validators.number({max: 0})(ERROR_STRING)('23')).to.equal(ERROR_STRING)
      expect(validators.number({max: 0})(ERROR_STRING)('-23')).to.equal(null)
    })

    it('should work with a max and min number', function () {
      expect(validators.number({min: 0, max: 12})(ERROR_STRING)('23')).to.equal(ERROR_STRING)
      expect(validators.number({min: 0, max: 12})(ERROR_STRING)('-23')).to.equal(ERROR_STRING)
      expect(validators.number({min: 0, max: 12})(ERROR_STRING)('11')).to.equal(null)
    })

    it('should report an error for an undefined value', function () {
      expect(validators.number({min: 0, max: 12})(ERROR_STRING)(undefined)).to.equal(ERROR_STRING)
    })
  })

  describe('length', function () {
    it('should throw an exception when used without a parameter', function () {
      expect(() => validators.length()(ERROR_STRING)('')).to.throw('length requires at least one parameter!')
    })

    it('should check correctly for minimum length', function () {
      expect(validators.length({min: 3})(ERROR_STRING)('foo')).to.equal(null)
      expect(validators.length({min: 3})(ERROR_STRING)('fo')).to.equal(ERROR_STRING)
    })

    it('should check correctly for maximum length', function () {
      expect(validators.length({max: 3})(ERROR_STRING)('foobar')).to.equal(ERROR_STRING)
      expect(validators.length({max: 3})(ERROR_STRING)('foo')).to.equal(null)
    })

    it('should report an error for an undefined value', function () {
      expect(validators.length({max: 3})(ERROR_STRING)(undefined)).to.equal(ERROR_STRING)
    })
  })

  describe('exists', function () {
    it('should return the error if the value is undefined', function () {
      expect(validators.exists()(ERROR_STRING)(undefined)).to.equal(ERROR_STRING)
    })

    it('should return null if the value is defined', function () {
      expect(validators.exists()(ERROR_STRING)('something')).to.equal(null)
    })
  })

  describe('regex', function () {
    it('should return the error if the regex does not match the value', function () {
      expect(validators.regex(/[a-z]{3}/)(ERROR_STRING)('ab1')).to.equal(ERROR_STRING)
    })

    it('should return null if the regex does match the value', function () {
      expect(validators.regex(/[a-z]{3}/)(ERROR_STRING)('abz')).to.equal(null)
    })

    it('should report an error for an undefined value', function () {
      expect(validators.regex(/[a-z]{3}/)(ERROR_STRING)(undefined)).to.equal(ERROR_STRING)
    })
  })

  describe('equals', function () {
    it('should work with booleans', function () {
      expect(validators.equals(true)(ERROR_STRING)(false)).to.equal(ERROR_STRING)
      expect(validators.equals(true)(ERROR_STRING)(true)).to.equal(null)
    })

    it('should work with strings', function () {
      expect(validators.equals('star wars')(ERROR_STRING)('star trek')).to.equal(ERROR_STRING)
      expect(validators.equals('star wars')(ERROR_STRING)('star wars')).to.equal(null)
    })

    it('should strictly compare values', function () {
      expect(validators.equals(true)(ERROR_STRING)('true')).to.equal(ERROR_STRING)
      expect(validators.equals(23)(ERROR_STRING)('23')).to.equal(ERROR_STRING)
    })

    it('should work when the value is undefined', function () {
      expect(validators.equals(true)(ERROR_STRING)(undefined)).to.equal(ERROR_STRING)
    })
  })
})
