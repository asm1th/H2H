var express = require('express');
var router = express.Router();

//var fs = require("fs");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

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

function makePdf(Data, req, res, next) {
	let students = [{
		name: "Joy",
		email: "joy@example.com",
		city: "New York",
		country: "USA"
	}, {
		name: "John",
		email: "John@example.com",
		city: "San Francisco",
		country: "USA"
	}];

	//var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/vtemplate.docx'), 'binary');

	ejs.renderFile(path.resolve(__dirname, 'doctemplates/v_export_pdf_template.ejs'), {
		students: students
	}, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			let options = {
				"height": "11.25in",
				"width": "18.5in",
				"header": {
					"height": "70mm"
				},
				"footer": {
					"height": "50mm",
				},
			};
			// pdf.create(data, options).toStream((err, stream) => {
			// 	if (err) {
			// 		return res.end(err.stack);
			// 	} else {
			// 		res.setHeader('Content-type', 'application/pdf');
			// 		res.setHeader('Content-disposition', 'attachment; filename=export-from-html.pdf'); // Remove this if you don't want direct download
			// 		res.setHeader('Content-Length', '' + stream.length);
			// 		stream.pipe(res);
			// 	}
			// });

		    pdf.create(data, options).toBuffer(function (err, buffer) {
				//console.log('This is a buffer:', Buffer.isBuffer(buffer));
				res.setHeader('Content-type', 'application/pdf');
				res.setHeader('Content-disposition', 'attachment; filename=export-from-html.pdf');
				var fileBase64String = buffer.toString('base64');
				res.end(fileBase64String, 'base64');
			});

			// pdf.create(html_string).toStream((err, stream) => {
			//   if (err) return res.end(err.stack);
			//   res.setHeader('Content-type', 'application/pdf');
			//   res.setHeader('Content-disposition', 'attachment; filename=export-from-html.pdf'); // Remove this if you don't want direct download
			//   res.setHeader('Content-Length', ''+stream.length);
			//   stream.pipe(res);
			// });
		}
	});
};

router.get('/', function (req, res, next) {
	var ids = req.query.responseIds.split(","); //get

	if (ids.length > 0) {
		var idString = '';
		ids.forEach(function (id) {
			idString += "'" + id + "',";
		});
		idString = idString.substring(0, idString.length - 1);
		var sql_stmnt = 'Select * From "cvStatement" Where "responseId" IN (' + idString + ')';
		var sql_debCred = 'Select * From "RaiffeisenBank.TStatementItems" Where "RESPONSEID" IN (' + idString + ')';

		var print = {}; //data
		req.db.exec(sql_stmnt, function (err, rows) {
			if (err) {
				console.log(err);
				return next(err);
			}
			if (rows.length > 0) {
				print = rows[0];

				req.db.exec(sql_debCred, function (err, rows) {
					if (err) {
						console.log(err);
						return next(err);
					}
					if (rows.length > 0) {
						rows.forEach(function (row) {
							if (row.DC == "1") {
								row.isDebit = true;
							} else if (row.DC == "2") {
								row.isCredit = true;
							}
						});
						print.docs = rows;
						//console.log('print all ', print);
					}

					/// make file
					makePdf(print, req, res, next);

				});
			} else {
				res.send('Нет данных в БД');
			}
		});
	} else {
		res.send('needed docExtId parametr in url');
	};
});

module.exports = router;