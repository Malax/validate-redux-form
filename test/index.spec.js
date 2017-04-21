import { expect } from 'chai'
import { validate, validators } from '../src/index'

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

  it('should omit nested objects that contain no errors', function () {
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

  it('should work with embedded arrays', function () {
    const validation = {
      members: [{
        firstName: validators.length({min: 1})('Enter a first name'),
        lastName: validators.length({min: 1})('Enter a last name')
      }]
    }

    const formData = {
      members: [
        { firstName: 'first', lastName: 'last' },
        { firstName: 'first', lastName: '' }
      ]
    }

    expect(validate(formData, validation)).to.deep.equal({
      members: [
        {},
        { lastName: 'Enter a last name' }
      ]
    })
  })

  it('should warn if the validation spec has an unsupported value', function () {
    expect(() => validate({}, {foo: 1138})).to.throw('Unsupported validator 1138')
  })
})
