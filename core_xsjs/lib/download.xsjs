// https://upqqof26vorhny0l-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/download.xsjs?docExtId=%2706296e2b-6b0e-5759-683a-eb5d7b214989%27
var errMessage = [];
var xml = '';
function addValue(xmlField, xmlValue, xmlTag) {
	if (xmlValue != null && xmlValue != "" && xmlValue != undefined ) {
		if (xmlTag) {
			xml += '<' + xmlField + '>' + xmlValue + '</' + xmlField +'>';
		} else {
			
		}
	}
	return '';
}

var docExtId = $.request.parameters.get("docExtId");
var conn = $.db.getConnection();
var sql = "Select \"REQUESTID\",\"DOCEXTID\",\"XMLNS\",\"VERSION\",\"PURPOSE\",\"DOCDATE\",\"DOCNUM\",\"DOCSUM\",\"VATSUM\",\"VATRATE\",\"VAT\",";
sql += "\"TRANSKIND\",\"PAYTKIND\",\"PAYTCODE\",\"PRIORITY\",\"CODEVO\",\"NODOCS\",\"PAYERINN\",\"PAYERKPP\",\"PAYERPERSONALACC\",\"PAYERNAME\",";
sql += "\"PAYERBANKBIC\",\"PAYERBANKCORRESPACC\",\"PAYERBANKNAME\",\"PAYERBANKBANKCITY\",\"PAYERBANKSETTLEMENTTYPE\",\"PAYEEINN\",\"PAYEEKPP\",";
sql += "\"PAYEEPERSONALACC\",\"PAYEENAME\",\"PAYEEBANKBIC\",\"PAYEEBANKCORRESPACC\",\"PAYEEBANKNAME\",\"PAYEEBANKBANKCITY\",\"PAYEEBANKSETTLEMENTTYPE\" ";
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
	
	raif.Request.requestId			= rs.getString(1);
	raif.PayDocRu.docExtId			= rs.getString(2);
	raif.Request.xmlns				= rs.getString(3);
	raif.Request.version			= rs.getString(4);
	raif.AccDoc.purpose 			= rs.getString(5);
	raif.AccDoc.docDate 			= rs.getString(6);
	raif.AccDoc.docNum				= rs.getString(7);
	raif.AccDoc.docSum				= rs.getString(8);
	raif.AccDoc.vatSum				= rs.getString(9);
	raif.AccDoc.vatRate 			= rs.getString(10);
	raif.AccDoc.vat 				= rs.getString(11);
	raif.AccDoc.transKind			= rs.getString(12);
	raif.AccDoc.paytKind			= rs.getString(13);
	raif.AccDoc.paytCode			= rs.getString(14);
	raif.AccDoc.priority			= rs.getString(15);
	raif.AccDoc.codeVO				= rs.getString(16);
	raif.AccDoc.nodocs				= rs.getString(17);
	raif.Payer.inn					= rs.getString(18);
	raif.Payer.kpp					= rs.getString(19);
	raif.Payer.personalAcc			= rs.getString(20);
	raif.Payer.Name 				= rs.getString(21);
	raif.Payer.Bank.Bic 			= rs.getString(22);
	raif.Payer.Bank.CorrespAcc		= rs.getString(23);
	raif.Payer.Bank.Name			= rs.getString(24);
	raif.Payer.Bank.BankCity		= rs.getString(25);
	raif.Payer.Bank.SettlementType	= rs.getString(26);
	raif.Payee.inn					= rs.getString(27);
	raif.Payee.kpp					= rs.getString(28);
	raif.Payee.personalAcc			= rs.getString(29);
	raif.Payee.Name 				= rs.getString(30);
	raif.Payee.Bank.bic 			= rs.getString(31);
	raif.Payee.Bank.correspAcc		= rs.getString(32);
	raif.Payee.Bank.Name			= rs.getString(33);
	raif.Payee.Bank.BankCity		= rs.getString(34);
	raif.Payee.Bank.SettlementType	= rs.getString(35);
}
if (errMessage.length == 0) {
	

var xml = '<?xml version="1.0" encoding="utf-8"?>';

xml += '<Request xmlns="http://bssys.com/upg/request" requestId="' + raif.Request.requestId + '" version="0.1">';
xml += '<PayDocRu docExtId="' + raif.PayDocRu.docExtId + '">';
	xml += '<AccDoc ';
		xml += 'docDate="'		+ raif.AccDoc.docDate		+ '" ';
		xml += 'docNum="'		+ raif.AccDoc.docNum		+ '" ';
		xml += 'docSum="'		+ raif.AccDoc.docSum		+ '" ';
		xml += 'paytKind="' 	+ raif.AccDoc.paytKind		+ '" ';
		xml += 'priority="' 	+ raif.AccDoc.priority		+ '" ';
		xml += 'purpose="'		+ raif.AccDoc.purpose		+ '" ';
		xml += 'transKind="'	+ raif.AccDoc.transKind 	+ '" ';
		xml += 'vatSum="'		+ raif.AccDoc.vatSum		+ '" ';
		xml += 'vatRate="'		+ raif.AccDoc.vatRate		+ '" ';
		xml += 'vat="'			+ raif.AccDoc.vat			+ '" ';
		xml += 'nodocs="'		+ raif.AccDoc.nodocs		+ '"';
	xml += '/>';
	xml += '<Payer ';
		xml += 'inn="'			+ raif.Payer.inn			+ '" ';
		xml += 'kpp="'			+ raif.Payer.kpp			+ '" ';
		xml += 'personalAcc="'	+ raif.Payer.personalAcc	+ '" ';
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
	xml += '</Payer>';
	xml += '<Payee ';
		xml += 'inn="'			+ raif.Payee.inn			+ '" ';
		xml += 'kpp="'			+ raif.Payee.kpp			+ '" ';
		xml += 'personalAcc="'	+ raif.Payee.personalAcc	+ '" ';
		xml += '>';
		xml += '<Name>' + raif.Payee.Name + '</Name>';
		xml += '<Bank '; 
			xml += 'bic="' + raif.Payee.Bank.bic + '" ';
			xml += 'correspAcc="' + raif.Payee.Bank.correspAcc + '"';
			xml += '>';
			xml += '<Name>' + raif.Payee.Bank.Name + '</Name>';
			xml += '<BankCity>' + raif.Payee.Bank.BankCity + '</BankCity>';
			xml += '<SettlementType>' + raif.Payee.Bank.SettlementType + '</SettlementType>';
		xml += '</Bank>';
	xml += '</Payee>';
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
	var encodedString = String.fromCharCode.apply(null,array),
		decodedString = decodeURIComponent(escape(encodedString));
	Sign.Value = decodedString;
	Sign.Issuer = rs.getString(4);
	Sign.SignType = rs.getString(7);
	signs.push(Sign);
}	

if(signs.length > 0){
	xml += '<Signs>';
		signs.forEach(function(sign, i){ 
			addValue('SN',		sign.SN,		true);
			addValue('Value',	sign.Value,		true);
			addValue('Issuer',	sign.Issuer,	true);
			addValue('SignType',sign.SignType,	true);
		} );
	xml += '</Signs>';
}
// <Signs>
//         <Sign>
//             <SN>D1D9D00DAAA33B643E6FDBE088495B6</SN>
//             <Value>MIIDuAYJKoZIhvcNAQcCoIIDqTCCA6UCAQExDjAMBggqhQMHAQECAgUAMAsGCSqGSIb3DQEHATGCA4EwggN9AgEBMIIBKDCCARIxGDAWBgUqhQNkARINMTAyNzczOTMyNjQ0OTEaMBgGCCqFAwOBAwEBEgwwMDc3NDQwMDAzMDIxCzAJBgNVBAYTAlJVMRwwGgYDVQQIDBM3NyDQsy4g0JzQvtGB0LrQstCwMRUwEwYDVQQHDAzQnNC+0YHQutCy0LAxLzAtBgNVBAkMJtGD0LsuINCi0YDQvtC40YbQutCw0Y8g0LQuMTcg0YHRgtGALiAxMQ8wDQYDVQQLDAbQntCY0JExLDAqBgNVBAoMI9CQ0J4gItCg0LDQudGE0YTQsNC50LfQtdC90LHQsNC90LoiMSgwJgYDVQQDDB9SYWlmZmVpc2VuYmFuayBHT1NUIDIwMTIgU3ViIENBAhANHZ0A2qoztkPm/b4IhJW2MAwGCCqFAwcBAQICBQCgggHsMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE5MTAxODA3MjcyM1owLwYJKoZIhvcNAQkEMSIEINUuuGD/e1uZ1wzX16BM5oROWuqGXvNaSuoV7wwoysmPMIIBfwYLKoZIhvcNAQkQAi8xggFuMIIBajCCAWYwggFiMAoGCCqFAwcBAQICBCABEWBC6shQp1s0qDXhzVLBfzylG4WYpr3XWZD2pGAolTCCATAwggEapIIBFjCCARIxGDAWBgUqhQNkARINMTAyNzczOTMyNjQ0OTEaMBgGCCqFAwOBAwEBEgwwMDc3NDQwMDAzMDIxCzAJBgNVBAYTAlJVMRwwGgYDVQQIDBM3NyDQsy4g0JzQvtGB0LrQstCwMRUwEwYDVQQHDAzQnNC+0YHQutCy0LAxLzAtBgNVBAkMJtGD0LsuINCi0YDQvtC40YbQutCw0Y8g0LQuMTcg0YHRgtGALiAxMQ8wDQYDVQQLDAbQntCY0JExLDAqBgNVBAoMI9CQ0J4gItCg0LDQudGE0YTQsNC50LfQtdC90LHQsNC90LoiMSgwJgYDVQQDDB9SYWlmZmVpc2VuYmFuayBHT1NUIDIwMTIgU3ViIENBAhANHZ0A2qoztkPm/b4IhJW2MAwGCCqFAwcBAQEBBQAEQPhwOw/jkQbLsZE+gzv0FiSvwJBbbdW27OQFh/Dw7TeZxSQSDnY+qgKT53ZkyVuEOhGlw0fv0kmKRjMA5g/WWII=</Value>
//             <Issuer>C=RU, L=Москва, O=&quot;АО \&quot;Райффайзенбанк\&quot;&quot;, CN=Raiffeisenbank GOST 2012 Sub CA</Issuer>
//             <SignType>Первая подпись</SignType>
//         </Sign>
//         <Sign>
//             <SN>1C41F200D9AACD8E4D189E9040B116C8</SN>
//             <Value>MIIDuAYJKoZIhvcNAQcCoIIDqTCCA6UCAQExDjAMBggqhQMHAQECAgUAMAsGCSqGSIb3DQEHATGCA4EwggN9AgEBMIIBKDCCARIxGDAWBgUqhQNkARINMTAyNzczOTMyNjQ0OTEaMBgGCCqFAwOBAwEBEgwwMDc3NDQwMDAzMDIxCzAJBgNVBAYTAlJVMRwwGgYDVQQIDBM3NyDQsy4g0JzQvtGB0LrQstCwMRUwEwYDVQQHDAzQnNC+0YHQutCy0LAxLzAtBgNVBAkMJtGD0LsuINCi0YDQvtC40YbQutCw0Y8g0LQuMTcg0YHRgtGALiAxMQ8wDQYDVQQLDAbQntCY0JExLDAqBgNVBAoMI9CQ0J4gItCg0LDQudGE0YTQsNC50LfQtdC90LHQsNC90LoiMSgwJgYDVQQDDB9SYWlmZmVpc2VuYmFuayBHT1NUIDIwMTIgU3ViIENBAhAcQfIA2arNjk0YnpBAsRbIMAwGCCqFAwcBAQICBQCgggHsMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE5MTAxODA3MjczNVowLwYJKoZIhvcNAQkEMSIEINUuuGD/e1uZ1wzX16BM5oROWuqGXvNaSuoV7wwoysmPMIIBfwYLKoZIhvcNAQkQAi8xggFuMIIBajCCAWYwggFiMAoGCCqFAwcBAQICBCAFHsw7hqm35i6HBWTvlshB+VkSKSnfeCbXkbf1xAJJjjCCATAwggEapIIBFjCCARIxGDAWBgUqhQNkARINMTAyNzczOTMyNjQ0OTEaMBgGCCqFAwOBAwEBEgwwMDc3NDQwMDAzMDIxCzAJBgNVBAYTAlJVMRwwGgYDVQQIDBM3NyDQsy4g0JzQvtGB0LrQstCwMRUwEwYDVQQHDAzQnNC+0YHQutCy0LAxLzAtBgNVBAkMJtGD0LsuINCi0YDQvtC40YbQutCw0Y8g0LQuMTcg0YHRgtGALiAxMQ8wDQYDVQQLDAbQntCY0JExLDAqBgNVBAoMI9CQ0J4gItCg0LDQudGE0YTQsNC50LfQtdC90LHQsNC90LoiMSgwJgYDVQQDDB9SYWlmZmVpc2VuYmFuayBHT1NUIDIwMTIgU3ViIENBAhAcQfIA2arNjk0YnpBAsRbIMAwGCCqFAwcBAQEBBQAEQIN+3ZnkS4gFaTShlN3bwahWlDeAkcM28X/7UwUrAeE3LV7HHjQG3ASKk2WBAONNrjMyESwykdRQMBb7onj/1sU=</Value>
//             <Issuer>C=RU, L=Москва, O=&quot;АО \&quot;Райффайзенбанк\&quot;&quot;, CN=Raiffeisenbank GOST 2012 Sub CA</Issuer>
//             <SignType>Вторая подпись</SignType>
//         </Sign>
//     </Signs>

xml += '</Request>';

$.response.status = $.net.http.OK;
$.response.contentType = "application/xml";
$.response.setBody(xml);

}else{
	// $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	// $.response.setBody(errMsg);
}