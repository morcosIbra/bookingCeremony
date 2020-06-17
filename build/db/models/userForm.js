"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = _interopRequireDefault(require("../../controllers/messenger/actions/types"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _localization = _interopRequireDefault(require("../../localization"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var schema = new Schema({
  senderId: {
    type: String,
    unique: [true, 'duplicated ids senderid'],
    required: [true, _localization["default"].__('senderIdRequired')]
  },
  expectedAction: {
    type: String,
    "enum": {
      values: Object.values(_types["default"]),
      message: _localization["default"].__('inValidAction')
    },
    required: [true, _localization["default"].__('inValidAction')]
  },
  form: {
    nationalId: {
      type: String,
      trim: true,
      validate: {
        validator: function validator(value) {
          // only numbers and length=15
          value = value.trim();
          return /^[0-9]*$/.test(value) && value.length === 15;
        },
        message: function message() {
          return _localization["default"].__('inValidNationalId');
        }
      }
    },
    fullName: {
      type: String,
      trim: true,
      validate: {
        validator: function validator(value) {
          // check fullname has arabic letters and white spaces only
          // and min. three names
          value = value.trim();
          return /^[\u0621-\u064A ]+$/.test(value) && value.match(/[ ]/).length >= 3;
        },
        message: function message() {
          return _localization["default"].__('inValidFullname');
        }
      }
    },
    mobile: {
      type: String,
      trim: true,
      validate: {
        validator: function validator(value) {
          // starts with 0 and only numbers and length=11
          value = value.trim();
          return /^[0]/.test(value) && /^[0-9]*$/.test(value) && value.length === 11;
        },
        message: function message() {
          return _localization["default"].__('inValidMobile');
        }
      }
    }
  }
}, {
  timestamps: true
});

var UserForm = _mongoose["default"].model('UserForm', schema);

var _default = UserForm;
exports["default"] = _default;