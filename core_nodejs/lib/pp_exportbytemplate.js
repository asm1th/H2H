var express = require('express');
var router = express.Router();

function makeDocPdf(Data, debcred) {
	var PizZip = require('pizzip');
	var Docxtemplater = require('docxtemplater');

	var fs = require('fs');
	var path = require('path');

	//Load the docx file as a binary
	if (debcred == "Deb" || debcred == "Cred" ) {
		var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/ptemplate_debcred.docx'), 'binary');
	} else {
		var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/ptemplate.docx'), 'binary');
	}
	var zip = new PizZip(content);

	var doc = new Docxtemplater();
	doc.loadZip(zip);

	//console.log(Data);
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
	// var docExtId = "df5a0424-441a-4731-eabd-19de2794671e"; ec605643-0842-5e1c-49e1-45b5008cfb42
	// https://host-to-host.cfapps.eu10.hana.ondemand.com/node/exportbytemplate?docExtIds=01b00858-57c0-81ac-6f69-1a2f94e20d86,89625293-3a4f-8437-75e5-079f8003c5e3
	// var ids = req.body.docExtIds.split(","); //post
	var ids = req.query.docExtIds.split(","); //get
	var type = req.query.type; // DOC / PDF
	var debcred = req.query.debcred; // Cred / Deb

	if (ids.length > 0) {
		var idString = '';
		ids.forEach(function (id) {
			idString += "'" + id + "',";
		});
		idString = idString.substring(0, idString.length - 1);
		
		if (debcred == "Cred") {
			var sql = 'Select * From "RaiffeisenBank.StatementItemsCred" Where "extId" IN (' + idString + ')';
		} else if (debcred == "Deb") {
			var sql = 'Select * From "RaiffeisenBank.StatementItemsDeb" Where "extId" IN (' + idString + ')';
		} else {
			var sql = 'Select * From "cvPaymentOrder" Where "docExtId" IN (' + idString + ')';
		}
		//var sql = 'Select "DOCEXTID","PURPOSE" From "RaiffeisenBank.TAccDoc" Where "DOCEXTID" IN (' + idString + ')';

		req.db.exec(sql, function (err, rows) {
			if (err) {
				console.log(err);
				return next(err);
				//print error
				//res.send(err);
			}
			
			if (rows.length > 0) {
				rows.forEach(function (row, i) {
					rows[i].docSumPropis = _getDocSumPropis(row.docSum);
					//console.log('docSumPropis ',rows.docSumPropis);
				})
	
				//set the templateVariables
				var docs = {
					docs: rows
				}
				//console.log('docs ',  docs);
	
				//res.send(rows);
				//res.json(rows);
	
				// dummie
				// var docs = {
				// 	"docs": [{/payerName: "docs"}, {payerName: "docs2"}]
				// }
	
				// EXPORT DOC =================================== 
				// https://docxtemplater.readthedocs.io/en/latest/tag_types.html#loops
				
				if (type == "DOC") {
					var buffer = makeDocPdf(docs, debcred);
					res.set('Content-Disposition', 'attachment; filename="PaymentOrder.docx"');
					res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
					var fileBase64String = buffer.toString('base64');
					res.end(fileBase64String, 'base64');
				} else {
					//res.send('Type error (DOC-PDF)');
					var buffer = makeDocPdf(docs, debcred);
					
				    res.set('Content-Disposition', 'attachment; filename="PaymentOrder.pdf"');
					res.set('Content-Type', 'application/pdf');
					var fileBase64String = buffer.toString('base64');
					res.end(fileBase64String, 'base64');
				}
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