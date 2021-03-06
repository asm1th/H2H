/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;
//process.setMaxListeners(0);

var options = {
	//anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
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
<<<<<<< HEAD
	options = Object.assign(options, xsenv.getServices(
		{ uaa: {
			tag: "xsuaa"
			//name: "UAA-service"
		} 
	}));
	console.log("[auth service OK]");
=======
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
>>>>>>> kle1
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);