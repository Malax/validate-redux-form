# validate-redux-form
[![Build Status](https://travis-ci.org/Malax/validate-redux-form.svg?branch=develop)](https://travis-ci.org/Malax/validate-redux-form)
[![codecov.io](https://codecov.io/gh/Malax/validate-redux-form/branch/develop/graph/badge.svg)](https://codecov.io/gh/malax/validate-redux-form)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Small helper library to write declarative validations for [redux-form](https://github.com/erikras/redux-form) forms.
It is designed to be used with redux-form and might not be very well suited to be 
used without it. If you need a more generic solution to validate javascript objects,
take a look at [validate.js](https://github.com/ansman/validate.js).

## Installation
`npm install validate-redux-form`

## Table of Contents
* [Quick Start](#quick-start)
* [Validators](#validators)
    * [Writing custom validators](#writing-custom-validators)
    * [Combining Validators](#combining-validators)
    * [Optional Validators](#optional-validators)
    * [Validating Arrays](#validating-arrays)
* [Built-In Validators](#built-in-validators)
    * [equals](#equals)
    * [exists](#exists)
    * [length](#length)
    * [regex](#regex)
    * [number](#number)

## Quick Start
If you just want to dive right in, take a look at some examples. They probably contain
 all the information you need to use this library.

```javascript
import { reduxForm } from 'redux-form'
import { validate, validators, optional } from 'validate-redux-form'

reduxForm({
  form: 'example',
  validate: (data) => {
    return validate(data, {
      episodeNumber: validators.number()('Must be a number!'),
      description: validators.length({min: 1, max: 50})('Length must be between 1 and 50!'),
      title: optional(validators.length({min: 5})('If you specify a title, is must have a minimum length of 5!')),
      details: {
        nestedProperty: validators.exists()('Required!'),
        anotherNestedProperty: validators.exists()('Required!')
      },
      users: [{
        name: validators.length({min: 1})('You must give a name!'),
        age: validators.number({min: 1, max: 100})('Must be a valid age!')
      }]
    })
  }
})(MyForm)
```

If you would pass in an empty object as the first parameter to `validate` you would get the following
result:

```javascript
{
  episodeNumber: 'Must be a number!',
  description: 'Length must be between 1 and 50!',
  // "title" is missing here, because it is optional
  details: {
    nestedProperty: 'Required!',
    anotherNestedProperty: 'Required!'
  },
  // Empty, as there where no entries in the given data. You can also force arrays to have
  // a minimum amount of elements. See 'Validating Arrays' for more info.
  users: []
}
```

Let's take a look at another example where we actually pass some data into `validate` and see how it behaves.
We use the same validation specification as in the last example.

This input:
```javascript
{
  episodeNumber: '23',
  description: 'foo',
  users: [
    {age: '11'},
    {name: 'Luke Skywalker', age: '42'},
    {name: 'Darth Vader'},
  ]
}
```

Results in: 
```javascript
{
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
It takes another function `any => boolean` and builds the validator function for you.
 
```javascript
import { validatorFromFunction } from 'validate-redux-form'
const random = validatorFromFunction(value => Math.random() < 0.5)

// It can then be used like any other built-in validator
{
  fieldName: random()('Bad luck, it failed this time.')
}
```

If your custom validator takes parameters, they will be passed to your function as arguments right after the value to validate. You
can have any many parameters as you like.

```javascript
const random = validatorFromFunction((value, chanceToFail) => Math.random() < chanceToFail)

{
  fieldName: random(.05)('1 out of 20 chance to fail!')
}
```

### Combining Validators
In some cases, you might want to have two (or more) validators for a field. *validate-redux-form* provides you with
`combine` that does exactly that.

```javascript
import { combine, validators } from 'validate-redux-form'

{
  field: combine(
    validators.number()('Must be a number'), 
    validators.length({min: 3})('Must have three digits')
  )
}
```

### Optional Validators
When you only want to validate a value if it's defined you can wrap the validator in `optional`.

```javascript
import { optional, validators } from 'validate-redux-form'

{
  field: optional(validators.number()('Error'))
}
```

### Validating Arrays
If you're having arrays in your forms, you need a way to validate their contents. To do this, just wrap another
validation inside an array. 

```javascript
{
  members: [{
    firstName: validators.length({min: 0})('Enter a first name'),
    lastName: validators.length({min: 0})('Enter a last name')
  }]
}
```

This will validate all entries with the given validation. If you need to validate that a minimum
amount of entries is present and valid, you need to use a slightly different syntax:

```javascript
import { array } from 'validate-redux-form'

{
  members: array({
    firstName: validators.length({min: 0})('Enter a first name'),
    lastName: validators.length({min: 0})('Enter a last name')
  }, 2)
}
```

## Built-In Validators
 
### equals
Checks for strict equality of the given value to the actual value in the form. It takes the
value to compare the actual form value with as it's parameter.

```javascript
{
  movie: validators.equals('Star Wars')('This field must contain Star Wars!')
}
```

:warning: **Please remember that *redux-form* keeps all field values as strings or booleans!**

### exists
Checks if the value is not `undefined`. This validator is useful if you only want to
check if there is a value and do not care about the value itself. As most other validators
fail in the case of `undefined` anyway, you usually don't need to [combine()](#combining-validators) this validator
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
