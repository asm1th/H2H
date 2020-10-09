/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
// nodejs + xsjs in one service
// "use strict";
// var https = require("https");
// var xsenv = require("@sap/xsenv");
// var port = process.env.PORT || 3000;
// var server = require("http").createServer();

// https.globalAgent.options.ca = xsenv.loadCertificates();

// global.__base = __dirname + "/";
// var init = require(global.__base + "utils/init");

// //Initialize Express App for XSA UAA and HDBEXT Middleware
// var app = init.initExpress();

// //Setup Routes
// var router = require("./router")(app, server);

// //Initialize the XSJS Compatibility Layer
// init.initXSJS(app);

// //Start the Server
// server.on("request", app);

// server.listen(port, function () {
// 	console.info("HTTP Server: " + server.address().port);
// });

// =================
// only xsjs in service \ nodejs separate

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;
//process.setMaxListeners(0);

var options = {
	//anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
	// redirectUrl : "/index.xsjs"
	redirectUrl : "/xsodata/h2h.xsodata/$metadata"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices(
		{ uaa: {
			tag: "xsuaa"
			//name: "UAA-service"
		} 
	}));
	console.log("[auth service OK]");
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);