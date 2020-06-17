"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.communicate = exports.verify = void 0;

var _actions = require("./actions");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var verify = function verify(req, res) {
  if (req.query['hub.verify_token'] === process.env.MESSENGER_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
};

exports.verify = verify;

var communicate = function communicate(req, res, next) {
  //checking for page subscription.
  if (req.body.object === 'page') {
    req.body.entry.forEach(function (entry) {
      // Iterate over each messaging event
      entry.messaging.forEach( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
          var _event$message, _event$postback;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return (0, _actions.takeAction)(event.sender.id, ((_event$message = event.message) === null || _event$message === void 0 ? void 0 : _event$message.text) || ((_event$postback = event.postback) === null || _event$postback === void 0 ? void 0 : _event$postback.payload));

                case 3:
                  _context.next = 8;
                  break;

                case 5:
                  _context.prev = 5;
                  _context.t0 = _context["catch"](0);
                  console.log('error= ', _context.t0);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 5]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    });
    res.sendStatus(200);
  }
};

exports.communicate = communicate;