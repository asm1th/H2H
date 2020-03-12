var express = require('express');
var router = express.Router();

function makeDocPdf(Data) {
	var PizZip = require('pizzip');
	var Docxtemplater = require('docxtemplater');

	var fs = require('fs');
	var path = require('path');

	//Load the docx file as a binary
	var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/vtemplate.docx'), 'binary');

	var zip = new PizZip(content);

	var doc = new Docxtemplater();
	doc.loadZip(zip);

	//console.log(Data);
	doc.setData(Data);

	try {
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
	const converted = numberToWordsRu.convert(Data, {
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
	return converted;
};

router.get('/', function (req, res, next) {
	// var responseId = "f6197de1-8c6a-e165-8370-22714fa32d66,6c0fc4e3-b305-b801-3bec-5ac501fac6f1"
	// https://host-to-host.cfapps.eu10.hana.ondemand.com/node/exportbytemplate?docExtIds=01b00858-57c0-81ac-6f69-1a2f94e20d86,89625293-3a4f-8437-75e5-079f8003c5e3
	// var ids = req.body.docExtIds.split(","); //post
	var ids = req.query.responseIds.split(","); //get
	var type = req.query.type; // DOC / PDF

	if (ids.length > 0) {
		var idString = '';
		ids.forEach(function (id) {
			idString += "'" + id + "',";
		});
		idString = idString.substring(0, idString.length - 1);
		var sql_stmnt = 'Select * From "cvStatement" Where "responseId" IN (' + idString + ')';
		var sql_debCred = 'Select * From "RaiffeisenBank.TStatementItems" Where "RESPONSEID" IN (' + idString + ')';
		
		//var sqlPPCred = 'Select * From "RaiffeisenBank.StatementItemsCred" Where "extId" IN (' + idString + ')';
		//var sqlPPDeb = 'Select * From "RaiffeisenBank.StatementItemsDeb" Where "extId" IN (' + idString + ')';
		
		var print = {};
		req.db.exec(sql_stmnt, function (err, rows) {
			if (err) {
				console.log(err);
				return next(err);
			}
			if (rows.length > 0) {
				print = rows[0];
				//console.log('print ', print);
				
				req.db.exec(sql_debCred, function (err, rows) {
					if (err) {console.log(err);return next(err);}
					if (rows.length > 0) {
						rows.forEach(function (row) {
							if (row.DC == "1") {
								row.isDebit = true;
							} else if (row.DC == "2") {
								row.isCredit = true;
							} 
						});
						print.docs = rows;
						console.log('print all ', print);
					}
					if (type == "DOC") {
						var buffer = makeDocPdf(print);
						
						res.set('Content-Disposition', 'attachment; filename="Statement.docx"');
						res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
						var fileBase64String = buffer.toString('base64');
						res.end(fileBase64String, 'base64');
					}
				});
			} else {
				res.send('Нет данных в БД');
			}
		});
	} else {
		res.send('needed docExtId parametr in url');
	};

	//res.send('respond with a resource');
});

module.exports = router;