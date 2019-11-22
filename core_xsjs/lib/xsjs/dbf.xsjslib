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

function errAdd(errType, errVal1, errVal2, errVal3, errVal4 ){
	switch (errType) {
		case 'errLoadEntityOblibatoryFielisNull':
			errMessage.push("Ошибка загрузки " + errVal1 + ". Обязательное поле " + errVal2 + " не может быть пустам");
			break;
	}
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

function isNull(destField, srcValue ) {
	if ((destField.Obligatory == 'X' || destField.Type == "Int") && ( srcValue == null || srcValue == "" || srcValue == undefined) ) {
		switch (destField.Field) {
			case 'PURPOSE':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'DOCDATE':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
			case 'DOCNUM':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;		
			case 'DOCSUM':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' ); 		return '';				break;	
			case 'VATSUM':																						return '0.00';			break;
			case 'VATRATE':																						return '0.00';			break;
			case 'VAT':																							return 'VatManualAll';	break;
			case 'TRANSKIND':																					return '01';			break;
			case 'PAYTKIND':																					return '0'; 			break;
			case 'PRIORITY':																					return '0';				break;
			case 'NODOCS':																						return '0'; 			break; 
			case 'PAYERINN' || 'PAYEEINN':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERPERSONALACC' || 'PAYEEPERSONALACC':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERNAME' || 'PAYEENAME':	
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERBANKBIC' || 'PAYEEBANKBIC':	
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;	
			case 'PAYERBANKCITY' || 'PAYEEBANKCITY':	
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYERBANKSETTLEMENTTYPE' || 'PAYEEBANKSETTLEMENTTYPE':										return '';				break;
			
			case 'DRAWERSTATUS':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'CBC':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'OKATO':
				errAdd('errLoadEntityOblibatoryFielisNull', destField.Entity, destField.Field, '', '' );		return '';				break;
			case 'PAYTREASON':																					return '0';				break;
			case 'TAXPERIOD':																					return '0';				break;
			case 'DOCNO':																						return '0';				break;
			case 'DOCDATE':																						return '0';				break;
			case 'TAXPAYTKIND':																					return '0';				break;
		}
	} else {
		return srcValue;
	}
}

function insertEntity(param, entityName, entitySet, entitySetFields, entitySetFieldsOptions ){
	var values = '';
	var fld = '';
	try {
		entitySetFields.forEach(function(field, i){ values += i==0 ? '?' : ' ,?';	} );
		sql = 'INSERT INTO "RaiffeisenBank.T' + entityName + '" (' + entitySetFields.toString() + ') VALUES(' + values + ')';
		var pStmt = param.connection.prepareStatement(sql);
		entitySet.forEach(function(entity){ 
			entitySetFields.forEach(function(field, j){ 
				fieldOptions = entitySetFieldsOptions.get(field);
				var fieldValue = isNull(fieldOptions, entity.get(field));
				switch (fieldOptions.Type) {
						case 'Int':
							pStmt.setInt(j+1, parseInt(fieldValue)); 
							break;
						case 'Str':
							pStmt.setString(j+1, fieldValue); 
							break;
						case 'Blb':
							pStmt.setBlob(j+1, fieldValue); 
							break;
						default:
					};
			});
			pStmt.addBatch();
		});
		pStmt.executeBatch();
		pStmt.close();
		return '';
	} catch (e) {
		return e.toString();
	}
	return sql;
}

function createPaymentOrder(param) {
	try {
		var rs = null;
		var raif = {};
		var mappingField		= new Map();
		// var mappingEntity		= new Map();
		// var mappingFieldType	= new Map();
		var destinatonFieldOpt  = new Map();
		var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\",\"OBLIGATORY\" From \"H2H.TMapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
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
		
		var after = param.afterTableName;
	    var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	    rs = null;
		rs = pStmt.executeQuery();
		var fileBody = null;
		while (rs.next()) {
			var fileName = rs.getString(2);
    		var fileType = rs.getString(3);
    		var fileSize = rs.getInt(4);
			var array = new Uint8Array(rs.getBlob(5));
			var encodedString = String.fromCharCode.apply(null,array),
				decodedString = decodeURIComponent(escape(encodedString));
				content = decodedString;
			fileBody = $.util.codec.encodeBase64(rs.getBlob(5));
			var fileRows = content.split(/\r\n|\n/);
		}
		pStmt.close();
		
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
				// var destinationEntity = mappingEntity.get(sourceField);
				if (destinationField.Field == "START") {
					startDoc	= true
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
					raif.PayDocRu.push(PayDocRu);
					
					if (AccDoc.size > 0) {
						AccDoc.set('DOCEXTID', docExtID);
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
	var mappingEntity		= new Map();
	var mappingFieldType	= new Map();
	var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\" From \"H2H.TMapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO' and \"ENTITYNAME\" = 'Sign' ");
	rs = null;
	rs = pStmt.executeQuery();
	var fieldsSign	= [];
	while (rs.next()) {
		var fieldDestination = rs.getString(3);
		var fildDestinationType = rs.getString(4);
		if (mappingFieldType.has(fieldDestination) != true) { 
				mappingFieldType.set(fieldDestination, fildDestinationType);
			}
		fieldsSign.push(fieldDestination);
	}
	
	var raif = {};
	raif.Sign = [];
	Sign = new Map();
	Sign.set('DOCEXTID', sign.docExtId);
	Sign.set('SN', sign.SN);
	Sign.set('VALUE', sign.Value);
	Sign.set('ISSUER', sign.Issuer);
	Sign.set('DIGESTNAME', sign.DigestName);
	Sign.set('DIGESTVERSION', sign.DigestVersion);
	// Sign.set('SIGNTYPE', sign.SignType);
	Sign.set('SIGNTYPE', 'Первая подпись');
	Sign.set('FIO', sign.Fio);
	Sign.set('POSITION', sign.Position);
	raif.Sign.push(Sign);
	insertEntity(param, 'Sign', raif.Sign, fieldsSign, mappingFieldType);
	// if (errMsg = "") {
	// 	$.response.status = $.net.http.OK;	
	// }else{
	// 	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	// 	 $.response.setBody(errMsg);
	// }
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
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	rs = null;
	rs = pStmt.executeQuery();
	var fileBody = null;
	var sign = {};
	while (rs.next()) {
		sign.docExtId = 		rs.getString(1);
  //  	sign.SN =				rs.getString(2);
  //  	sign.Value =			$.util.codec.encodeBase64(rs.getBlob(3));
  //  	sign.Issuer =			rs.getString(4);
		// sign.DigestName =		rs.getString(5);
		// sign.DigestVersion =	rs.getString(6);
		sign.SignType = 		rs.getString(7);
		sign.Fio =				rs.getString(8);
		sign.Position = 		rs.getString(9);
	}
	pStmt.close();
	var salesOrderId = '';
	pStmt = param.connection.prepareStatement("select \"DOCEXTID\",\"SIGNTYPE\" from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+sign.docExtId+"' and \"SIGNTYPE\" = '" + sign.SignType + "'");
	rs = pStmt.executeQuery();
	while(rs.next()){
		docExtId = rs.getString(1);
		SignType = rs.getString(2);
	}
	pStmt.close();
	
	if(salesOrderId === ''){
		throw new error("Invalid Sales Order ID.");
	}else{
		pStmt = param.connection.prepareStatement("delete from \"RaiffeisenBank.TSign\" where \"DOCEXTID\" = '"+sign.docExtId+"' and \"SIGNTYPE\" = '" + sign.SignType + "'");
	    pStmt.executeUpdate();
	    pStmt.close();
	}
}