'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combine = combine;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var validatorFromFunction = exports.validatorFromFunction = function validatorFromFunction(validationFunction) {
  return function (params) {
    var _this = this;

    var argumentsAsArray = [].slice.apply(arguments);
    return function (message) {
      return function (value) {
        return validationFunction.apply(_this, [value].concat(_toConsumableArray(argumentsAsArray))) ? null : message;
      };
    };
  };
};

function combine(validators) {
  var _arguments = arguments;

  return function (value) {
    for (var i = 0; i < _arguments.length; i++) {
      var result = _arguments[i](value);
      if (result) {
        return result;
      }
    }

    return null;
  };
}

var exists = exports.exists = validatorFromFunction(function (value) {
  return !!value;
});

var length = exports.length = validatorFromFunction(function (string) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      min = _ref.min,
      max = _ref.max;

  if (min === undefined && max === undefined) {
    throw new Error('length requires at least one parameter!');
  }

  var hasMinLength = min !== undefined ? string.length >= min : true;
  var hasMaxLength = max !== undefined ? string.length <= max : true;
  return hasMinLength && hasMaxLength;
});

var number = exports.number = validatorFromFunction(function (value) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      minValue = _ref2.minValue,
      maxValue = _ref2.maxValue;

  var isNumber = !isNaN(value);
  var hasMinValue = minValue !== undefined ? parseInt(value) >= minValue : true;
  var hasMaxValue = maxValue !== undefined ? parseInt(value) <= maxValue : true;
  return isNumber && hasMinValue && hasMaxValue;
});

var regex = exports.regex = validatorFromFunction(function (value, pattern) {
  return value.match(pattern) !== null;
});

exports.default = {
  exists: exists,
  length: length,
  number: number,
  regex: regex
};