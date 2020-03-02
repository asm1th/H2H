/*eslint no-console: 0*/
"use strict";

var express = require('express');
var path = require('path');
var app = express();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// BD
var xsenv = require('@sap/xsenv');
var services = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

// TRACER
// var logging = require('@sap/logging');
// var appContext = logging.createAppContext();

// simple app start
// app.get('/', function (req, res) {
//   res.send('Using HANA ' + services.hana.host + ':' + services.hana.port);
// });

//automatic conect to HANA hdbext.middleware
// hdbext.middleware will connect to SAP HANA automatically on each access to the specified path ( /) in this case. Afterwards the connection is available in req.db. This is the client object of the hdbInformation published on non-SAP site driver. The connection is closed automatically at the end of the request.
var hdbext = require('@sap/hdbext');
app.use('/', hdbext.middleware(services.hana));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/node', function (req, res, next) {
	req.db.exec('SELECT CURRENT_UTCTIMESTAMP FROM DUMMY', function (err, rows) {
		if (err) {
			return next(err);
		}
		res.send('111 Current HANA time (UTC): ' + rows[0].CURRENT_UTCTIMESTAMP);
	});
});

// ============= POST method route example
// app.post('/', function (req, res) {
//   res.send('POST request to the homepage');
// });
// =============

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('myapp listening on port ' + port);
});

// НАСТРОЙКА АВОРИЗАЦИИ ТУТ ================
// https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/1c16bb3a51b247c796064b215c01823d.html

// настройка node.js
var bodyParser = require('body-parser');	// body-parser: -- анализирует часть тела входящего запроса HTTP и облегчает извлечение из него различных частей. Например, мы можно читать POST-параметры.
var logger = require('morgan'); 			// средство логгирования запросов HTTP для node.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// ========================== TEST
// test file
var test = require('./lib/test');
app.use('/node/test', test);

// ========================== PDF docx
var exportfile = require('./lib/exportfile');
app.use('/node/exportfile', exportfile);

var exportbytemplate = require('./lib/exportbytemplate');
app.use('/node/exportbytemplate', exportbytemplate);

// ========================== 
// LAST SECTION IN FILE errors not found - должна находиться только в конце файла
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});


