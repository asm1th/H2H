/*eslint no-console: 0*/
"use strict";

const express = require('express');
const passport = require('passport');
const {JWTStrategy} = require('@sap/xssec');
const path = require('path');
const xsenv = require('@sap/xsenv');

var cookieParser = require('cookie-parser')
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true })

// Init app
const app = express();

app.use(cookieParser())

// Load Credentiols
xsenv.loadEnv();

// Public endpoint
app.get('/', csrfProtection, function (req, res) {
	//res.send('Hello');
	res.render('send', { csrfToken: req.csrfToken() })
});


// logging
var logging = require('@sap/logging');
var appContext = logging.createAppContext();
//Add XS Logging to Express
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));

// Init passport
passport.use(new JWTStrategy(xsenv.getServices({xsuaa: {tag: "xsuaa"}}).xsuaa));
app.use(passport.initialize());
//app.use(passport.authenticate("JWT", {session: false}));

// app.get('/user', function (req, res) {
// 	//res.json(req.user);
// 	res.send(req.user);
// });
// app.get('/checkScope', function (req, res) {
// 	res.send(req.authInfo.checkScope(req.headers.scope));
// });

// BD
var services = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});


// automatic conect to HANA hdbext.middleware
// hdbext.middleware will connect to SAP HANA automatically on each access to the specified path ( /) in this case. Afterwards the connection is available in req.db. This is the client object of the hdbInformation published on non-SAP site driver. The connection is closed automatically at the end of the request.
var hdbext = require('@sap/hdbext');
//app.use('/', hdbext.middleware(services.hana));
services.hana.pooling = true;
//Add Passport for Authentication via JWT + HANA DB connection as Middleware in Expess
app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	hdbext.middleware(services.hana)
);

// Protected endpoint
app.get('/node', function (req, res, next) {
	req.db.exec('SELECT CURRENT_UTCTIMESTAMP FROM DUMMY', function (err, rows) {
		if (err) {
			return next(err);
		}
		res.send('Current HANA time (UTC): ' + rows[0].CURRENT_UTCTIMESTAMP);
	});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	//console.log('myapp listening on port ' + port);
});

var bodyParser = require('body-parser');	// body-parser: -- анализирует часть тела входящего запроса HTTP и облегчает извлечение из него различных частей. Например, мы можно читать POST-параметры.
//var logger = require('morgan');			// средство логгирования запросов HTTP для node.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// ========================== TEST
// test file
app.use('/node/test', require('./lib/test'));

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
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json(err.message);
});