var express = require('express');
var router = express.Router();

function makeDocPdf(Data) {
	var PizZip = require('pizzip');
	var Docxtemplater = require('docxtemplater');

	var fs = require('fs');
	var path = require('path');

	//Load the docx file as a binary
	var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/ptemplate1.docx'), 'binary');

	var zip = new PizZip(content);

	var doc = new Docxtemplater();
	doc.loadZip(zip);

	console.log(Data);
	doc.setData(Data);

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
	return buf;
};
// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
//fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);

function _getDocSumPropis(Data) {
	var numberToWordsRu = require('number-to-words-ru');
	numberToWordsRu.convert(Data, {
		currency: 'rub',
		convertMinusSignToWord: true,
		showNumberParts: {
			integer: true,
			fractional: true,
		},
		convertNumbertToWords: {
			integer: true,
			fractional: false,
		},
		showCurrency: {
			integer: true,
			fractional: true,
		},
	});
};

router.get('/', function (req, res, next) {
	// var docExtId = "df5a0424-441a-4731-eabd-19de2794671e"; ec605643-0842-5e1c-49e1-45b5008cfb42
	// https://host-to-host.cfapps.eu10.hana.ondemand.com/node/exportbytemplate?docExtIds=01b00858-57c0-81ac-6f69-1a2f94e20d86,89625293-3a4f-8437-75e5-079f8003c5e3
	// var ids = req.body.docExtIds.split(","); //post
	var ids = req.query.docExtIds.split(","); //get
	//var type = req.query.type; // DOC \ PDF

	if (ids[0]) {
		var idString = '';
		ids.forEach(function (id) {
			idString += "'" + id + "',";
		});
		idString = idString.substring(0, idString.length - 1);
		var sql = 'Select * From "cvPaymentOrder" Where "docExtId" IN (' + idString + ')';
		//var sql = 'Select "DOCEXTID","PURPOSE" From "RaiffeisenBank.TAccDoc" Where "DOCEXTID" IN (' + idString + ')';

		req.db.exec(sql, function (err, rows) {
			if (err) {
				console.log(err);
				return next(err);
				//print error
				//res.send(err);
			}

			rows.forEach(function (row, i) {
				rows.docSumPropis = _getDocSumPropis(row.docSum);
			})

			//set the templateVariables
			var docs = {
				docs: rows
			}

			//res.send(rows);
			//res.json(rows);

			// dummie
			// var docs = {
			// 	"docs": [{/payerName: "docs"}, {payerName: "docs2"}]
			// }

			// EXPORT DOC =================================== 
			// https://docxtemplater.readthedocs.io/en/latest/tag_types.html#loops
			
			res.set('Content-Disposition', 'attachment; filename="download.docx"');
			res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
			var buffer = makeDocPdf(docs);
			var fileBase64String = buffer.toString('base64');
			res.end(fileBase64String, 'base64');
		});
	} else {
		res.send('needed docExtId parametr in url');
	};

	//res.send('respond with a resource');
});

module.exports = router;