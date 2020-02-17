/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
module.exports = {
	initExpress: function () {
		var xsenv = require("@sap/xsenv");
		var passport = require("passport");
		var xssec = require("@sap/xssec");
		var hdbext = require("@sap/hdbext");
		var express = require("express");

		//logging
		var logging = require("@sap/logging");
		var appContext = logging.createAppContext();

		//Initialize Express App for XS UAA and HDBEXT Middleware
		var app = express();
		
		passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa));
		//app.use(logging.expressMiddleware(appContext));
		//app.use(passport.initialize());
		var hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		
		app.use('/', hdbext.middleware(hanaOptions.hana));
		// app.use(
		// 	// passport.authenticate("JWT", {
		// 	// 	session: false
		// 	// }),
		// 	hdbext.middleware(hanaOptions.hana)
		// );
		return app;
	},

	initXSJS: function (app) {
		//	process.env.XS_APP_LOG_LEVEL='debug';
		var xsjs = require("@sap/xsjs");
		var xsenv = require("@sap/xsenv");
		var options = {
			anonymous : true, // remove to authenticate calls
			//redirectUrl: "/index.xsjs",
			redirectUrl : "/xsodata/h2h.xsodata/$metadata",
			auditLog : { logToConsole: true }
			// context: {
			// 	base: global.__base,
			// 	env: process.env,
			// 	answer: 42
			// }
		};
		
		//configure HANA
		try {
			options = Object.assign(options, xsenv.getServices({
				hana: {
					tag: "hana"
				}
			}));
			options = Object.assign(options, xsenv.getServices({
				secureStore: {
					tag: "hana"
				}
			}));
		} catch (err) {
			console.log("[WARN]", err.message);
		}

		//Add SQLCC
		// try {
		// 	options.hana.sqlcc = xsenv.getServices({
		// 		"xsjs.sqlcc_config": "CROSS_SCHEMA_LOCATIONS"
		// 	});
		// } catch (err) {
		// 	console.log("[WARN]", err.message);
		// }

		// configure UAA
		try {
			options = Object.assign(options, xsenv.getServices({
				uaa: {
					tag: "xsuaa"
				}
			}));
		} catch (err) {
			console.log("[WARN]", err.message);
		}

		// start server
		var xsjsApp = xsjs(options);
		app.use(xsjsApp);
	}
};
