/*eslint-disable */
var express = require('express');
var router = express.Router();

var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/ptemplate.docx'), 'binary');

var zip = new PizZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
	first_name: 'KOS444444444444',
	last_name: 'Ale444444444444',
	phone: '11111111111111',
	description: 'gazprom-neft.ru'
});

try {
	// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
	doc.render()
} catch (error) {
	// The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
	function replaceErrors(key, value) {
		if (value instanceof Error) {
			return Object.getOwnPropertyNames(value).reduce(function (error, key) {
				error[key] = value[key];
				return error;
			}, {});
		}
		return value;
	}
	console.log(JSON.stringify({
		error: error
	}, replaceErrors));

	if (error.properties && error.properties.errors instanceof Array) {
		const errorMessages = error.properties.errors.map(function (error) {
			return error.properties.explanation;
		}).join("\n");
		console.log('errorMessages', errorMessages);
		// errorMessages is a humanly readable message looking like this :
		// 'The tag beginning with "foobar" is unopened'
	}
	throw error;
}

var buf = doc.getZip().generate({
	type: 'nodebuffer'
});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
//fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);

router.get('/', function (req, res, next) {
	//res.send('respond with a resource');
		//res.send(fileBase64String);

		res.set('Content-Disposition', 'attachment; filename="filename.docx"');
		res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
		var fileBase64String = buf.toString('base64'); 
		res.end(fileBase64String, 'base64');
});

module.exports = router;




