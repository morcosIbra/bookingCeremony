"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendAction = exports.sendTemplate = void 0;

var _axios = require("../../axios");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sendTemplate = function sendTemplate(recipientId, type, data) {
  return _axios.axiosMessenger.post('', {
    recipient: {
      id: recipientId
    },
    message: {
      "attachment": {
        "type": "template",
        "payload": _objectSpread({
          "template_type": type
        }, data)
      }
    }
  });
};

exports.sendTemplate = sendTemplate;

var sendAction = function sendAction(recipientId, type) {
  return _axios.axiosMessenger.post('', {
    recipient: {
      id: recipientId
    },
    "sender_action": type
  });
};

exports.sendAction = sendAction;