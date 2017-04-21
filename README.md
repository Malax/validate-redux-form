# validate-redux-form
Small helper library to write declarative validations for [redux-form](https://github.com/erikras/redux-form) forms.
It is designed to be used with redux-form and might not be very well suited to be 
used without it. If you need a more generic solution to validate javascript objects,
take a look at [validate.js](https://github.com/ansman/validate.js).

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
    {name: 'Luke Skywalker', age: 42},
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
### equals
Checks for strict equality of the given value to the actual value in the form.
### exists
Checks if the value is not undefined. This validator is useful if you only want to
check if there is a value and do not care about the value itself. Most other validators
fail in the case of undefined anyway, so you don't need to `combine()` this validator
with others all the time.
## length
Checks if the value is a string and passes the given length parameters. You can
use `min`, `max` or combine both.
## regex
Checks if the value is a string and matches the given regular expression.
## number
Checks if the value is a number and passes the given checks. You can use 
`min`, `max` or both.
