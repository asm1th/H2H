/*eslint no-console: 0*/
"use strict";

const https = require("https");
const port = process.env.PORT || 3100;
const server = require("http").createServer();
const express = require("express");

const path = require('path');

// BD
const xsenv = require('@sap/xsenv');
const passport = require("passport");
const xssec = require("@sap/xssec");
const hdbext = require('@sap/hdbext');

xsenv.loadEnv();

https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";
global.__uaa = process.env.UAA_SERVICE_NAME;

//logging
let logging = require("@sap/logging");
let appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

//Build a JWT Strategy from the bound UAA resource
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));

//Add XS Logging to Express
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));

//Add Passport JWT processing
app.use(passport.initialize());

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
//hanaOptions.hana.pooling = true;

//Add Passport for Authentication via JWT + HANA DB connection as Middleware in Expess
app.use(
	'/',
	hdbext.middleware(hanaOptions.hana),
	passport.authenticate("JWT", {
		session: false
	})
);
//old code
//app.use('/', hdbext.middleware(services.hana));

// USE???
//Setup Additional Node.js Routes
//require("./router")(app, server);

// test addres - get database connection
app.get('/node', function (req, res, next) {
	req.db.exec('SELECT CURRENT_UTCTIMESTAMP FROM DUMMY', function (err, rows) {
		if (err) {
			return next(err);
		}
		res.send('Current HANA time (UTC): ' + rows[0].CURRENT_UTCTIMESTAMP);
	});
});


//process.setMaxListeners(0);
app.listen(port, function () {
	console.log('myapp listening on port ' + port);
});


// //Setup Additional Node.js Routes
// require("./router")(app, server);

// //Start the Server
// server.on("request", app);
// server.listen(port, function () {
// 	console.info(`HTTP Server: ${server.address().port}`);
// });





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

app.use('/node/pp_exportbytemplate', require('./lib/pp_exportbytemplate'));
app.use('/node/v_exportbytemplate', require('./lib/v_exportbytemplate'));
app.use('/node/vpp_exportbytemplate', require('./lib/vpp_exportbytemplate'));
app.use('/node/v_export_pdf', require('./lib/v_export_pdf'));

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


