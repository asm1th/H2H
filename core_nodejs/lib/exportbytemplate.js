var express = require('express');
var router = express.Router();

function makeDoc(Data) {
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

router.get('/', function (req, res, next) {
	var ids = req.query.id.split(',');
	console.log(ids);
	
	if (ids[0]) {
		var buffer;
		// var raif = {
		// 	docs: []
		// };
		
		//ids.forEach(function(i){
			// var docExtId = "df5a0424-441a-4731-eabd-19de2794671e"; ec605643-0842-5e1c-49e1-45b5008cfb42
			//var docExtId = i;
			var docExtId = JSON.stringify(ids); // '[1,"false",false]'
			console.log(docExtId);
			dataString = docExtId.replace(/]|[[]/g, '')
			console.log(dataString);
			
			var sql = "Select \"requestId\",\"docExtId\",\"status\",\"purpose\",\"docDate\",\"docNum\",\"docSum\",\"vatSum\",\"vatRate\",\"vat\" ";
			sql +=
				"\"transKind\",\"paytKind\",\"paytCode\",\"priority\",\"codeVO\",\"nodocs\",\"payerInn\",\"payerKpp\",\"payerPersonalAcc\",\"payerName\",";
			sql +=
				"\"payerBankBic\",\"payerBankCorrespAcc\",\"payerBankName\",\"payerBankBankCity\",\"payerBankSettlementType\",\"payeeInn\",\"payeeKpp\",";
			sql +=
				"\"payeePersonalAcc\",\"payeeUip\",\"payeeName\",\"payeeBankBic\",\"payeeBankCorrespAcc\",\"payeeBankName\",\"payeeBankBankCity\",\"payeeBankSettlementType\",";
			sql += "\"drawerStatus\",\"cbc\",\"okato\",\"paytReason\",\"taxPeriod\",\"depDocNo\",\"depDocDate\",\"taxPaytKind\" "
			//sql += "From \"cvPaymentOrder\" Where \"docExtId\" = '" + docExtId + "'";
			sql += "From \"cvPaymentOrder\" Where \"docExtId\" IN (" + dataString + ")";
			//IN ('Smith', 'Godfrey', 'Johnson');  
			console.log(sql);
			
			req.db.exec(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next(err);
					//print error
					res.send(err);
				}
				console.log(rows);
				//set the templateVariables
				//raif.docs.push(rows[0]);
				console.log(raif);
			});
		//});
		
		//https://docxtemplater.readthedocs.io/en/latest/tag_types.html#loops
		if ( typeof raif.docs[0] !== 'undefined' ) {
			res.set('Content-Disposition', 'attachment; filename="filename.docx"');
			res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
			buffer = makeDoc(raif);
			var fileBase64String = buffer.toString('base64');
			res.end(fileBase64String, 'base64');
		} else {
			res.send('нет данных в базе по такому docExtId');
		}

	} else {
		res.send('needed docExtId parametr in url');
	};

	//res.send('respond with a resource');
});

module.exports = router;