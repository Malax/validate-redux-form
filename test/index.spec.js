import { expect } from 'chai'
import { validate } from '../src/index'

describe('validate-redux-form', function () {
  describe('validate', function () {
    it('should be a function', function () {
      expect(validate).to.be.a('function')
    })

    it('should return an object', function () {
      expect(validate({}, {})).to.be.an('object')
    })

    it('should work with a flat object', function () {
      const validation = { foo: (value) => 'error' }
      expect(validate({}, validation)).to.have.property('foo', 'error')
    })

    it('should work with a nested object', function () {
      const validation = {
        foo: (value) => 'error',
        bar: {
          baz: (value) => 'errorbaz'
        }
      }

      const result = validate({}, validation)
      expect(result).to.have.property('foo', 'error')
      expect(result).to.have.deep.property('bar.baz', 'errorbaz')
    })

    it('should omit properties that yield no errors', function () {
      const validation = {
        foo: (value) => null
      }

      expect(validate({}, validation)).to.not.have.property('foo')
    })

    it('should omit nesed objects that contain no errors', function () {
      const validation = {
        foo: {
          bar: (value) => null,
          baz: (value) => null
        }
      }

      expect(validate({}, validation)).to.not.have.property('foo')
    })

    it('should work with deeply nested objects', function () {
      const validation = {
        foo: {
          bar: {
            baz: {
              qoo: {
                quu: {
                  test: (value) => 'failed'
                }
              }
            }
          }
        }
      }

      expect(validate({}, validation)).to.have.deep.property('foo.bar.baz.qoo.quu.test', 'failed')
    })

    it('should work with validators that return arrays', function () {
      const validation = {
        foo: (value) => [{bar: 'baz'}, {bar: 'baz'}, {bar: 'baz'}]
      }

      expect(validate({}, validation)).to.deep.equal({foo: [{bar: 'baz'}, {bar: 'baz'}, {bar: 'baz'}]})
    })
  })
})
