// https://upqqof26vorhny0l-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/download.xsjs?docExtId=%2706296e2b-6b0e-5759-683a-eb5d7b214989%27

$.import("xsjs", "dbf");
var dbf = $.xsjs.dbf;

var errMessage = [];
var xml = '';

function addValue(xmlField, xmlValue, xmlTag) {
	if (xmlValue != null && xmlValue != "" && xmlValue != undefined) {
		if (xmlTag) {
			xml += '<' + xmlField + '>' + xmlValue + '</' + xmlField + '>';
		} else {
			xml += xmlField + '="' + xmlValue + '" ';
		}
	}
	return '';
}

// function getSettlementType(conn, bic) {
// 	var pStmt = conn.prepareStatement("Select \"FILIAL\" From \"H2H.BicInformation\" Where \"BIC\" = '" + bic + "'");
// 	rs = null;
// 	rs = pStmt.executeQuery();
// 	while (rs.next()) {
// 		return rs.getInt(1).toString();
// 	}
// 	pStmt.close();
// }

// function historyAdd(conn, docExtId, action, status, description){
// 	var now = new Date();
// 	sql = 'INSERT INTO "RaiffeisenBank.THistory" (DOCEXTID,TIMESTAMP,ACTION,STATUS,DESCRIPTION) VALUES(?,?,?,?,?)';
// 	var pStmt = conn.prepareStatement(sql);
// 	pStmt.setString(1,docExtId);
// 	pStmt.setTimestamp(2,now);
// 	pStmt.setString(3,action);
// 	pStmt.setString(4,status);
// 	pStmt.setString(5,description);
// 	pStmt.execute();
// 	conn.commit();
// 	pStmt.close();
// }

var docExtId = $.request.parameters.get("docExtId");
var conn = $.db.getConnection();
var sql = "Select \"REQUESTID\",\"DOCEXTID\",\"XMLNS\",\"VERSION\",\"PURPOSE\",\"DOCDATE\",\"DOCNUM\",\"DOCSUM\",\"VATSUM\",\"VATRATE\",\"VAT\",";
sql += "\"TRANSKIND\",\"PAYTKIND\",\"PAYTCODE\",\"PRIORITY\",\"CODEVO\",\"NODOCS\",\"PAYERINN\",\"PAYERKPP\",\"PAYERPERSONALACC\",\"PAYERNAME\",";
sql += "\"PAYERBANKBIC\",\"PAYERBANKCORRESPACC\",\"PAYERBANKNAME\",\"PAYERBANKBANKCITY\",\"PAYERBANKSETTLEMENTTYPE\",\"PAYEEINN\",\"PAYEEKPP\",";
sql += "\"PAYEEPERSONALACC\",\"PAYEEUIP\",\"PAYEENAME\",\"PAYEEBANKBIC\",\"PAYEEBANKCORRESPACC\",\"PAYEEBANKNAME\",\"PAYEEBANKBANKCITY\",\"PAYEEBANKSETTLEMENTTYPE\",";
sql += "\"DRAWERSTATUS\",\"CBC\",\"OKATO\",\"PAYTREASON\",\"TAXPERIOD\",\"DEPDOCNO\",\"DEPDOCDATE\",\"TAXPAYTKIND\" "
sql += "From \"RaiffeisenBank.Extract\" Where \"DOCEXTID\" = " + docExtId;

var pStmt = conn.prepareStatement(sql);
var rs = null;
rs = pStmt.executeQuery();
var raif = {};
while (rs.next()) {
	raif.Request = {};
	raif.PayDocRu = {};
	raif.AccDoc = {};
	raif.Payer = {};
	raif.Payer.Bank = {};
	raif.Payee = {};
	raif.Payee.Bank = {};
	raif.DepInfo = {};

	raif.Request.requestId = rs.getString(1);
	raif.PayDocRu.docExtId = rs.getString(2);
	raif.Request.xmlns = rs.getString(3);
	raif.Request.version = rs.getString(4);
	raif.AccDoc.purpose = rs.getString(5);
	raif.AccDoc.docDate = rs.getString(6);
	raif.AccDoc.docNum = rs.getString(7);
	raif.AccDoc.docSum = rs.getString(8);
	raif.AccDoc.vatSum = rs.getString(9);
	raif.AccDoc.vatRate = rs.getString(10);
	raif.AccDoc.vat = rs.getString(11);
	raif.AccDoc.transKind = rs.getString(12);
	raif.AccDoc.paytKind = rs.getString(13);
	raif.AccDoc.paytCode = rs.getString(14);
	raif.AccDoc.priority = rs.getString(15);
	raif.AccDoc.codeVO = rs.getString(16);
	raif.AccDoc.nodocs = rs.getString(17);
	raif.Payer.inn = rs.getString(18);
	raif.Payer.kpp = rs.getString(19);
	raif.Payer.personalAcc = rs.getString(20);
	raif.Payer.Name = rs.getString(21);
	raif.Payer.Bank.bic = rs.getString(22);
	raif.Payer.Bank.correspAcc = rs.getString(23);
	raif.Payer.Bank.Name = rs.getString(24);
	raif.Payer.Bank.BankCity = rs.getString(25);
	raif.Payer.Bank.SettlementType = rs.getString(26);
	raif.Payee.inn = rs.getString(27);
	raif.Payee.kpp = rs.getString(28);
	raif.Payee.personalAcc = rs.getString(29);
	raif.Payee.uip = rs.getString(30);
	raif.Payee.Name = rs.getString(31);
	raif.Payee.Bank.bic = rs.getString(32);
	raif.Payee.Bank.correspAcc = rs.getString(33);
	raif.Payee.Bank.Name = rs.getString(34);
	raif.Payee.Bank.BankCity = rs.getString(35);
	raif.Payee.Bank.SettlementType = rs.getString(36);
	raif.DepInfo.rawerStatus = rs.getString(37);
	raif.DepInfo.cbc = rs.getString(38);
	raif.DepInfo.okato = rs.getString(39);
	raif.DepInfo.paytReason = rs.getString(40);
	raif.DepInfo.taxPeriod = rs.getString(41);
	raif.DepInfo.docNo = rs.getString(42);
	raif.DepInfo.docDate = rs.getString(43);
	raif.DepInfo.taxPaytKind = rs.getString(44);
}
if (errMessage.length == 0) {

	var xml = '<?xml version="1.0" encoding="utf-8"?>';

	xml += '<Request xmlns="http://bssys.com/upg/request" requestId="' + raif.Request.requestId + '" version="0.1">';
	xml += '<PayDocRu docExtId="' + raif.PayDocRu.docExtId + '">';
	xml += '<AccDoc ';
	xml += 'docDate="' + raif.AccDoc.docDate + '" ';
	xml += 'docNum="' + raif.AccDoc.docNum + '" ';
	xml += 'docSum="' + raif.AccDoc.docSum + '" ';
	xml += 'paytKind="' + raif.AccDoc.paytKind + '" ';
	xml += 'priority="' + raif.AccDoc.priority + '" ';
	xml += 'purpose="' + raif.AccDoc.purpose + '" ';
	xml += 'transKind="' + raif.AccDoc.transKind + '" ';
	xml += 'vatSum="' + raif.AccDoc.vatSum + '" ';
	xml += 'vatRate="' + raif.AccDoc.vatRate + '" ';
	xml += 'vat="' + raif.AccDoc.vat + '" ';
	xml += 'nodocs="' + raif.AccDoc.nodocs + '"';
	xml += '/>';
	xml += '<Payer ';
	xml += 'inn="' + raif.Payer.inn + '" ';
	xml += 'kpp="' + raif.Payer.kpp + '" ';
	xml += 'personalAcc="' + raif.Payer.personalAcc + '" ';
	xml += '>';
	xml += '<Name>' + raif.Payer.Name + '</Name>';
	xml += '<Bank ';
	xml += 'bic="' + raif.Payer.Bank.bic + '" ';
	xml += 'correspAcc="' + raif.Payer.Bank.correspAcc + '"';
	xml += '>';
	xml += '<Name>' + raif.Payer.Bank.Name + '</Name>';
	xml += '<BankCity>' + raif.Payer.Bank.BankCity + '</BankCity>';
	xml += '<SettlementType>' + raif.Payer.Bank.SettlementType + '</SettlementType>';
	xml += '</Bank>';
	addValue('Filial', dbf.getSettlementType(conn, raif.Payer.Bank.bic), true);
	xml += '</Payer>';
	xml += '<Payee ';
	addValue('inn', raif.Payee.inn, false);
	addValue('kpp', raif.Payee.kpp, false);
	addValue('personalAcc', raif.Payee.personalAcc, false);
	addValue('uip', raif.Payee.uip, false);
	xml += '>';
	xml += '<Name>' + raif.Payee.Name + '</Name>';
	xml += '<Bank ';
	xml += 'bic="' + raif.Payee.Bank.bic + '" ';
	// xml += 'correspAcc="' + raif.Payee.Bank.correspAcc + '"';
	addValue('correspAcc', raif.Payee.Bank.correspAcc, false);
	xml += '>';
	xml += '<Name>' + raif.Payee.Bank.Name + '</Name>';
	xml += '<BankCity>' + raif.Payee.Bank.BankCity + '</BankCity>';
	xml += '<SettlementType>' + raif.Payee.Bank.SettlementType + '</SettlementType>';
	xml += '</Bank>';
	xml += '</Payee>';

	if (raif.DepInfo.rawerStatus != undefined && raif.DepInfo.cbc != undefined) {
		xml += '<DepartmentalInfo ';
		xml += 'drawerStatus="' + raif.DepInfo.rawerStatus + '" ';
		xml += 'cbc="' + raif.DepInfo.cbc + '" ';
		xml += 'okato="' + raif.DepInfo.okato + '" ';
		xml += 'paytReason="' + raif.DepInfo.paytReason + '" ';
		xml += 'taxPeriod="' + raif.DepInfo.taxPeriod + '" ';
		xml += 'docNo="' + raif.DepInfo.docNo + '" ';
		xml += 'docDate="' + raif.DepInfo.docDate + '"';
		xml += '/>'
	}

	xml += '</PayDocRu>';

	pStmt.close();

	// var conn = $.db.getConnection();
	sql = "Select \"DOCEXTID\",\"SN\",\"VALUE\",\"ISSUER\",\"DIGESTNAME\",\"DIGESTVERSION\",\"SIGNTYPE\",\"FIO\",\"POSITION\"";
	sql += "From \"RaiffeisenBank.TSign\" Where \"DOCEXTID\" = " + docExtId;
	pStmt = conn.prepareStatement(sql);
	rs = null;
	rs = pStmt.executeQuery();
	var signs = [];
	while (rs.next()) {
		var Sign = {};
		Sign.SN = rs.getString(2);
		var array = new Uint8Array(rs.getBlob(3));
		var encodedString = String.fromCharCode.apply(null, array),
			decodedString = decodeURIComponent(escape(encodedString));
		Sign.Value = decodedString;
		Sign.Issuer = rs.getString(4);
		Sign.SignType = rs.getString(7);
		signs.push(Sign);
	}
	pStmt.close();

	if (signs.length > 0) {
		xml += '<Signs>';
		signs.forEach(function (sign, i) {
			xml += '<Sign>'
			addValue('SN', sign.SN, true);
			addValue('Value', sign.Value, true);
			addValue('Issuer', sign.Issuer, true);
			addValue('SignType', sign.SignType, true);
			xml += '</Sign>'
		});

		xml += '</Signs>';
	}

	xml += '</Request>';

	var request = $.require('request');
	var jsb64 = $.require('nodejs-base64');

	username = "sb-73118041-35ca-43e2-b768-70b63e1055d4!b31593|it-rt-h2hin!b16077";
	password = "ox2aALqZ9HWZuG9YZ02GRfnlTLk=";
	url = "https://h2hin.it-cpi001-rt.cfapps.eu10.hana.ondemand.com/http/TestService";
	auth = 'Basic ' + jsb64.base64encode(username + ':' + password);

	var data = {
		"file": jsb64.base64encode(xml),
		"fileType": "application/xml",
		"fileUID": raif.PayDocRu.docExtId,
	};

	var formData = {
		file: {
			value: jsb64.base64encode(xml),
			options: {
				filename: raif.PayDocRu.docExtId + '.xml',
				contentType: 'application/xml'
			}
		}
	};

	var options = {
		method: 'POST',
		body: data,
		json: true,
		uri: url,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': auth,
			'docExtId': docExtId
		}
	};

	request(options, function (error, response, body) {
		console.log('body : ', body);
	});
	
		pStmt = conn.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"=" + docExtId);
    	pStmt.setInt(1, 5); //Отправлен
    	pStmt.execute();
    	conn.commit();
    	pStmt.close();
 
    	docExtId = docExtId.replace(new RegExp("'",'g'),"");
    	dbf.historyAdd(conn, docExtId, 'Отправлен', 'SUCCESS', 'Отправлен в банк');

	$.response.status = $.net.http.OK;
	$.response.contentType = "application/xml";
	$.response.setBody(xml);

} else {
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(errMsg);
}