/*eslint-disable */
var express = require('express');
var router = express.Router();

function getData() {
	var raif = {};
	var hdbext = require('@sap/hdbext');

	//var docExtId = $.request.parameters.get("docExtId");
	var docExtId = req.query.docExtId; // $_GET["docExtId"]
	var sql =
		"Select \"REQUESTID\",\"DOCEXTID\",\"XMLNS\",\"VERSION\",\"PURPOSE\",\"DOCDATE\",\"DOCNUM\",\"DOCSUM\",\"VATSUM\",\"VATRATE\",\"VAT\",";
	sql +=
		"\"TRANSKIND\",\"PAYTKIND\",\"PAYTCODE\",\"PRIORITY\",\"CODEVO\",\"NODOCS\",\"PAYERINN\",\"PAYERKPP\",\"PAYERPERSONALACC\",\"PAYERNAME\",";
	sql +=
		"\"PAYERBANKBIC\",\"PAYERBANKCORRESPACC\",\"PAYERBANKNAME\",\"PAYERBANKBANKCITY\",\"PAYERBANKSETTLEMENTTYPE\",\"PAYEEINN\",\"PAYEEKPP\",";
	sql +=
		"\"PAYEEPERSONALACC\",\"PAYEEUIP\",\"PAYEENAME\",\"PAYEEBANKBIC\",\"PAYEEBANKCORRESPACC\",\"PAYEEBANKNAME\",\"PAYEEBANKBANKCITY\",\"PAYEEBANKSETTLEMENTTYPE\",";
	sql += "\"DRAWERSTATUS\",\"CBC\",\"OKATO\",\"PAYTREASON\",\"TAXPERIOD\",\"DEPDOCNO\",\"DEPDOCDATE\",\"TAXPAYTKIND\" "
	sql += "From \"RaiffeisenBank.Extract\" Where \"DOCEXTID\" = " + docExtId;

	// router.get('/', function (req, res, next) {
	// 	req.db.exec(sql, function (err, rows) {
	// 		if (err) {
	// 			return next(err);
	// 		}
	// 		// res.send('Current HANA time (UTC): ' + rows[0].CURRENT_UTCTIMESTAMP);

	// 		raif.Request = {};
	// 		raif.PayDocRu = {};
	// 		raif.AccDoc = {};
	// 		raif.Payer = {};
	// 		raif.Payer.Bank = {};
	// 		raif.Payee = {};
	// 		raif.Payee.Bank = {};
	// 		raif.DepInfo = {};

	// 		raif.Request.requestId = rs.getString(1);
	// 		raif.PayDocRu.docExtId = rs.getString(2);
	// 		raif.Request.xmlns = rs.getString(3);
	// 		raif.Request.version = rs.getString(4);
	// 		raif.AccDoc.purpose = rs.getString(5);
	// 		raif.AccDoc.docDate = rs.getString(6);
	// 		raif.AccDoc.docNum = rs.getString(7);
	// 		raif.AccDoc.docSum = rs.getString(8);
	// 		raif.AccDoc.vatSum = rs.getString(9);
	// 		raif.AccDoc.vatRate = rs.getString(10);
	// 		raif.AccDoc.vat = rs.getString(11);
	// 		raif.AccDoc.transKind = rs.getString(12);
	// 		raif.AccDoc.paytKind = rs.getString(13);
	// 		raif.AccDoc.paytCode = rs.getString(14);
	// 		raif.AccDoc.priority = rs.getString(15);
	// 		raif.AccDoc.codeVO = rs.getString(16);
	// 		raif.AccDoc.nodocs = rs.getString(17);
	// 		raif.Payer.inn = rs.getString(18);
	// 		raif.Payer.kpp = rs.getString(19);
	// 		raif.Payer.personalAcc = rs.getString(20);
	// 		raif.Payer.Name = rs.getString(21);
	// 		raif.Payer.Bank.bic = rs.getString(22);
	// 		raif.Payer.Bank.correspAcc = rs.getString(23);
	// 		raif.Payer.Bank.Name = rs.getString(24);
	// 		raif.Payer.Bank.BankCity = rs.getString(25);
	// 		raif.Payer.Bank.SettlementType = rs.getString(26);
	// 		raif.Payee.inn = rs.getString(27);
	// 		raif.Payee.kpp = rs.getString(28);
	// 		raif.Payee.personalAcc = rs.getString(29);
	// 		raif.Payee.uip = rs.getString(30);
	// 		raif.Payee.Name = rs.getString(31);
	// 		raif.Payee.Bank.bic = rs.getString(32);
	// 		raif.Payee.Bank.correspAcc = rs.getString(33);
	// 		raif.Payee.Bank.Name = rs.getString(34);
	// 		raif.Payee.Bank.BankCity = rs.getString(35);
	// 		raif.Payee.Bank.SettlementType = rs.getString(36);
	// 		raif.DepInfo.rawerStatus = rs.getString(37);
	// 		raif.DepInfo.cbc = rs.getString(38);
	// 		raif.DepInfo.okato = rs.getString(39);
	// 		raif.DepInfo.paytReason = rs.getString(40);
	// 		raif.DepInfo.taxPeriod = rs.getString(41);
	// 		raif.DepInfo.docNo = rs.getString(42);
	// 		raif.DepInfo.docDate = rs.getString(43);
	// 		raif.DepInfo.taxPaytKind = rs.getString(44);
	// 	});
	// });

	var raif = {
		first_name: 'KOS444444444444',
		last_name: 'Ale444444444444',
		phone: '11111111111111',
		description: 'gazprom-neft.ru'
	};

	return raif;
};

function makeDoc(Data) {
	var PizZip = require('pizzip');
	var Docxtemplater = require('docxtemplater');

	var fs = require('fs');
	var path = require('path');

	//Load the docx file as a binary
	var content = fs.readFileSync(path.resolve(__dirname, 'doctemplates/ptemplate.docx'), 'binary');

	var zip = new PizZip(content);

	var doc = new Docxtemplater();
	doc.loadZip(zip);

	//////////////////////////////

	//set the templateVariables
	// doc.setData({
	// 	first_name: 'KOS444444444444',
	// 	last_name: 'Ale444444444444',
	// 	phone: '11111111111111',
	// 	description: 'gazprom-neft.ru'
	// });

	doc.setData(Data);

	//////////////////////////////

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
	//res.send('respond with a resource');
	//res.send(fileBase64String);

	res.set('Content-Disposition', 'attachment; filename="filename.docx"');
	res.set('Content-Type', 'vnd.openxmlformats-officedocument.wordprocessingml.document');
	var Data = getData();
	var buffer = makeDoc(Data);
	var fileBase64String = buffer.toString('base64');
	res.end(fileBase64String, 'base64');
});

module.exports = router;