"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStarted = void 0;

var _ui = require("../ui");

var _localization = _interopRequireDefault(require("../../../localization"));

var _types = _interopRequireDefault(require("./types"));

var _db = require("../../../db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getStarted = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(senderId, userForm) {
    var buttonsData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            buttonsData = {
              text: _localization["default"].__('helpYou'),
              buttons: [{
                type: "postback",
                title: _localization["default"].__('massBooking'),
                payload: "newBooking"
              }, {
                type: "postback",
                title: _localization["default"].__('editMassBooking'),
                payload: "editBooking"
              }]
            };

            if (!userForm) {
              _context.next = 9;
              break;
            }

            userForm.expectedAction = _types["default"].MAIN_MENU;
            _context.next = 5;
            return userForm.save();

          case 5:
            _context.next = 7;
            return (0, _ui.sendTemplate)(senderId, 'button', buttonsData);

          case 7:
            _context.next = 13;
            break;

          case 9:
            _context.next = 11;
            return _db.UserForm.create({
              senderId: senderId,
              expectedAction: _types["default"].MAIN_MENU
            });

          case 11:
            _context.next = 13;
            return (0, _ui.sendTemplate)(senderId, 'button', buttonsData);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getStarted(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getStarted = getStarted;