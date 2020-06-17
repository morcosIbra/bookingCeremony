"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UserForm", {
  enumerable: true,
  get: function get() {
    return _userForm["default"];
  }
});
Object.defineProperty(exports, "connectDb", {
  enumerable: true,
  get: function get() {
    return _config["default"];
  }
});

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userForm = _interopRequireDefault(require("./models/userForm"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }