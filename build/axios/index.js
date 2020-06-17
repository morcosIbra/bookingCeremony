"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axiosMessenger = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosMessenger = _axios["default"].create({
  baseURL: "https://graph.facebook.com/v2.6/me/messages"
});

exports.axiosMessenger = axiosMessenger;
axiosMessenger.interceptors.request.use(function (config) {
  config.params = {
    access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  };
  return config;
});