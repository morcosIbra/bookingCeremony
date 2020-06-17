"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18n = _interopRequireDefault(require("i18n"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_i18n["default"].configure({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
  queryParameter: 'lang',
  directory: _path["default"].join(_path["default"].join(__dirname), 'locales')
});

var _default = _i18n["default"];
exports["default"] = _default;