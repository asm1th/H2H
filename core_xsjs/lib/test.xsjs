// try {
// 	var H2HMapping = new Map();
// 	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\"");
// 	var rs = null;
// 	rs = pStmt.executeQuery();
// 	while (rs.next()) {
// 		var fildSource = rs.getString(1);
// 		var fieldDestination = rs.getString(2);
// 		H2HMapping.set(fildSource, fieldDestination);
// 	}

// 	 $.response.setBody('Good!');
// } catch (e) {
// 	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
//     $.response.setBody(e.toString());
// }

// class raif{
// 	constructor(requestId, docExtId) {
// 	    this.requestId = requestId;
// 	    this.docExtId = docExtId;
// 	  }
// }

// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//     s4() + '-' + s4() + s4() + s4();
// }

// var raif = new raif(guid(), guid());
// $.response.setBody('Good!');
// document.createElement('pre');
// document['createElement']('pre');
// var raif = {};
// raif.PayDocRu = [];
// var PayDocRu = new Map();
// PayDocRu.set('Test', '123');
// raif.PayDocRu.push(PayDocRu);
// var PayDocRu = new Map();
// PayDocRu.set('Test', '124');
// raif.PayDocRu.push(PayDocRu);
// PayDocRu.set('Test', '125');
// var PayDocRu = {};
// PayDocRu['REQUESTID'] = '123';
// PayDocRu['DOCEXTID'] = '456';
// raif.PayDocRu.push(PayDocRu);
// PayDocRu['REQUESTID'] = '567';
// PayDocRu['DOCEXTID'] = '890';
// raif.PayDocRu.push(PayDocRu);

// 	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"VALUE\" From \"RaiffeisenBank.TSign\" Where \"DOCEXTID\"='06296e2b-6b0e-5759-683a-eb5d7b214989'");
// 	var rs = null;
// 	rs = pStmt.executeQuery();
// 	while (rs.next()) {
// 		var array = new Uint8Array(rs.getBlob(1));
// 		var encodedString = String.fromCharCode.apply(null,array),
// 				decodedString = decodeURIComponent(escape(encodedString));
// 				content = decodedString;
// 	}
// 	rs.close();

// 	// var test = new $.util.codec.encodeBase64(content);
// 	// encodedString = String.fromCharCode.apply(null,array),
// 	// decodedString = decodeURIComponent(escape(encodedString));
// 	// content = decodedString;

// $.response.status = $.net.http.OK;
// $.response.contentType = "text/plain";
// $.response.setBody(content);

/*eslint no-console: 0, no-unused-vars: 0, no-shadow:0, quotes: 0*/
//create a new $.util.SAXParser object

//parse XML from String
// var xmlDocument = new $.require("xmldoc").XmlDocument;

// var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
//           '<!-- this is a note -->\n'+
//           '<note noteName="NoteName">'+
//               '<to>To</to>'+
//               '<from>From</from>'+
//               '<heading>Note heading</heading>'+
//               '<body>Note body</body>'+
//           '</note>';
// var body = "";           
// var note = new xmlDocument(xml);
// note.eachChild(function(item){
//   body += item.val + '</br>';	
// });

// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//     s4() + '-' + s4() + s4() + s4();
// }

// function isNull(destField, srcValue ) {
// 	if ((destField.Obligatory == 'X' || destField.Type == "Int") && ( srcValue == null || srcValue == "" || srcValue == undefined) ) {
// 		switch (destField.Field) {
// 			case 'PURPOSE':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'DOCDATE':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
// 			case 'DOCNUM':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;		
// 			case 'DOCSUM':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;	
// 			case 'VATSUM':																						return '0.00';			break;
// 			case 'VATRATE':																						return '0.00';			break;
// 			case 'VAT':																							return 'VatManualAll';	break;
// 			case 'TRANSKIND':																					return '01';			break;
// 			case 'PAYTKIND':																					return '0'; 			break;
// 			case 'PRIORITY':																					return '0';				break;
// 			case 'NODOCS':																						return '1'; 			break; 
// 			case 'PAYERINN' || 'PAYEEINN':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'PAYERPERSONALACC' || 'PAYEEPERSONALACC':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'PAYERNAME' || 'PAYEENAME':	
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'PAYERBANKBIC' || 'PAYEEBANKBIC':	
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
// 			case 'PAYERBANKCITY' || 'PAYEEBANKCITY':	
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'PAYERBANKSETTLEMENTTYPE' || 'PAYEEBANKSETTLEMENTTYPE':										return '';				break;

// 			case 'DRAWERSTATUS':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'CBC':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'OKATO':
// 				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
// 			case 'PAYTREASON':																					return '0';				break;
// 			case 'TAXPERIOD':																					return '0';				break;
// 			case 'DOCNO':																						return '0';				break;
// 			case 'DOCDATE':																						return '0';				break;
// 			case 'TAXPAYTKIND':																					return '0';				break;
// 		}
// 	} else if(destField.Type == "Str" && ( srcValue == null || srcValue == "" || srcValue == undefined)){
// 		return "";
// 	}else{	
// 		return srcValue;
// 	}
// }

// function insertEntity(entityName, entitySet, entitySetFields, entitySetFieldsOptions ){
// 	var values = '';
// 	var fld = '';
// 	var conn = $.db.getConnection();
// 	try {
// 		entitySetFields.forEach(function(field, i){ values += i==0 ? '?' : ' ,?';	} );
// 		sql = 'INSERT INTO "RaiffeisenBank.T' + entityName + '" (' + entitySetFields.toString() + ') VALUES(' + values + ')';
// 		var pStmt = conn.prepareStatement(sql);
// 		entitySet.forEach(function(entity){ 
// 			entitySetFields.forEach(function(field, j){ 
// 				fieldOptions = entitySetFieldsOptions.get(field);
// 				var fieldValue = isNull(fieldOptions, entity.get(field));
// 				switch (fieldOptions.Type) {
// 						case 'Int':
// 							pStmt.setInt(j+1, parseInt(fieldValue)); 
// 							break;
// 						case 'Str':
// 							pStmt.setString(j+1, fieldValue); 
// 							break;
// 						case 'DDt':
// 							pStmt.setDate(j+1, fieldValue); 
// 							break;
// 						case 'DTm':
// 							pStmt.setTime(j+1, fieldValue); 
// 							break;
// 						default:
// 					};
// 			});
// 			pStmt.addBatch();
// 		});
// 		pStmt.executeBatch();
// 		conn.commit();
// 		pStmt.close();
// 		return '';
// 	} catch (e) {
// 		return e.toString();
// 	}
// 	return sql;
// }

// function getMapping(bankId, docType, entityName){
// 	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\",\"OBLIGATORY\" From \"H2H.TMapping\" Where \"BANKID\" = " + bankId + " and \"DOCUMENTTYPEID\" = " + docType + " and \"ENTITYNAME\" = '" + entityName + "'");
// 	var rs = null;
// 	rs = pStmt.executeQuery();
// 	var mapping = {};
// 	mapping.fields = [];
// 	mapping.destinatonFieldOpt = new Map();
// 	mapping.mappingField = new Map();
// 	mapping.entityName = entityName;

// 	while (rs.next()) {
// 			var entityDestination = rs.getString(1);
// 			var fildSource = rs.getString(2);
// 			var fieldDestination = rs.getString(3);
// 			var fildDestinationType = rs.getString(4);
// 			var fildObligatory = rs.getString(5);
// 			var fieldDestinationOptions = {};

// 			fieldDestinationOptions.Entity = entityDestination;
// 			fieldDestinationOptions.Field = fieldDestination;
// 			fieldDestinationOptions.Type = fildDestinationType;
// 			fieldDestinationOptions.Obligatory = fildObligatory;

// 			mapping.destinatonFieldOpt.set(fieldDestination, fieldDestinationOptions);
// 			mapping.mappingField.set(fildSource, fieldDestination);

// 			if (mapping.fields.indexOf(fieldDestination) < 0) { 
// 				mapping.fields.push(fieldDestination);
// 			}

// 	}
// 	return mapping;
// }

// // var response = '{"Response":{"$":{"xmlns":"http://bssys.com/upg/response"},"StatementsRaif":[{"StatementRaif":[{"$":{"acc":"40702810800001400002","acceptDate":"2019-10-18","beginDate":"2019-10-18","bic":"044525700","creditSum":"8185796048.53","creditSumNat":"0","currCode":"810","debetSum":"8153619574.68","debetSumNat":"0","docDate":"2019-10-18","docNum":"247","docTime":"00:00:00","endDate":"2019-10-18","enterBal":"151675606.4","extId":"23cb2ada-6207-4994-8354-d7f4d78b1f18","lastMovetDate":"2019-10-18","lastStmtDate":"2019-10-18","ldgBalance":"183852080.25","outBal":"183852080.25","stmtDate":"2019-10-18","stmtType":"1"},"Docs":[{"TransInfo":[{"$":{"PayAmt":"0","PayCur":"   ","avisType":"017","bank":"АО Райффайзенбанк","chargeDetails":"","comissionWrittenOff":" ","corrAcc":"47423810500010400002","corrBIC":"044525700","currRate":"0","dc":"1","docDate":"2019-10-18","docNum":"216737","docShifr":"","docSum":"25","docSumNat":"0","extId":"6766c091-d0ae-4336-b409-623451ecad8a","extRef":"421b220c0d0596bef621","midlBank":"","mtGVC":"847","mtTratCode":"NTRF","operDate":"2019-10-18","partPayNum":"","payDate":"","payDtls":"","payNum":"","payerBankBic":"044525700","payerBankCorrAccount":"30101810200000000700","payerCurrCode":"810","personalAcc":"40702810800001400002","personalINN":"5504036333","personalKPP":"783801001","pnar":"RUR PAYMENTS BESP 20191018PEON","receiptName":"АО Райффайзенбанк г. Москва","receiverAccountName":"Расчеты по отдельным операциям Требования по прочим операциям","receiverBankCorrAccount":"30101810200000000700","receiverBankName":"АО РАЙФФАЙЗЕНБАНК, Г. МОСКВА","receiverCurrCode":"810","receiverINN":"7744000302","receiverKPP":"770201001","senderCharges":" ","transKind":"17","writeOffDate":"2019-10-18"},"PersonalName":["ПАО ГАЗПРОМ НЕФТЬ "],"Purpose":["Исполнение платежа в рублях с использованием сервиса срочного перевода 20191018PEON017864"],"DepartmentalInfo":[{"$":{"cbc":""}}]}]}]}]}]}}';
// var response = '{"Response":{"$":{"xmlns":"http://bssys.com/upg/response"},"StatementsRaif":[{"StatementRaif":[{"$":{"acc":"40702810800001400002","acceptDate":"2019-10-18","beginDate":"2019-10-18","bic":"044525700","creditSum":"8185796048.53","creditSumNat":"0","currCode":"810","debetSum":"8153619574.68","debetSumNat":"0","docDate":"2019-10-18","docNum":"247","docTime":"00:00:00","endDate":"2019-10-18","enterBal":"151675606.4","extId":"23cb2ada-6207-4994-8354-d7f4d78b1f18","lastMovetDate":"2019-10-18","lastStmtDate":"2019-10-18","ldgBalance":"183852080.25","outBal":"183852080.25","stmtDate":"2019-10-18","stmtType":"1"},"Docs":[{"TransInfo":[{"$":{"PayAmt":"0","PayCur":"   ","avisType":"017","bank":"АО Райффайзенбанк","chargeDetails":"","comissionWrittenOff":" ","corrAcc":"47423810500010400002","corrBIC":"044525700","currRate":"0","dc":"1","docDate":"2019-10-18","docNum":"216737","docShifr":"","docSum":"25","docSumNat":"0","extId":"6766c091-d0ae-4336-b409-623451ecad8a","extRef":"421b220c0d0596bef621","midlBank":"","mtGVC":"847","mtTratCode":"NTRF","operDate":"2019-10-18","partPayNum":"","payDate":"","payDtls":"","payNum":"","payerBankBic":"044525700","payerBankCorrAccount":"30101810200000000700","payerCurrCode":"810","personalAcc":"40702810800001400002","personalINN":"5504036333","personalKPP":"783801001","pnar":"RUR PAYMENTS BESP 20191018PEON","receiptName":"АО Райффайзенбанк г. Москва","receiverAccountName":"Расчеты по отдельным операциям Требования по прочим операциям","receiverBankCorrAccount":"30101810200000000700","receiverBankName":"АО РАЙФФАЙЗЕНБАНК, Г. МОСКВА","receiverCurrCode":"810","receiverINN":"7744000302","receiverKPP":"770201001","senderCharges":" ","transKind":"17","writeOffDate":"2019-10-18"},"PersonalName":["ПАО ГАЗПРОМ НЕФТЬ "],"Purpose":["Исполнение платежа в рублях с использованием сервиса срочного перевода 20191018PEON017864"],"DepartmentalInfo":[{"$":{"cbc":""}}]},{"$":{"PayAmt":"0","PayCur":"   ","avisType":"017","bank":"АО Райффайзенбанк","chargeDetails":"","comissionWrittenOff":" ","corrAcc":"47423810500010400002","corrBIC":"044525700","currRate":"0","dc":"1","docDate":"2019-10-18","docNum":"216739","docShifr":"","docSum":"25","docSumNat":"0","extId":"0db4b779-0e1b-45e6-ab6a-3d7ff61ff03a","extRef":"cc9b4d664a2c25ca89ea","midlBank":"","mtGVC":"847","mtTratCode":"NTRF","operDate":"2019-10-18","partPayNum":"","payDate":"","payDtls":"","payNum":"","payerBankBic":"044525700","payerBankCorrAccount":"30101810200000000700","payerCurrCode":"810","personalAcc":"40702810800001400002","personalINN":"5504036333","personalKPP":"783801001","pnar":"RUR PAYMENTS BESP 20191018PEON","receiptName":"АО Райффайзенбанк г. Москва","receiverAccountName":"Расчеты по отдельным операциям Требования по прочим операциям","receiverBankCorrAccount":"30101810200000000700","receiverBankName":"АО РАЙФФАЙЗЕНБАНК, Г. МОСКВА","receiverCurrCode":"810","receiverINN":"7744000302","receiverKPP":"770201001","senderCharges":" ","transKind":"17","writeOffDate":"2019-10-18"},"PersonalName":["ПАО ГАЗПРОМ НЕФТЬ "],"Purpose":["Исполнение платежа в рублях с использованием сервиса срочного перевода 20191018PEON071863"],"DepartmentalInfo":[{"$":{"cbc":""}}]}]}]}]}]}}'
// var json = JSON.parse(response);

// var statementData = {};
// statementData.Statement = {};
// statementData.StatementItems = {};
// var responseID = guid();
// // statementData.Statement.mapping = {};
// // statementData.Statement.mapping.fields = [];
// // statementData.Statement.mapping.destinatonFieldOpt = new Map();
// // statementData.Statement.mapping.mappingField = new Map();
// // statementData.StatementItems.mapping = {};
// // statementData.StatementItems.mapping.fields = [];
// // statementData.StatementItems.mapping.destinatonFieldOpt = new Map();
// // statementData.StatementItems.mapping.mappingField = new Map();

// statementData.Statement = getMapping(1, 2, 'Statement');
// statementData.StatementItems = getMapping(1, 2, 'StatementItems');

// statementData.Statement.data = [];
// statementData.StatementItems.data = [];

// json.Response.StatementsRaif.forEach(function(statements){
// 	statements.StatementRaif.forEach(function(statement){
// 		var StatementRaif = new Map();
// 		StatementRaif.set('RESPONSEID',responseID);
// 		StatementRaif.set('BIC',statement.$.bic);
// 		StatementRaif.set('DEBETSUM',statement.$.debetSum);
// 		StatementRaif.set('CREDITSUM',statement.$.creditSum);
// 		StatementRaif.set('CURRCODE',statement.$.currCode);
// 		StatementRaif.set('DOCTIME',statement.$.docTime);
// 		StatementRaif.set('OUTBAL',statement.$.outBal);
// 		StatementRaif.set('STMTDATE',statement.$.stmtDate);
// 		StatementRaif.set('ENTERBAL',statement.$.enterBal);
// 		StatementRaif.set('DOCNUM',statement.$.docNum);
// 		statementData.Statement.data.push(StatementRaif);
// 		// StatementRaif.responseid	= responseID;
// 		// StatementRaif.bic			= statement.$.bic;
// 		// StatementRaif.debetSum		= statement.$.debetSum;
// 		// StatementRaif.creditSum		= statement.$.creditSum;
// 		// StatementRaif.currCode		= statement.$.currCode;
// 		// StatementRaif.docTime		= statement.$.docTime;
// 		// StatementRaif.outBal		= statement.$.outBal;
// 		// StatementRaif.stmtDate		= statement.$.stmtDate;
// 		// StatementRaif.enterBal		= statement.$.enterBal;
// 		// StatementRaif.docNum 		= statement.$.docNum;
// 		// raif.Statement.push(StatementRaif);

// 		statement.Docs.forEach(function(docs){
// 			docs.TransInfo.forEach(function(doc){
// 				var StatementItemsRaif = new Map();
// 				StatementItemsRaif.set('RESPONSEID',				responseID);
// 				StatementItemsRaif.set('EXTID',						doc.$.extId);
// 				StatementItemsRaif.set('BANK',						doc.$.bank);
// 				StatementItemsRaif.set('CORRACC',					doc.$.corrAcc);
// 				StatementItemsRaif.set('DC',						doc.$.dc);
// 				StatementItemsRaif.set('DOCNUM',					doc.$.docNum);
// 				StatementItemsRaif.set('DOCSUM',					doc.$.docSum);
// 				StatementItemsRaif.set('OPERDATE',					doc.$.operDate);
// 				StatementItemsRaif.set('PAYMENTORDER',				doc.$.paymentOrder);
// 				StatementItemsRaif.set('PAYTKIND',					doc.$.paytKind);
// 				StatementItemsRaif.set('PERSONALACC',				doc.$.personalAcc);
// 				StatementItemsRaif.set('PERSONALINN',				doc.$.personalINN);
// 				StatementItemsRaif.set('PERSONALKPP',				doc.$.personalKPP);
// 				StatementItemsRaif.set('TRANSKIND',					doc.$.transKind);
// 				StatementItemsRaif.set('RECEIVERINN',				doc.$.receiverINN);
// 				StatementItemsRaif.set('RECEIVERKPP',				doc.$.receiverKPP);
// 				StatementItemsRaif.set('RECEIVERPLACE',				doc.$.receiverPlace);
// 				StatementItemsRaif.set('RECEIVERPLACETYPE',			doc.$.receiverPlaceType);
// 				StatementItemsRaif.set('RECEIVERBANKCORRACCOUNT',	doc.$.receiverBankCorrAccount);
// 				StatementItemsRaif.set('RECEIVERBANKNAME',			doc.$.receiverBankName);
// 				StatementItemsRaif.set('PAYERPLACE',				doc.$.payerPlace);
// 				StatementItemsRaif.set('PAYERPLACETYPE',			doc.$.payerPlaceType);
// 				StatementItemsRaif.set('PAYERBANKCORRACCOUNT',		doc.$.payerBankCorrAccount);
// 				StatementItemsRaif.set('PAYERBANKBIC',				doc.$.payerBankBic);
// 				StatementItemsRaif.set('RECEIPTNAME',				doc.$.receiptName);
// 				StatementItemsRaif.set('PERSONALNAME',				doc.PersonalName[0]);
// 				StatementItemsRaif.set('PURPOSE',					doc.Purpose[0]);
// 				StatementItemsRaif.set('CBC',						doc.DepartmentalInfo[0].$.cbc);
// 				StatementItemsRaif.set('DOCDATE',					doc.DepartmentalInfo[0].$.docDate);
// 				StatementItemsRaif.set('DOCNO',						doc.DepartmentalInfo[0].$.docNo);
// 				StatementItemsRaif.set('DRAWERSTATUS',				doc.DepartmentalInfo[0].$.drawerStatus);
// 				StatementItemsRaif.set('OKATO',						doc.DepartmentalInfo[0].$.okato);
// 				StatementItemsRaif.set('PAYTREASON',				doc.DepartmentalInfo[0].$.paytReason);
// 				StatementItemsRaif.set('TAXPAYTKIND',				doc.DepartmentalInfo[0].$.taxPaytKind);
// 				StatementItemsRaif.set('TAXPERIOD',					doc.DepartmentalInfo[0].$.taxPeriod);
// 				StatementItemsRaif.set('UIP',						doc.DepartmentalInfo[0].$.uip);
// 				statementData.StatementItems.data.push(StatementItemsRaif);
// 				// var StatementItemsRaif = {};
// 				// StatementItemsRaif.responseid				= responseID;
// 				// StatementItemsRaif.extId					= doc.$.extId;
// 				// StatementItemsRaif.bank 					= doc.$.bank;
// 				// StatementItemsRaif.corrAcc					= doc.$.corrAcc;
// 				// StatementItemsRaif.dc						= doc.$.dc;
// 				// StatementItemsRaif.docNum					= doc.$.docNum;
// 				// StatementItemsRaif.docSum					= doc.$.docSum;
// 				// StatementItemsRaif.operDate 				= doc.$.operDate;
// 				// StatementItemsRaif.paymentOrder 			= doc.$.paymentOrder;
// 				// StatementItemsRaif.paytKind 				= doc.$.paytKind;
// 				// StatementItemsRaif.personalAcc				= doc.$.personalAcc;
// 				// StatementItemsRaif.personalINN				= doc.$.personalINN;
// 				// StatementItemsRaif.personalKPP				= doc.$.personalKPP;
// 				// StatementItemsRaif.transKind				= doc.$.transKind;
// 				// StatementItemsRaif.receiverINN				= doc.$.receiverINN;
// 				// StatementItemsRaif.receiverKPP				= doc.$.receiverKPP;
// 				// StatementItemsRaif.receiverPlace			= doc.$.receiverPlace;
// 				// StatementItemsRaif.receiverPlaceType		= doc.$.receiverPlaceType;
// 				// StatementItemsRaif.receiverBankCorrAccount	= doc.$.receiverBankCorrAccount;
// 				// StatementItemsRaif.receiverBankName 		= doc.$.receiverBankName;
// 				// StatementItemsRaif.payerPlace				= doc.$.payerPlace;
// 				// StatementItemsRaif.payerPlaceType			= doc.$.payerPlaceType;
// 				// StatementItemsRaif.payerBankCorrAccount 	= doc.$.payerBankCorrAccount;
// 				// StatementItemsRaif.payerBankBic 			= doc.$.payerBankBic;
// 				// StatementItemsRaif.receiptName				= doc.$.receiptName;
// 				// StatementItemsRaif.personalName				= doc.PersonalName[0];
// 				// StatementItemsRaif.purpose					= doc.Purpose[0];
// 				// StatementItemsRaif.cbc						= doc.DepartmentalInfo[0].$.cbc;
// 				// raif.StatementItems.push(StatementItemsRaif);
// 			});
// 		});

// 	});
// });

// insertEntity(	statementData.Statement.entityName, 
// 				statementData.Statement.data, 
// 				statementData.Statement.fields, 
// 				statementData.Statement.destinatonFieldOpt
// 			);

// insertEntity(	statementData.StatementItems.entityName, 
// 				statementData.StatementItems.data, 
// 				statementData.StatementItems.fields, 
// 				statementData.StatementItems.destinatonFieldOpt
// 			);

// var purpose="{VO35040}Payment of the Agent's Fee for October 2019, for transshipment of Fuel oil as per gpn-2017/109 dd 31.10.19, contract GPN-17/20000/01530/R В т.ч.НДС(20%) 400.566,68=";
// var context = "";
// if(purpose.search('\{VO[0-9]{5}\}')>=0){
// 	context = purpose.substr(purpose.search('\{VO[0-9]{5}\}')+3, 5);

// }else{
// 	context = "No";
// }

// var date = '18.10.2019';
// var context='';
// context += date.substr(6,4) + '-' + date.substr(3,2) + '-' + date.substr(0,2);
// // .format("yyyy-mm-dd")
// // // var now = new Date();
// $.response.status = $.net.http.INTERNAL_SERVER_ERROR; 
// $.response.contentType = "text/html";
// $.response.setBody(context); 

// var jsb64 = $.require('nodejs-base64');
// function str2b64(str){
// 	return jsb64.base64encode(str);
// }

// ================
///================

// fs.watch('/', {encoding: 'buffer'}, (eventType, filename) => {
//   if (filename)
//     console.log(filename);
//     // Prints: <Buffer ...>
// });

// var http = $.require('http');

// var download = function(url, dest, cb) {
//   var file = fs.createWriteStream(dest);
//   var request = http.get(url, function(response) {
//     response.pipe(file);
//     file.on('finish', function() {
//       file.close(cb);  // close() is async, call cb after close completes.
//     });
//   }).on('error', function(err) { // Handle errors
//     fs.unlink(dest); // Delete the file async. (But we don't check the result)
//     if (cb) cb(err.message);
//   });
// };

$.response.status = $.net.http.OK;
$.response.contentType = "text/plain";
$.response.setBody("found test");