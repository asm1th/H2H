// https://upqqof26vorhny0l-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/download.xsjs?docExtId=%27ffef6903-90f2-a3f2-cbe1-319feb679ecd%27
var errMsg = '';
function isNull(xmlField, xmlValue, emndskjdfkfdb) {
	if (xmlValue == null) {
		switch (xmlField) {
			case 'purpose':
				errMsg += 'purpose:isNull;';		return '';		break;
			case 'docDate':
				errMsg += 'docDate:isNull;';		return '';		break;	
			case 'docNum':
				errMsg += 'docNum:isNull;'; 		return '';		break;		
			case 'docSum':
				errMsg += 'docSum:isNull;'; 		return '';		break;	
			case 'vatSum':
													return '0.00';	break;
			case 'vatRate':
													return '0.00';	break;
			case 'vat':
				// errMsg += 'vat:isNull;';
													return 'VatManualAll'; break;
			case 'transKind':
				// errMsg += 'transKind:isNull;';
													return '01';	break;
			case 'paytKind':
				// errMsg += 'paytKind:isNull;'; 
													return '0'; 	break;
			case 'priority':
				errMsg += 'priority:isNull;';		return '';		break;
			case 'nodocs':
													return '0'; 	break; 
			case 'inn':
				errMsg += 'inn:isNull;';			return '';		break;
			case 'personalAcc':
				errMsg += 'personalAcc:isNull;';	return '';		break;
			case 'Name':	
				errMsg += 'Name:isNull;';			return '';		break;
			case 'bic':	
				errMsg += 'bic:isNull;';			return '';		break;	
			case 'BankCity':	
				errMsg += 'BankCity:isNull;';		return '';		break;
			case 'SettlementType':	
				// errMsg += 'SettlementType:isNull;'; 
													return 'Г';		break;
			default:
		}
	} else {
		return xmlValue;
	}
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
var err = '';
while (rs.next()) {
	raif.Request = {};
	raif.PayDocRu = {};
	raif.AccDoc = {};
	raif.Payer = {};
	raif.Payer.Bank = {};
	raif.Payee = {};
	raif.Payee.Bank = {};
	
	raif.Request.requestId			= isNull('requestId',rs.getString(1),err);
	raif.PayDocRu.docExtId			= isNull('docExtId',rs.getString(2),err);
	raif.Request.xmlns				= isNull('xmlns',rs.getString(3),err);
	raif.Request.version			= isNull('version',rs.getString(4),err);
	raif.AccDoc.purpose 			= isNull('purpose',rs.getString(5),err);
	raif.AccDoc.docDate 			= isNull('docDate',rs.getString(6),err);
	raif.AccDoc.docNum				= isNull('docNum',rs.getString(7),err);
	raif.AccDoc.docSum				= isNull('docSum',rs.getString(8),err);
	raif.AccDoc.vatSum				= isNull('vatSum',rs.getString(9),err);
	raif.AccDoc.vatRate 			= isNull('vatRate',rs.getString(10),err);
	raif.AccDoc.vat 				= isNull('vat',rs.getString(11),err);
	raif.AccDoc.transKind			= isNull('transKind',rs.getString(12),err);
	raif.AccDoc.paytKind			= isNull('paytKind',rs.getString(13),err);
	raif.AccDoc.paytCode			= isNull('paytCode',rs.getString(14),err);
	raif.AccDoc.priority			= isNull('priority',rs.getString(15),err);
	raif.AccDoc.codeVO				= isNull('codeVO',rs.getString(16),err);
	raif.AccDoc.nodocs				= isNull('nodocs',rs.getString(17),err);
	raif.Payer.inn					= isNull('inn',rs.getString(18),err);
	raif.Payer.kpp					= isNull('kpp',rs.getString(19),err);
	raif.Payer.personalAcc			= isNull('personalAcc',rs.getString(20),err);
	raif.Payer.Name 				= isNull('Name',rs.getString(21),err);
	raif.Payer.Bank.Bic 			= isNull('Bic',rs.getString(22),err);
	raif.Payer.Bank.CorrespAcc		= isNull('CorrespAcc',rs.getString(23),err);
	raif.Payer.Bank.Name			= isNull('Name',rs.getString(24),err);
	raif.Payer.Bank.BankCity		= isNull('BankCity',rs.getString(25),err);
	raif.Payer.Bank.SettlementType	= isNull('SettlementType',rs.getString(26),err);
	raif.Payee.inn					= isNull('inn',rs.getString(27),err);
	raif.Payee.kpp					= isNull('kpp',rs.getString(28),err);
	raif.Payee.personalAcc			= isNull('personalAcc',rs.getString(29),err);
	raif.Payee.Name 				= isNull('Name',rs.getString(30),err);
	raif.Payee.Bank.bic 			= isNull('bic',rs.getString(31),err);
	raif.Payee.Bank.correspAcc		= isNull('correspAcc',rs.getString(32),err);
	raif.Payee.Bank.Name			= isNull('Name',rs.getString(33),err);
	raif.Payee.Bank.BankCity		= isNull('BankCity',rs.getString(34),err);
	raif.Payee.Bank.SettlementType	= isNull('SettlementType',rs.getString(35),err);
}
if (errMsg == '') {
	

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

// <?xml version="1.0" encoding="utf-8"?>
// <Request xmlns="http://bssys.com/upg/request" requestId="00505680-4cfa-1ed9-bcaf-1a48313fd85d" version="0.1">
//     <PayDocRu docExtId="00505680-4cfa-1ed9-bcaf-0f8f6a1e3823">
//         <AccDoc docDate="2019-10-18" docNum="2946" docSum="33700000.00" paytKind="0" priority="5" purpose="Предоплата по дог. ГПН-18/39000/03564/Р/64537-2018-174 от 29.12.2018 по сч 19-685 от 14.10.2019 по отгр. по РФ в 3 декаде октября 2019г. В т.ч.НДС(20%) 5.616.666,67=" transKind="01" vatSum="0.00" vatRate="0.00" vat="VatManualAll" nodocs="1"/>
//         <Payer inn="5504036333" kpp="997250001" personalAcc="40702810800001400002">
//             <Name>ПАО ГАЗПРОМ НЕФТЬ</Name>
//             <Bank bic="044525700" correspAcc="30101810200000000700">
//                 <Name>АО &quot;РАЙФФАЙЗЕНБАНК&quot;</Name>
//                 <BankCity>МОСКВА</BankCity>
//                 <SettlementType>Г</SettlementType>
//             </Bank>
//             <Filial>5</Filial>
//         </Payer>
//         <Payee inn="7707017509" kpp="997250001" personalAcc="40702810000000011692" uip="">
//             <Name>ПАО &quot;НГК &quot;Славнефть&quot;</Name>
//             <Bank bic="044525823" correspAcc="30101810200000000823">
//                 <Name>БАНК ГПБ (АО)</Name>
//                 <BankCity>МОСКВА</BankCity>
//                 <SettlementType>Г</SettlementType>
//             </Bank>
//         </Payee>
//     </PayDocRu>
//     <Signs>
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
// </Request>

$.response.status = $.net.http.OK;
$.response.contentType = "application/xml";
$.response.setBody(xml);

}else{
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(errMsg);
}
// $.response.setBody(sql);