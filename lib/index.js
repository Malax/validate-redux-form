'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validators = undefined;
exports.validate = validate;

var _lodash = require('lodash.pairs');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.frompairs');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isfunction');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.isobject');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.isempty');

var _lodash10 = _interopRequireDefault(_lodash9);

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var validators = exports.validators = _validators2.default;

function validate(data, validationSpec) {
  var pairs = (0, _lodash2.default)(validationSpec);

  var errorPairs = pairs.reduce(function (acc, pair) {
    var key = pair[0];
    var value = pair[1];

    if ((0, _lodash6.default)(value)) {
      var validationResult = value(data[key]);
      if (!validationResult) {
        return acc;
      } else {
        return [].concat(_toConsumableArray(acc), [[key, validationResult]]);
      }
    }

    if ((0, _lodash8.default)(value)) {
      var _validationResult = validate(data[key] || {}, value);

      if ((0, _lodash10.default)(_validationResult)) {
        return acc;
      } else {
        return [].concat(_toConsumableArray(acc), [[key, _validationResult]]);
      }
    }

    return acc;
  }, []);

  return (0, _lodash4.default)(errorPairs);
}