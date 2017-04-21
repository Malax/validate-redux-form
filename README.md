# validate-redux-form
[![Build Status](https://travis-ci.org/Malax/validate-redux-form.svg?branch=master)](https://travis-ci.org/Malax/validate-redux-form)
:warning: **This library is under heavy in development! Please, don't use it yet.**

Small helper library to write declarative validations for [redux-form](https://github.com/erikras/redux-form) forms.
It is designed to be used with redux-form and might not be very well suited to be 
used without it. If you need a more generic solution to validate javascript objects,
take a look at [validate.js](https://github.com/ansman/validate.js).

## TOC
* [Quick Start](#quick-start)
* [Built-In Validators](#built-in-validators)
* [Combining Validators](#combining-validators)
* [Writing custom validators](#writing-custom-validators)

## Quick Start
If you just want to dive right in, take a look at some examples. They probably contain
 all the information you need to use this library.

```javascript
import { validate, validators } from 'validate-redux-form'

validate(dataFromReduxForm, {
  episodeNumber: validators.number()('Must be a number!'),
  description: validators.length({min: 1, max: 50})('Length must be between 1 and 50!'),
  details: {
    nestedProperty: validators.exists()('Required!'),
    anotherNestedProperty: validators.exists()('Required!')
  },
  users: validators.array({
    name: validators.length({min: 1})('You must give a name!'),
    age: validators.number({min: 1, max: 100})('Must be a valid age!')
  })
})
```

If you pass in an empty object as the first parameter to `validate` you would get the following
result.

```javascript
const result = {
  episodeNumber: 'Must be a number!',
  description: 'Length must be between 1 and 50!',
  details: {
    nestedProperty: 'Required!',
    anotherNestedProperty: 'Required!'
  },
  // Empty as there where no entries in the given data. You can also instruct the `array` validator
  // to expect a minimum amount of elements. See the validator documentation for more info.
  users: []
}
```

Let's take a look at another example where we actually pass some data into `validate` and see how it behaves.

```javascript
const input = {
  episodeNumber: '23',
  description: 'foo',
  users: [
    {age: '11'},
    {name: 'Luke Skywalker', age: '42'},
    {name: 'Darth Vader'},
  ]
}

// ...call validate as in the first example

const result = {
  details: {
    nestedProperty: 'Required!',
    anotherNestedProperty: 'Required!'
  },
  users: [
    { name: 'You must give a name!' },
    {}, // Empty, as the second entry validated perfectly fine
    { age: 'Must be a valid age!' }
  ]
}
```

All the results are 100% compatible with redux-form and should work as you expect them to work. If not, feel free to open an issue or submit a pull-request.

## Validators
*validate-redux-form* ships with some basic validators that are commonly used in form validation 
scenarios. However, for more complex problems like e-mail or telephone number validation, I decided to ship 
*validate-redux-form* without validators for those cases and instead make it easy to plug-in other libraries
to take care of that. This allows you to make your own trade-offs for these complex problems and keeps this library small.

### Writing custom validators
Validators are pretty simple. They are just functions of `any` that either return an error string 
or `null` when the validation succeeded. In the previous examples, you saw higher order functions that
created the actual validation functions for you with custom error messages and parameters.

To make it easy to implement your own, *validate-redux-form* ships with the `validatorFromFunction` function. 
It takes another function `any => boolean` and returns the validator functions for you.
 
```javascript
import { validatorFromFunction } from 'validate-redux-form'
const random = validatorFromFunction(value => Math.random() < 0.5)

// It can then be used like any other built-in validator
const validationSpec = {
  fieldName: random()('Bad luck, it failed this time.')
}
```

If your custom validator takes parameters, they will be passed to your function as arguments right after the value to validate. You
can have any many parameters as you like.

```javascript
const random = validatorFromFunction((value, chanceToFail) => Math.random() < chanceToFail)
const validationSpec = {
  fieldName: random(.05)('1 out of 20 chance to fail!')
}
```

### Combining Validators
In some cases, you might want to have two (or more) validators for a field. *validate-redux-form* provides you with
`combine()` that does exactly that.

```javascript
import { combine } from 'validate-redux-form'
const validationSpec = {
  field: combine(validator1()('error 1'), validator2()('error 2'))
}
```

## Built-In Validators
 
### equals
Checks for strict equality of the given value to the actual value in the form. It takes the
value to compare the actual form value with as it's parameter.

:warning: **Please remember that *redux-form* keeps all field values as strings or booleans!**

```javascript
{
  movie: validators.equals('Star Wars')('This field must contain Star Wars!')
}
```

### exists
Checks if the value is not `undefined`. This validator is useful if you only want to
check if there is a value and do not care about the value itself. As most other validators
fail in the case of `undefined` anyway, so you usually don't need to `combine()` this validator
with other validators.

```javascript
{
  actor: validators.exists()('Put whatever you want in here.')
}
```

### length
Checks if the value is a string and passes the given length parameters. You can
use `min`, `max` or combine both.

```javascript
{
  actor: validators.length({min: 1, max: 10})('Judge me by my size, do you?')
}
```

### regex
Checks if the value is a string and matches the regular expression given as the validator parameter.
```javascript
{
  character: validators.regex(/^(luke|rey|leia|anakin)$/gi)('Please provide a Skywalker!')
}
```

Note: We do not actually know if Rey is a Skywalker, take this example with a grain of salt! :wink: 

### number
Checks if the value is a number string and passes the given checks. It supports `min` and `max`.

```javascript
{
  foo: validators.number({min: 0, max: 1138})('Needs to be number between 0 and 1138!')
}

// Or without any parameter
{
  foo: validators.number()('Needs to be number!')
}
```
