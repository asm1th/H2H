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
var sql = "Select \"REQUESTID\",\"DOCEXTID\",\"XMLNS\",\"VERSION\",\"PURPOSE\",TO_VARCHAR (TO_DATE(\"DOCDATE\"), 'DD.MM.YYYY HH:MM:SS'),\"DOCNUM\",\"DOCSUM\",\"VATSUM\",\"VATRATE\",\"VAT\",";
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
	raif.Payer.Bank.bic 			= isNull('bic',rs.getString(22),err);
	raif.Payer.Bank.correspAcc		= isNull('correspAcc',rs.getString(23),err);
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
	var digestBody = '[Платежное поручение]\n';	
	digestBody += 'Номер документа='+ raif.AccDoc.docNum + '\n';
	digestBody += 'Сумма документа, которым было сформирована данная операция=' + raif.AccDoc.docSum + '\n';
	digestBody += 'Дата документа=' + raif.AccDoc.docDate + '\n';
	digestBody += 'Сумма НДС=' + raif.AccDoc.vatSum + '\n';
	digestBody += 'Ставка НДС=' + raif.AccDoc.vatRate + '\n';
	digestBody += 'Способ расчета НДС=' + raif.AccDoc.vat + '\n';
	digestBody += 'Название получателя=' + raif.Payee.Name + '\n';
	digestBody += 'Счет получателя=' + raif.Payee.personalAcc + '\n';
	digestBody += 'ИНН получателя=' + raif.Payee.inn + '\n';
	digestBody += 'Банк получателя=' + 	raif.Payee.Bank.Name + '\n';
	digestBody += 'БИК банка получателя=' + raif.Payee.Bank.bic + '\n';
	digestBody += 'Кор. счет банка получателя=' + raif.Payee.Bank.correspAcc + '\n';
	digestBody += 'Населенный пункт банка получателя=' + raif.Payee.Bank.BankCity + '\n';
	digestBody += 'Тип населенного пункта банка получателя=' + raif.Payee.Bank.SettlementType + '\n';
	digestBody += 'КПП получателя (103)=' + raif.Payee.kpp + '\n';
	digestBody += 'Уникальный идентификатор платежа=\n';
	digestBody += 'Название плательщика=' + raif.Payer.Name + '\n';
	digestBody += 'ИНН плательщика=' + raif.Payer.inn + '\n';
	digestBody += 'Банк плательщика=' + raif.Payer.Bank.Name + '\n';
	digestBody += 'БИК банка плательщика=' + raif.Payer.Bank.bic + '\n';
	digestBody += 'Кор. счет банка плательщика=' + raif.Payer.Bank.correspAcc + '\n';
	digestBody += 'Населенный пункт банка плательщика=' + raif.Payer.Bank.BankCity + '\n';
	digestBody += 'Тип населенного пункта банка плательщика=' + raif.Payer.Bank.SettlementType + '\n';
	digestBody += 'Счет плательщика=' + raif.Payer.personalAcc + '\n';
	digestBody += 'КПП плательщика (102)=' + raif.Payer.kpp + '\n';
	digestBody += 'Неотложность=\n';
	digestBody += 'Срочность=\n';
	digestBody += 'Срочные платежи=\n';
	digestBody += 'Назначение платежа=' + raif.AccDoc.purpose + '\n';
	digestBody += 'Вид платежа=\n';
	digestBody += 'Код вида платежа=\n';
	digestBody += 'Вид операции=' + raif.AccDoc.transKind + '\n';
	digestBody += 'КБК=\n';
	digestBody += 'ОКАТО=\n';
	digestBody += 'Основание платежа=\n';
	digestBody += 'Очередность платежа=' + raif.AccDoc.priority + '\n';
	digestBody += 'Код вида валютной операции=\n';
	digestBody += 'Документы не требуются (0 - нет, 1 - да)=' + raif.AccDoc.nodocs + '\n';
	digestBody += 'Налоговый период (день)=\n';
	digestBody += 'Налоговый период (месяц)=\n';
	digestBody += 'Налоговый период (год)=\n';
	digestBody += 'Дата налогового документа (день)=\n';
	digestBody += 'Дата налогового документа (месяц)=\n';
	digestBody += 'Дата налогового документа (год)=\n';
	digestBody += 'Тип налогового платежа=\n';
	digestBody += 'Номер налогового документа=\n';
	digestBody += 'Номер паспорта сделки=\n';
}


$.response.status = $.net.http.OK;
$.response.contentType = "text/plain";
$.response.setBody(digestBody);




