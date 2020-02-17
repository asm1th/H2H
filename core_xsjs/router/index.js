"use strict";

module.exports = function(app, server){
	app.use("/node", require("./routes/nodeRoute")());
	
	// test file
	var test = require('./routes/test');
	app.use('/test', test);
	
	// PDF docx generate
	var exportfile = require('./routes/exportfile');
	app.use('/exportfile', exportfile);
	
	// export docx pdf from template
	var exportBYtemplate = require('./routes/exportBYtemplate');
	app.use('/exportBYtemplate', exportBYtemplate);
};