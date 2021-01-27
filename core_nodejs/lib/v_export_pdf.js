var express = require('express');
var router = express.Router();

//var fs = require("fs");
let ejs = require("ejs");
//let pdf = require("html-pdf");
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
	// let students = [{
	// 	name: "Joy",
	// 	email: "joy@example.com",
	// 	city: "New York",
	// 	country: "USA"
	// }, {
	// 	name: "John",
	// 	email: "John@example.com",
	// 	city: "San Francisco",
	// 	country: "USA"
	// }];

	//var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/vtemplate.docx'), 'binary');

	ejs.renderFile(path.resolve(__dirname, 'doctemplates/v_export_pdf_template.ejs'), {
		//students: students
		data: Data
	}, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			let options = {
				//"height": "11.25in",
				//"width": "18.5in",
				"format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
				"orientation": "landscape", // portrait or landscape
				"header": {
					"height": "38mm"
				},
				"footer": {
					"height": "20mm",
				},
			};

		// временно отключил модуль для билда - с модулем html-pdf не билдится 
		 //   pdf.create(data, options).toBuffer(function (err, buffer) {
			// 	//console.log('This is a buffer:', Buffer.isBuffer(buffer));
			// 	res.setHeader('Content-type', 'application/pdf');
			// 	res.setHeader('Content-disposition', 'attachment; filename=export-from-html.pdf');
			// 	var fileBase64String = buffer.toString('base64');
			// 	res.end(fileBase64String, 'base64');
			// });

		}
	});
};

// здесь проверить req .getHeaders найти x-test'

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
		req.db.exec(sql_stmnt, function (err, rowsHead) {
			if (err) {
				console.log(err);
				return next(err);
			}
			if (rowsHead.length > 0) {
				var Head = rowsHead[0];
				//date format
				Head.stmtDate = (Head.stmtDate) ? Head.stmtDate.replace(/-/g, ".") : "----"
				Head.beginDate = (Head.beginDate) ? Head.beginDate.replace(/-/g, ".") : "----"
				Head.endDate = (Head.endDate) ? Head.endDate.replace(/-/g, ".") : "----"
				Head.lastMovetDate = (Head.lastMovetDate) ? Head.lastMovetDate.replace(/-/g, ".") : "----"
				Head.lastStmtDate = (Head.lastStmtDate) ? Head.lastStmtDate.replace(/-/g, ".") : "----"
				
				print = Head;
				//console.log('print Head', print);
				
				req.db.exec(sql_debCred, function (err, rows) {
					if (err) {
						console.log(err);
						return next(err);
					}
					if (rows.length > 0) {
						rows.forEach(function (row) {
							// 	if (row.DC == "1") {
							// 		row.isDebit = true;
							// 	} else if (row.DC == "2") {
							// 		row.isCredit = true;
							// 	}
							//date format
							row.DOCDATE = (row.DOCDATE) ? row.DOCDATE.replace(/-/g, ".") : "----"
							row.OPERDATE = (row.OPERDATE) ? row.OPERDATE.replace(/-/g, ".") : "----"
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