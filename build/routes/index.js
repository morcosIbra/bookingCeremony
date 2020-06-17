"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _messenger = _interopRequireDefault(require("./messenger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = function routes(app) {
  app.use('/messenger', _messenger["default"]);
};

var _default = routes;
exports["default"] = _default;