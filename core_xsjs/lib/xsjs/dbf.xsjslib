function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function isNull(xmlField, xmlValue) {
	if (xmlValue == null) {
		switch (xmlField) {
			case 'PURPOSE':
				errMsg += 'purpose:isNull;';		return '';		break;
			case 'DOCDATE':
				errMsg += 'docDate:isNull;';		return '';		break;	
			case 'DOCNUM':
				errMsg += 'docNum:isNull;'; 		return '';		break;		
			case 'DOCSUM':
				errMsg += 'docSum:isNull;'; 		return '';		break;	
			case 'VATSUM':
													return '0.00';	break;
			case 'VATRATE':
													return '0.00';	break;
			case 'VAT':
				// errMsg += 'vat:isNull;';
													return 'VatManualAll'; break;
			case 'TRANSKIND':
				// errMsg += 'transKind:isNull;';
													return '01';	break;
			case 'PAYTKIND':
				// errMsg += 'paytKind:isNull;'; 
													return '0'; 	break;
			case 'PRIORITY':
				// errMsg += 'priority:isNull;';		
													return '5';		break;
			case 'NODOCS':
													return '0'; 	break; 
			case 'INN':
				errMsg += 'inn:isNull;';			return '';		break;
			case 'PERSONALACC':
				errMsg += 'personalAcc:isNull;';	return '';		break;
			case 'NAME':	
				errMsg += 'Name:isNull;';			return '';		break;
			case 'BIC':	
				errMsg += 'bic:isNull;';			return '';		break;	
			case 'BANKCITY':	
				errMsg += 'BankCity:isNull;';		return '';		break;
			case 'SETTLEMENTTYPE':	
				// errMsg += 'SettlementType:isNull;'; 
													return 'Г';		break;
			default:
		}
	} else {
		return xmlValue;
	}
}

function insertFile(param, entityName, entitySet, entitySetFields, entitySetFieldsType ){
		var values = '';
		var fld = '';
		try {
			entitySetFields.forEach(function(field, i){ values += i==0 ? '?' : ' ,?';	} );
			sql = 'INSERT INTO "RaiffeisenBank.T' + entityName + '" (' + entitySetFields.toString() + ') VALUES(' + values + ')';
			var pStmt = param.connection.prepareStatement(sql);
			entitySet.forEach(function(entity){ 
				entitySetFields.forEach(function(field, j){ 
					var fieldValue = isNull(field, entity.get(field));
					switch (entitySetFieldsType.get(field)) {
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
			
			// pStmt.close();
			pStmt.executeBatch();
			pStmt.close();
			return '';
		} catch (e) {
			return e.toString();
		}
		return sql;
}

function po_create(param) {
	try {
		var rs = null;
		var raif = {};
		var requestID = guid();
		var mappingField		= new Map();
		var mappingEntity		= new Map();
		var mappingFieldType	= new Map();
		var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
		rs = null;
		rs = pStmt.executeQuery();
		
		var fieldsRequest	= [];
		var fieldsPayDocRu	= [];
		var fieldsAccDoc	= [];
		var fieldsPayer 	= [];
		var fieldsPayee		= [];
		var fieldsFile		= [];
		while (rs.next()) {
			var entityDestination = rs.getString(1);
			var fildSource = rs.getString(2);
			var fieldDestination = rs.getString(3);
			var fildDestinationType = rs.getString(4);
			mappingField.set(fildSource, fieldDestination);
			mappingEntity.set(fildSource, entityDestination);
			if (mappingFieldType.has(fieldDestination) != true) { 
					mappingFieldType.set(fieldDestination, fildDestinationType);
				}
			
			mappingFieldType
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
				case 'File':
					if (fieldsFile.indexOf(fieldDestination) < 0) { 
						fieldsFile.push(fieldDestination);
					}
					break;	
				// default:
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
		raif.PayDocRu	= [];
		raif.AccDoc 	= [];
		raif.Payer		= [];
		raif.Payee		= [];
		fileRows.forEach(function(row, i, fileRows){
			var sourceRow = row.split('=');
			var sourceField = sourceRow[0];
			var sourceValue = sourceRow[1];
			var destinationField = mappingField.get(sourceField);
			if (destinationField != null) {
				var destinationEntity = mappingEntity.get(sourceField);
				if (destinationField == 'START') {
					startDoc = true
					var docExtID = guid();
					PayDocRu	= new Map();
					AccDoc 		= new Map();
					Payer		= new Map();
					Payee		= new Map();
					PayDocRu.set('REQUESTID', requestID);
					PayDocRu.set('DOCEXTID', docExtID);
					AccDoc.set('DOCEXTID', docExtID);
					Payer.set('DOCEXTID', docExtID);
					Payee.set('DOCEXTID', docExtID);
				}else if (startDoc == true && destinationField != 'END'){
					switch (destinationEntity) {
						case 'PayDocRu':
							PayDocRu.set(destinationField, sourceValue);
							break;
						case 'AccDoc':
							AccDoc.set(destinationField, sourceValue);
							break;
						case 'Payer':
							Payer.set(destinationField, sourceValue);
							break;
						case 'Payee':
							Payee.set(destinationField, sourceValue);
							break;
						default:
					}
				}else if (destinationField == 'END') {
					startDoc = false
					raif.PayDocRu.push(PayDocRu);
					raif.AccDoc.push(AccDoc);
					raif.Payer.push(Payer);
					raif.Payee.push(Payee);
				} else if (destinationField == 'EOF' ){
					var errMsg = '';
					errMsg = insertFile(param, 'Request',	raif.Request,	fieldsRequest,	mappingFieldType);
					errMsg = insertFile(param, 'File',		raif.File,		fieldsFile,		mappingFieldType);
					errMsg = insertFile(param, 'PayDocRu',	raif.PayDocRu,	fieldsPayDocRu, mappingFieldType);
					errMsg = insertFile(param, 'AccDoc',	raif.AccDoc,	fieldsAccDoc,	mappingFieldType);
					errMsg = insertFile(param, 'Payer', 	raif.Payer, 	fieldsPayer,	mappingFieldType);
					errMsg = insertFile(param, 'Payee', 	raif.Payee, 	fieldsPayee,	mappingFieldType);
				} 
			} else{
				
			}
			
		});
	} catch (e) {
	    $.trace.error(e.toString());
		throw e;
	}	
		
	
}

function po_create_v2(param) {
	var rs = null;
		var raif = {};
		var requestID = guid();
		var docExtID = guid();
		var mappingField		= new Map();
		var mappingEntity		= new Map();
		var mappingFieldType	= new Map();
		var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\",\"FIELDTYPE\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
		rs = null;
		rs = pStmt.executeQuery();
		
		var fieldsRequest	= [];
		var fieldsPayDocRu	= [];
		var fieldsAccDoc	= [];
		var fieldsPayer 	= [];
		var fieldsPayee		= [];
		var fieldsFile		= [];
		
		raif.mapping = new Map();
		var mappingEtity = '';
		
		while (rs.next()) {
			var entityDestination = rs.getString(1);
			if (mappingEtity == null || mappingEtity == '') {
				mappingEtity = entityDestination;
				var mapping = [];
			}else if(mappingEtity != entityDestination){
				raif.mapping.set(mappingEtity, mapping)
				mappingEtity = entityDestination;
				var mapping = [];
			}
			
			var fieldOptions = {};
			var fildSource = rs.getString(2);
			var fieldDestination = rs.getString(3);
			var fildDestinationType = rs.getString(4);
			
			fieldOptions.fildSource = fildSource;
			fieldOptions.fieldDestination = fieldDestination;
			fieldOptions.fildDestinationType = fildDestinationType;
			mapping.push(fieldOptions);
		}
}


