// $.import("test.xsjs");
// var str2b64 = $.user.xsjs.str2b64;
var jsb64 = $.require('nodejs-base64');
var xml2js = $.require('xml2js');

var errMessage = [];

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function errAdd(param, docExtId, errType, errVal1, errVal2, errVal3, errVal4 ){
	var errText = "";
	var action = "";
	var now = new Date();
	switch (errType) {
		case 'errLoadEntityOblibatoryFielisNull':
			action = 'Загрузка';
			errText = "Ошибка загрузки " + errVal2 + ". Обязательное поле " + errVal3 + " не может быть пустам";
			break;
		case 'errSingUnknownAcc':
			action = 'Подписание';
			errText = "Ошибка подписания. Неизвестный контрагент " + errVal2;
			break;
		case 'errInsertEntity':
			action = 'Загрузка';
			errText = "Ошибка загрузки Entity -" + errVal1;
			break;
	}
	if(errText != ''){
		errMessage.push(errText);
		sql = 'INSERT INTO "RaiffeisenBank.THistory" (DOCEXTID,TIMESTAMP,ACTION,STATUS,DESCRIPTION) VALUES(?,?,?,?,?)';
		var pStmt = param.connection.prepareStatement(sql);
		pStmt.setString(1,docExtId, );
		pStmt.setTimestamp(2,now);
		pStmt.setString(3,action);
		pStmt.setString(4,'ERROR');
		pStmt.setString(5,errText);
		pStmt.execute();
		param.connection.commit();
		pStmt.close();
	}
}

function historyAdd(param, docExtId, action, status, description){
	var now = new Date();
	sql = 'INSERT INTO "RaiffeisenBank.THistory" (DOCEXTID,TIMESTAMP,ACTION,STATUS,DESCRIPTION) VALUES(?,?,?,?,?)';
	var pStmt = param.connection.prepareStatement(sql);
	pStmt.setString(1,docExtId);
	pStmt.setTimestamp(2,now);
	pStmt.setString(3,action);
	pStmt.setString(4,status);
	pStmt.setString(5,description);
	pStmt.execute();
	param.connection.commit();
	pStmt.close();
}

function getSettlementType(param, bic){
	var pStmt = param.connection.prepareStatement("Select \"SETTLEMENTTYPE\" From \"H2H.BicInformation\" Where \"BIC\" = '" + bic + "'");
		rs = null;
		rs = pStmt.executeQuery();
		while (rs.next()) {
			return rs.getString(1);
		}
		pStmt.close();
}

function isNull(param, docExtId, destField, srcValue ) {
	if ((destField.Obligatory == 'X' || destField.Type == "Int") && ( srcValue == null || srcValue == "" || srcValue == undefined) ) {
		switch (destField.Field) {
			case 'PURPOSE':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'DOCDATE':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
			case 'DOCNUM':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;		
			case 'DOCSUM':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;	
			case 'VATSUM':																						return '0.00';			break;
			case 'VATRATE':																						return '0.00';			break;
			case 'VAT':																							return 'VatManualAll';	break;
			case 'TRANSKIND':																					return '01';			break;
			case 'PAYTKIND':																					return '0'; 			break;
			case 'PRIORITY':																					return '0';				break;
			case 'NODOCS':																						return '1'; 			break; 
			case 'PAYERINN' || 'PAYEEINN':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERPERSONALACC' || 'PAYEEPERSONALACC':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERNAME' || 'PAYEENAME':	
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERBANKBIC' || 'PAYEEBANKBIC':	
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
			case 'PAYERBANKCITY' || 'PAYEEBANKCITY':	
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERBANKSETTLEMENTTYPE' || 'PAYEEBANKSETTLEMENTTYPE':										return '';				break;
			
			case 'DRAWERSTATUS':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'CBC':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'OKATO':
				errAdd(param, docExtId, 'errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYTREASON':																					return '0';				break;
			case 'TAXPERIOD':																					return '0';				break;
			case 'DOCNO':																						return '0';				break;
			case 'DOCDATE':																						return '0';				break;
			case 'TAXPAYTKIND':																					return '0';				break;
		}
	} else if(destField.Type == "Str" && ( srcValue == null || srcValue == "" || srcValue == undefined)){
		return "";
	}else{	
		return srcValue;
	}
}

function getMapping(param, bankId, docType, entityName){
	var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\",\"OBLIGATORY\" From \"H2H.TMapping\" Where \"BANKID\" = " + bankId + " and \"DOCUMENTTYPEID\" = " + docType + " and \"ENTITYNAME\" = '" + entityName + "'");
	var rs = null;
	rs = pStmt.executeQuery();
	var mapping = {};
	mapping.fields = [];
	mapping.destinatonFieldOpt = new Map();
	mapping.mappingField = new Map();
	mapping.entityName = entityName;
	
	while (rs.next()) {
		var entityDestination = rs.getString(1);
		var fildSource = rs.getString(2);
		var fieldDestination = rs.getString(3);
		var fildDestinationType = rs.getString(4);
		var fildObligatory = rs.getString(5);
		var fieldDestinationOptions = {};
		
		fieldDestinationOptions.Entity = entityDestination;
		fieldDestinationOptions.Field = fieldDestination;
		fieldDestinationOptions.Type = fildDestinationType;
		fieldDestinationOptions.Obligatory = fildObligatory;

		mapping.destinatonFieldOpt.set(fieldDestination, fieldDestinationOptions);
		mapping.mappingField.set(fildSource, fieldDestination);
		
		if (mapping.fields.indexOf(fieldDestination) < 0) { 
			mapping.fields.push(fieldDestination);
		}
	}
	return mapping;
}

function insertEntity(param, entityName, entitySet, entitySetFields, entitySetFieldsOptions ){
	var values = '';
	var fld = '';
	var docExtId = '';
	try {
		entitySetFields.forEach(function(field, i){ values += i==0 ? '?' : ' ,?';	} );
		sql = 'INSERT INTO "RaiffeisenBank.T' + entityName + '" (' + entitySetFields.toString() + ') VALUES(' + values + ')';
		var pStmt = param.connection.prepareStatement(sql);
		entitySet.forEach(function(entity){ 
			docExtId = '';
			if (entity.has('DOCEXTID')){
				docExtId = entity.get('DOCEXTID');
			} else if (entity.has('RESPONSEID')){
				docExtId = entity.has('RESPONSEID');
			} 
			entitySetFields.forEach(function(field, j){ 
				fieldOptions = entitySetFieldsOptions.get(field);
				var fieldValue = isNull(param, docExtId, fieldOptions, entity.get(field));
				switch (fieldOptions.Type) {
						case 'Int':
							pStmt.setInt(j+1, parseInt(fieldValue)); 
							break;
						case 'Str':
							pStmt.setString(j+1, fieldValue); 
							break;
						default:
					};
			});
			pStmt.addBatch();
		});
		pStmt.executeBatch();
		param.connection.commit();
		pStmt.close();
		
		switch(entityName) {
			case 'PayDocRu':	entitySet.forEach(function(entity){
									if (entity.has('DOCEXTID')){
										historyAdd(param, entity.get('DOCEXTID'), 'Загрузка', 'success', 'Импортирован');
									}
								});break;
			case 'Statement' :	entitySet.forEach(function(entity){
									if (entity.has('RESPONSEID')){
										historyAdd(param, entity.get('RESPONSEID'), 'Загрузка', 'success', 'Выписка успешно принята');
									}
								});break;
		}
		
	} catch (e) {
		if(entitySet.length > 0){
			errAdd(param, docExtId, 'errInsertEntity', entityName);
		}
		return e.toString();
	}
	return sql;
}

function binToString(binArray)
{
    var str = "";
    for (var i = 0; i < binArray.length; i++) {
        str += String.fromCharCode(parseInt(binArray[i]));
    }
    return str
}

function fileUpload(param)
{
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	rs = null;
	rs = pStmt.executeQuery();
	var fileBody = null;
	while (rs.next()) {
		var docType  = rs.getInt(2)
		var fileName = rs.getString(3);
    	var fileType = rs.getString(4);
    	var fileSize = rs.getInt(5);
		var array = new Uint8Array(rs.getBlob(6));
		content = binToString(array);
		var decodedString = decodeURIComponent(escape(content));
		fileBody = $.util.codec.encodeBase64(rs.getBlob(6));
	}
	pStmt.close();

	switch (docType) {
		case 1:
			createPaymentOrder(param, docType, fileName, fileType, fileSize, fileBody, decodedString);
			break;
		case 2: 
			createStatment(param, docType, fileName, fileType, fileSize, fileBody, decodedString);
		default:
	}
	
	
}

function createPaymentOrder(param, docType, fileName, fileType, fileSize, fileBody, content) {
	try {
		var rs = null;
		var raif = {};
		var mappingField		= new Map();
		var destinatonFieldOpt  = new Map();
		var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\",\"OBLIGATORY\" From \"H2H.TMapping\" Where \"BANKID\" = 1 and \"DOCUMENTTYPEID\" = 1");
		rs = null;
		rs = pStmt.executeQuery();
		
		var fieldsRequest	= [];
		var fieldsPayDocRu	= [];
		var fieldsAccDoc	= [];
		var fieldsPayer 	= [];
		var fieldsPayee		= [];
		var fieldsDepInfo	= [];
		var fieldsFile		= [];
		while (rs.next()) {
			var entityDestination = rs.getString(1);
			var fildSource = rs.getString(2);
			var fieldDestination = rs.getString(3);
			var fildDestinationType = rs.getString(4);
			var fildObligatory = rs.getString(5);
			var fieldDestinationOptions = {};
			
			fieldDestinationOptions.Entity = entityDestination;
			fieldDestinationOptions.Field = fieldDestination;
			fieldDestinationOptions.Type = fildDestinationType;
			fieldDestinationOptions.Obligatory = fildObligatory;

			destinatonFieldOpt.set(fieldDestination, fieldDestinationOptions);
			mappingField.set(fildSource, fieldDestination);
			// mappingEntity.set(fildSource, entityDestination);
			// if (mappingFieldType.has(fieldDestination) != true) { 
			// 		mappingFieldType.set(fieldDestination, fildDestinationType);
			// 	}

			switch (entityDestination) {
				case 'Request':
					if (fieldsRequest.indexOf(fieldDestination) < 0) { 
						fieldsRequest.push(fieldDestination);
					}
					break;
				case 'PayDocRu':
					if (fieldsPayDocRu.indexOf(fieldDestination) < 0 ) { 
						fieldsPayDocRu.push(fieldDestination);
					}
					break;
				case 'AccDoc':
					if (fieldsAccDoc.indexOf(fieldDestination) < 0) { 
						fieldsAccDoc.push(fieldDestination);
					}
					break;
				case 'Payer':
					if (fieldsPayer.indexOf(fieldDestination) < 0) { 
						fieldsPayer.push(fieldDestination);
					}
					break;
				case 'Payee':
					if (fieldsPayee.indexOf(fieldDestination) < 0) { 
						fieldsPayee.push(fieldDestination);
					}
					break;
				case 'DepartmentalInfo':
					if (fieldsDepInfo.indexOf(fieldDestination) < 0) { 
						fieldsDepInfo.push(fieldDestination);
					}
					break;
				case 'File':
					if (fieldsFile.indexOf(fieldDestination) < 0) { 
						fieldsFile.push(fieldDestination);
					}
					break;	
			}
		}

		var fileRows = content.split(/\r\n|\n/);
		
		var requestID = guid();
		raif.Request = [];
		Request = new Map();
		Request.set('BANK','RAIF');
		Request.set('XMLNS','http://bssys.com/upg/request');
		Request.set('REQUESTID',requestID);
		Request.set('VERSION','0.1');
		raif.Request.push(Request);
		
		raif.File = [];
		File = new Map();
		File.set('REQUESTID', requestID);
		File.set('DOCTYPEID', docType);
		File.set('FILENAME',  fileName);
		File.set('FILETYPE',  fileType);
		File.set('FILESIZE',  fileSize);
		File.set('FILEBODY',  fileBody);
		raif.File.push(File);
		
		var startDoc = false;
		var docExtID = "";
		raif.PayDocRu	= [];
		raif.AccDoc 	= [];
		raif.Payer		= [];
		raif.Payee		= [];
		raif.DepInfo	= [];
		fileRows.forEach(function(row, i, fileRows){
			var sourceRow = [];
			sourceRow = row.split('=');
			var sourceField = sourceRow[0];
			var sourceValue = sourceRow[1];
			var _destinationField = mappingField.get(sourceField);
			if (_destinationField != null) {
				var destinationField = destinatonFieldOpt.get(_destinationField);
				if (destinationField.Field == "START") {
					startDoc	= true;
					docExtID	= guid();
					PayDocRu	= new Map();
					AccDoc 		= new Map();
					Payer		= new Map();
					Payee		= new Map();
					DepInfo		= new Map();
				}else if (startDoc == true && destinationField.Field != "END"){
					if (sourceValue != "" ) {
						switch (destinationField.Entity) {
							case 'PayDocRu':			PayDocRu.set(destinationField.Field, sourceValue);	break;
							case 'AccDoc':				AccDoc.set(destinationField.Field, sourceValue);	break;
							case 'Payer':				Payer.set(destinationField.Field, sourceValue);		break;
							case 'Payee':				Payee.set(destinationField.Field, sourceValue);		break;
							case 'DepartmentalInfo':	DepInfo.set(destinationField.Field, sourceValue);	break;
						}
					}
				}else if (destinationField.Field == "END") {
					startDoc = false
					PayDocRu.set('REQUESTID', requestID);
					PayDocRu.set('DOCEXTID', docExtID);
					PayDocRu.set('STATUS',1);
					raif.PayDocRu.push(PayDocRu);
					
					if (AccDoc.size > 0) {
						AccDoc.set('DOCEXTID', docExtID);
						var purpose = AccDoc.get('PURPOSE');
						if(purpose.search('\{VO[0-9]{5}\}') >= 0){
							AccDoc.set('CODEVO', purpose.substr(purpose.search('\{VO[0-9]{5}\}')+3, 5));
						}
						
						var docDate = AccDoc.get('DOCDATE');
						if(docDate.search('[0-9]{2}\.[0-9]{2}\.[0-9]{4}' >= 0)){
							AccDoc.set('DOCDATE',docDate.substr(6,4) + docDate.substr(3,2) + docDate.substr(0,2));
						}
						raif.AccDoc.push(AccDoc);
					}
					if (Payer.size > 0) {
						Payer.set('DOCEXTID', docExtID);
						
						if (!Payer.has('PAYERBANKSETTLEMENTTYPE') && Payer.has('PAYERBANKBIC')) {
							var PayerBankSettlementType = getSettlementType(param, Payer.get('PAYERBANKBIC'));
							Payer.set('PAYERBANKSETTLEMENTTYPE', PayerBankSettlementType);
						}
						
						raif.Payer.push(Payer);
					}
					if (Payee.size > 0) {
						Payee.set('DOCEXTID', docExtID);
						
						if (!Payee.has('PAYEEBANKSETTLEMENTTYPE') && Payee.has('PAYEEBANKBIC')) {
							var PayeeBankSettlementType = getSettlementType(param, Payee.get('PAYEEBANKBIC'));
							if(DepInfo.get('CBC') != undefined){
								PayDocRu.set('PAYEEUIP', '0')
							}
							Payee.set('PAYEEBANKSETTLEMENTTYPE', PayeeBankSettlementType);
						}
						
						raif.Payee.push(Payee);
					}
					if (DepInfo.size > 0) {
						DepInfo.set('DOCEXTID', docExtID);
						raif.DepInfo.push(DepInfo);
					}
				} else if (destinationField.Field == "EOF" ){
					insertEntity(param, 'Request',				raif.Request,	fieldsRequest,	destinatonFieldOpt);
					insertEntity(param, 'File',					raif.File,		fieldsFile,		destinatonFieldOpt);
					insertEntity(param, 'PayDocRu',				raif.PayDocRu,	fieldsPayDocRu, destinatonFieldOpt);
					insertEntity(param, 'AccDoc',				raif.AccDoc,	fieldsAccDoc,	destinatonFieldOpt);
					insertEntity(param, 'Payer', 				raif.Payer, 	fieldsPayer,	destinatonFieldOpt);
					insertEntity(param, 'Payee', 				raif.Payee, 	fieldsPayee,	destinatonFieldOpt);
					insertEntity(param, 'DepartmentalInfo', 	raif.DepInfo, 	fieldsDepInfo,	destinatonFieldOpt);
				} 
			} 
		});
	} catch (e) {
	    $.trace.error(e.toString());
		throw e;
	}	
}


function createStatment(param, docType, fileName, fileType, fileSize, fileBody, content)
{
	var statementData = {};
	statementData.Statement = {};
	statementData.StatementItems = {};
	statementData.File = {}
	var responseID = guid();

	statementData.Statement = getMapping(param, 1, 2, 'Statement');
	statementData.StatementItems = getMapping(param, 1, 2, 'StatementItems');
	statementData.File = getMapping(param, 1, 1, 'File');

	statementData.Statement.data = [];
	statementData.StatementItems.data = [];
	statementData.File.data = [];
	
	File = new Map();
	File.set('REQUESTID', responseID);
	File.set('DOCTYPEID', docType);
	File.set('FILENAME',  fileName);
	File.set('FILETYPE',  fileType);
	File.set('FILESIZE',  fileSize);
	File.set('FILEBODY',  fileBody);
	statementData.File.data.push(File);
	
	
	xml2js.parseString(content, function (err, json) {

	    json.Response.StatementsRaif.forEach(function(statements){
		statements.StatementRaif.forEach(function(statement){
			var StatementRaif = new Map();
			StatementRaif.set('RESPONSEID',responseID);
			StatementRaif.set('ACC',statement.$.acc);
			StatementRaif.set('BIC',statement.$.bic);
			StatementRaif.set('DEBETSUM',statement.$.debetSum);
			StatementRaif.set('CREDITSUM',statement.$.creditSum);
			StatementRaif.set('CURRCODE',statement.$.currCode);
			StatementRaif.set('DOCTIME',statement.$.docTime);
			StatementRaif.set('OUTBAL',statement.$.outBal);
			StatementRaif.set('STMTDATE',statement.$.stmtDate);
			StatementRaif.set('BEGINDATE',statement.$.beginDate);
			StatementRaif.set('ENDDATE',statement.$.endDate);
			StatementRaif.set('LASTMOVETDATE',statement.$.lastMovetDate);
			StatementRaif.set('LASTSTMTDATE',statement.$.lastStmtDate);
			StatementRaif.set('ENTERBAL',statement.$.enterBal);
			
			DtNow = Date(Date.now());
			if(Date.parse(statement.$.stmtDate) < DtNow){
				StatementRaif.set('STMTTYPE',2); //Справка
			}else{
				StatementRaif.set('STMTTYPE',1); //Выписка
			};
				
			
			StatementRaif.set('DOCNUM',statement.$.docNum);
			statementData.Statement.data.push(StatementRaif);
			
			statement.Docs.forEach(function(docs){
				docs.TransInfo.forEach(function(doc){
					var StatementItemsRaif = new Map();
					StatementItemsRaif.set('RESPONSEID',				responseID);
					StatementItemsRaif.set('EXTID',						doc.$.extId);
					StatementItemsRaif.set('BANK',						doc.$.bank);
					StatementItemsRaif.set('CORRACC',					doc.$.corrAcc);
					StatementItemsRaif.set('DC',						doc.$.dc);
					StatementItemsRaif.set('DOCNUM',					doc.$.docNum);
					StatementItemsRaif.set('DOCSUM',					doc.$.docSum);
					StatementItemsRaif.set('DOCDATE',					doc.$.docDate);
					StatementItemsRaif.set('OPERDATE',					doc.$.operDate);
					StatementItemsRaif.set('PAYMENTORDER',				doc.$.paymentOrder);
					StatementItemsRaif.set('PAYTKIND',					doc.$.paytKind);
					StatementItemsRaif.set('PERSONALACC',				doc.$.personalAcc);
					StatementItemsRaif.set('PERSONALINN',				doc.$.personalINN);
					StatementItemsRaif.set('PERSONALKPP',				doc.$.personalKPP);
					StatementItemsRaif.set('TRANSKIND',					doc.$.transKind);
					StatementItemsRaif.set('RECEIVERINN',				doc.$.receiverINN);
					StatementItemsRaif.set('RECEIVERKPP',				doc.$.receiverKPP);
					StatementItemsRaif.set('RECEIVERPLACE',				doc.$.receiverPlace);
					StatementItemsRaif.set('RECEIVERPLACETYPE',			doc.$.receiverPlaceType);
					StatementItemsRaif.set('RECEIVERBANKCORRACCOUNT',	doc.$.receiverBankCorrAccount);
					StatementItemsRaif.set('RECEIVERBANKNAME',			doc.$.receiverBankName);
					StatementItemsRaif.set('PAYERPLACE',				doc.$.payerPlace);
					StatementItemsRaif.set('PAYERPLACETYPE',			doc.$.payerPlaceType);
					StatementItemsRaif.set('PAYERBANKCORRACCOUNT',		doc.$.payerBankCorrAccount);
					StatementItemsRaif.set('PAYERBANKBIC',				doc.$.payerBankBic);
					StatementItemsRaif.set('RECEIPTNAME',				doc.$.receiptName);
					StatementItemsRaif.set('PERSONALNAME',				doc.PersonalName[0]);
					StatementItemsRaif.set('PURPOSE',					doc.Purpose[0]);
					StatementItemsRaif.set('CBC',						doc.DepartmentalInfo[0].$.cbc);
					StatementItemsRaif.set('DDOCDATE',					doc.DepartmentalInfo[0].$.docDate);
					StatementItemsRaif.set('DOCNO',						doc.DepartmentalInfo[0].$.docNo);
					StatementItemsRaif.set('DRAWERSTATUS',				doc.DepartmentalInfo[0].$.drawerStatus);
					StatementItemsRaif.set('OKATO',						doc.DepartmentalInfo[0].$.okato);
					StatementItemsRaif.set('PAYTREASON',				doc.DepartmentalInfo[0].$.paytReason);
					StatementItemsRaif.set('TAXPAYTKIND',				doc.DepartmentalInfo[0].$.taxPaytKind);
					StatementItemsRaif.set('TAXPERIOD',					doc.DepartmentalInfo[0].$.taxPeriod);
					StatementItemsRaif.set('UIP',						doc.DepartmentalInfo[0].$.uip);
					statementData.StatementItems.data.push(StatementItemsRaif);
					});
				});
			});
		});
	});	

	insertEntity(	param,
					statementData.File.entityName, 
					statementData.File.data, 
					statementData.File.fields, 
					statementData.File.destinatonFieldOpt
				);
	
	insertEntity(	param,
					statementData.Statement.entityName, 
					statementData.Statement.data, 
					statementData.Statement.fields, 
					statementData.Statement.destinatonFieldOpt
				);
	
	insertEntity(	param,
					statementData.StatementItems.entityName, 
					statementData.StatementItems.data, 
					statementData.StatementItems.fields, 
					statementData.StatementItems.destinatonFieldOpt
				);
		
}

function createSing(param){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	rs = null;
	rs = pStmt.executeQuery();
	var fileBody = null;
	var sign = {};
	while (rs.next()) {
		sign.docExtId = 		rs.getString(1);
    	sign.SN =				rs.getString(2);
    	sign.Value =			$.util.codec.encodeBase64(rs.getBlob(3));
    	sign.Issuer =			rs.getString(4);
		sign.DigestName =		rs.getString(5);
		sign.DigestVersion =	rs.getString(6);
		sign.SignType = 		rs.getString(7);
		sign.Fio =				rs.getString(8);
		sign.Position = 		rs.getString(9);
	}
	pStmt.close();
	
	var mappingField		= new Map();
	var destinatonFieldOpt  = new Map();
	var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\",\"OBLIGATORY\" From \"H2H.TMapping\" Where \"BANKID\" = 1 and \"DOCUMENTTYPEID\" = 1 and \"ENTITYNAME\" = 'Sign' ");
	rs = null;
	rs = pStmt.executeQuery();
	var fieldsSign	= [];
	while (rs.next()) {
		var fieldDestination = rs.getString(3);
		var fildDestinationType = rs.getString(4);
		var fieldDestinationOptions = {};
		fieldDestinationOptions.Field = fieldDestination;
		fieldDestinationOptions.Type = fildDestinationType;
		fieldDestinationOptions.Obligatory = rs.getString(5);
		destinatonFieldOpt.set(fieldDestination, fieldDestinationOptions);
		fieldsSign.push(fieldDestination);
	}
	
	var raif = {};
	raif.Sign = [];
	
	pStmt = param.connection.prepareStatement("select \"PAYERPERSONALACC\" from \"RaiffeisenBank.TPayer\" where \"DOCEXTID\" = '"+sign.docExtId+"'");
	rs = null;
	rs = pStmt.executeQuery();
	while (rs.next()) {
		raif.payerPersonalAcc = rs.getString(1);
	}
	
	pStmt = param.connection.prepareStatement("select count(*) from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+sign.docExtId+"'");
	rs = null;
	rs = pStmt.executeQuery();
	while (rs.next()) {
		raif.signOrder = rs.getInt(1);
		raif.signOrder++;
	}
	
	pStmt = param.connection.prepareStatement("select \"ACCOUNT\",\"NAME\",\"STATUS\" from \"H2H.AccountMapping\" where \"ACCOUNT\"='" + raif.payerPersonalAcc + "' and \"SIGNORDER\"=" + raif.signOrder );
	rs = null;
	rs = pStmt.executeQuery();
	while (rs.next()) {
		raif.SignName = rs.getString(2);
		raif.Status = rs.getInt(3);
	}
	pStmt.close();
	if (raif.SignName == undefined || raif.SignName == "") {
		errAdd(param, sign.docExtId, 'errSingUnknownAcc', sign.docExtId, raif.payerPersonalAcc, '', '');	
	}else{
		Sign = new Map();
		Sign.set('DOCEXTID', sign.docExtId);
		Sign.set('SN', sign.SN);
		Sign.set('VALUE', sign.Value);
		Sign.set('ISSUER', sign.Issuer);
		Sign.set('DIGESTNAME', sign.DigestName);
		Sign.set('DIGESTVERSION', sign.DigestVersion);
		Sign.set('SIGNTYPE', raif.SignName);
		Sign.set('FIO', sign.Fio);
		Sign.set('POSITION', sign.Position);
		raif.Sign.push(Sign);
		insertEntity(param, 'Sign', raif.Sign, fieldsSign, destinatonFieldOpt);
		try {
			pStmt = param.connection.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + sign.docExtId + "'");
		    pStmt.setInt(1, raif.Status);
		    pStmt.execute();
		    pStmt.close();
		    historyAdd(param, sign.docExtId, 'Подписание', 'success', raif.SignName);
		} catch (err) {
			pStmt.close();
		}
	}
}

function updateAccDoc(param){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var rs = pStmt.executeQuery();
	while (rs.next()) {
		docExtId	= 		rs.getString(2);
    	piority 	=		rs.getInt(15);
	}
	pStmt.close();
// TODO: Добавить проверку на существование строки
	pStmt = param.connection.prepareStatement("Update \"RaiffeisenBank.TAccDoc\" set \"PRIORITY\" = ? Where \"DOCEXTID\"='" + docExtId + "'");
    pStmt.setInt(1, piority);
    pStmt.execute();
    pStmt.close();
}

function deletSing(param){
	// var after = param.afterTableName;
	var before = param.beforeTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + before + "\"");
	rs = null;
	rs = pStmt.executeQuery();
	var fileBody = null;
	var sign = {};
	var raif = {};
	while (rs.next()) {
		sign.docExtId = 		rs.getString(1);
    	sign.SN =				rs.getString(2);
  //  	sign.Value =			$.util.codec.encodeBase64(rs.getBlob(3));
  //  	sign.Issuer =			rs.getString(4);
		// sign.DigestName =		rs.getString(5);
		// sign.DigestVersion =	rs.getString(6);
		// sign.SignType = 		rs.getString(7);
		// sign.Fio =				rs.getString(8);
		// sign.Position = 		rs.getString(9);
	}
	pStmt.close();
	var salesOrderId = '';
	pStmt = param.connection.prepareStatement("select \"DOCEXTID\",\"SIGNTYPE\" from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+sign.docExtId+"' and \"SN\" = '" + sign.SN + "'");
	rs = pStmt.executeQuery();
	while(rs.next()){
		docExtId = rs.getString(1);
		raif.signName = rs.getString(2);
	}
	pStmt.close();
	
	if(docExtId === ''){
		throw new error("Invalid Sales Order ID.");
	}else{
		pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+sign.docExtId+"' and \"SN\" = '" + sign.SN + "'");
	    pStmt.executeUpdate();
	    param.connection.commit();
	    pStmt.close();
	    
	    pStmt = param.connection.prepareStatement("select \"STATUS\" from \"H2H.AccountMapping\" where \"ACCOUNT\"='" + raif.payerPersonalAcc + "' and \"SIGNORDER\"=" + raif.signOrder );
		rs = null;
		rs = pStmt.executeQuery();
		while (rs.next()) {
			raif.status = rs.getInt(1);
		}
		pStmt.close();
		if(raif.status == 4){
			raif.status = 3;
		}else if(raif.status == 3){
			raif.status = 1;
		}
		
		pStmt = param.connection.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + sign.docExtId + "'");
		pStmt.setInt(1, raif.status);
		pStmt.execute();
		pStmt.close();
		historyAdd(param, sign.docExtId, 'Отзыв ЭЦП', 'success', raif.signName);
		
		
	}
}

function deletPaymentOrder(param){
	var before = param.beforeTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + before + "\"");
	rs = null;
	rs = pStmt.executeQuery();
	var fileBody = null;
	var PaymentOrder = {};
	while (rs.next()) {
		PaymentOrder.docExtId = 		rs.getString(2);
	}
	pStmt.close();
	if(PaymentOrder.docExtId === ''){
		throw new error("Invalid docExtId.");
	}else{
	 //   pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TPayDocRu\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
		
		// pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TAccDoc\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
		
		// pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TPayer\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
		
		// pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TPayee\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
		
		// pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TDepartmentalInfo\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
		
		// pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+PaymentOrder.docExtId+"'");
		// pStmt.executeUpdate();
	    
	 //   param.connection.commit();
	 //   pStmt.close();
		try {
			pStmt = param.connection.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + PaymentOrder.docExtId + "'");
		    pStmt.setInt(1, 99);
		    pStmt.execute();
		    pStmt.close();
		    historyAdd(param, PaymentOrder.docExtId, 'Deleting', 'success', 'Успешно удален');
		} catch (err) {
			pStmt.close();
		}
	}
}

function response(param){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var rs = pStmt.executeQuery();
	while (rs.next()) {
		docExtId	= 		rs.getString(1);
    	status 		=		rs.getString(2);
    	description	=		rs.getString(3);
	}
	pStmt.close();
	
	historyAdd(param, docExtId, 'Отправка', 'success', 'Доставлен');
	historyAdd(param, docExtId, 'Отправка', 'success', 'Принят АБС');
	
	
	try {
			pStmt = param.connection.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + docExtId + "'");
		    pStmt.setInt(1, 8);
		    pStmt.execute();
		    pStmt.close();
		    historyAdd(param, docExtId, 'Отправка', 'success', 'Исполнен');
		} catch (err) {
			pStmt.close();
		}
	
}