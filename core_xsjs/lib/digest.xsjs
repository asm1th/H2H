$.import("xsjs", "dbf");
var xml2js = $.require('xml2js');
var dbf = $.xsjs.dbf;

var errMsg = '';
var docExtId = $.request.parameters.get("docExtId");
var conn = $.db.getConnection();
var sql = "Select \"REQUESTID\",\"DOCEXTID\",\"XMLNS\",\"VERSION\",\"PURPOSE\",TO_VARCHAR (TO_DATE(\"DOCDATE\"), 'DD.MM.YYYY'),\"DOCNUM\",\"DOCSUM\",\"VATSUM\",\"VATRATE\",\"VAT\",";
sql += "\"TRANSKIND\",\"PAYTKIND\",\"PAYTCODE\",\"PRIORITY\",\"CODEVO\",\"NODOCS\",\"PAYERINN\",\"PAYERKPP\",\"PAYERPERSONALACC\",\"PAYERNAME\",";
sql += "\"PAYERBANKBIC\",\"PAYERBANKCORRESPACC\",\"PAYERBANKNAME\",\"PAYERBANKBANKCITY\",\"PAYERBANKSETTLEMENTTYPE\",\"PAYEEINN\",\"PAYEEKPP\",";
sql += "\"PAYEEPERSONALACC\",\"PAYEEUIP\",\"PAYEENAME\",\"PAYEEBANKBIC\",\"PAYEEBANKCORRESPACC\",\"PAYEEBANKNAME\",\"PAYEEBANKBANKCITY\",\"PAYEEBANKSETTLEMENTTYPE\",";
sql += "\"CBC\",\"OKATO\",\"PAYTREASON\",\"TAXPERIOD\",\"DEPDOCNO\",\"DEPDOCDATE\",\"TAXPAYTKIND\" ";

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
	raif.DepInfo = {};
	
	raif.Request.requestId			= rs.getString(1);
	raif.PayDocRu.docExtId			= rs.getString(2);
	raif.Request.xmlns				= rs.getString(3);
	raif.Request.version			= rs.getString(4);
	raif.AccDoc.purpose 			= rs.getString(5);
	raif.AccDoc.docDate 			= rs.getString(6) + ' 00:00:00';
	raif.AccDoc.docNum				= rs.getString(7);
	raif.AccDoc.docSum				= rs.getString(8); 
	if (raif.AccDoc.docSum != "") {
		raif.AccDoc.docSum = raif.AccDoc.docSum.replace(".00", "");
	}
	raif.AccDoc.vatSum				= rs.getString(9);
	if (raif.AccDoc.vatSum != "") {
		raif.AccDoc.vatSum = raif.AccDoc.vatSum.replace(".00", "");
	}
	raif.AccDoc.vatRate 			= rs.getString(10);
	if (raif.AccDoc.vatRate != "") {
		raif.AccDoc.vatRate = raif.AccDoc.vatRate.replace(".00", "");
	}
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
	raif.Payer.Bank.bic 			= rs.getString(22);
	raif.Payer.Bank.correspAcc		= rs.getString(23);
	raif.Payer.Bank.Name			= rs.getString(24);
	raif.Payer.Bank.BankCity		= rs.getString(25);
	raif.Payer.Bank.SettlementType	= rs.getString(26);
	raif.Payee.inn					= rs.getString(27);
	raif.Payee.kpp					= rs.getString(28);
	raif.Payee.personalAcc			= rs.getString(29);
	raif.Payee.uip					= rs.getString(30);
	raif.Payee.Name 				= rs.getString(31);
	raif.Payee.Bank.bic 			= rs.getString(32);
	raif.Payee.Bank.correspAcc		= rs.getString(33);
	raif.Payee.Bank.Name			= rs.getString(34);
	raif.Payee.Bank.BankCity		= rs.getString(35);
	raif.Payee.Bank.SettlementType	= rs.getString(36);
	raif.DepInfo.cbc				= rs.getString(37);
	raif.DepInfo.okato				= rs.getString(38);
	raif.DepInfo.paytReason 		= rs.getString(39);
	raif.DepInfo.taxPeriod			= rs.getString(40);
	raif.DepInfo.docNo				= rs.getString(41);
	raif.DepInfo.docDate			= rs.getString(42);
	raif.DepInfo.taxPaytKind		= rs.getString(43);
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
	digestBody += dbf.digest_string('Уникальный идентификатор платежа=', raif.Payee.uip);
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
	digestBody += 'Вид платежа=' + raif.AccDoc.paytKind + '\n';
	digestBody += 'Код вида платежа=\n';
	digestBody += 'Вид операции=' + raif.AccDoc.transKind + '\n';
	
	digestBody += dbf.digest_string('КБК=', raif.DepInfo.cbc);
	digestBody += dbf.digest_string('ОКАТО=', raif.DepInfo.okato);
	digestBody += dbf.digest_string('Основание платежа=', raif.DepInfo.paytReason);
	
	digestBody += 'Очередность платежа=' + raif.AccDoc.priority + '\n';
	digestBody += 'Код вида валютной операции=' + raif.AccDoc.codeVO + '\n';
	digestBody += 'Документы не требуются (0 - нет, 1 - да)=' + raif.AccDoc.nodocs + '\n';
	
	if(raif.DepInfo.taxPeriod != null){
		var taxPeriod = raif.DepInfo.taxPeriod.split('.',3);
		taxPeriod.forEach(function(field, i){ 
			switch (i) {
				case 0:
					digestBody += 'Налоговый период (день)=' + field + '\n'; break;
				case 1:
					digestBody += 'Налоговый период (месяц)=' + field + '\n'; break;
				case 2:
					digestBody += 'Налоговый период (год)=' + field + '\n'; break;
			}
		});
		switch (taxPeriod.length) {
			case 1: 
				digestBody += 'Налоговый период (месяц)=\n';
				digestBody += 'Налоговый период (год)=\n';
				break;
			case 2:
				digestBody += 'Налоговый период (год)=\n'; break;
		}
	}else{
		digestBody += 'Налоговый период (день)=\n'; 
		digestBody += 'Налоговый период (месяц)=\n';
		digestBody += 'Налоговый период (год)=\n';
	}
	
	if(raif.DepInfo.docDate != null){
		var docDate = raif.DepInfo.docDate.split('.',3);
		docDate.forEach(function(field, i){ 
			switch (i) {
				case 0:
					digestBody += 'Дата налогового документа (день)=' + field + '\n'; break;
				case 1:
					digestBody += 'Дата налогового документа (месяц)=' + field + '\n'; break;
				case 2:
					digestBody += 'Дата налогового документа (год)=' + field + '\n'; break;
			}
		});
		switch (docDate.length) {
			case 1: 
				digestBody += 'Дата налогового документа (месяц)=\n';
				digestBody += 'Дата налогового документа (год)=\n';
				break;
			case 2:
				digestBody += 'Дата налогового документа (год)=\n'; break;
		}
	}else{
		digestBody += 'Дата налогового документа (день)=\n';
		digestBody += 'Дата налогового документа (месяц)=\n';
		digestBody += 'Дата налогового документа (год)=\n';
	}

	digestBody += 'Тип налогового платежа=\n';
	digestBody += dbf.digest_string('Номер налогового документа=', raif.DepInfo.docNo);
	digestBody += 'Номер паспорта сделки=\n';
}


$.response.status = $.net.http.OK;
$.response.contentType = "text/plain";
$.response.setBody(digestBody);




