// import createError from 'http-errors';
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import routes from './routes/index';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routes(app)



// if (process.env.NODE_ENV == 'production') {
// Serve any static files
console.log(process.env.NODE_ENV);
app.use(express.static(path.join(__dirname, '/../client/build')));

// Handle React routing, return all requests to React app
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
  // res.send('response scess')
});
// }

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   // next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
// });

// export default app;
module.exports = app;
