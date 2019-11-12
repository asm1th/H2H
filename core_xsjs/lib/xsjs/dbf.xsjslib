function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function po_create(param) {
	try {
		var rs = null;
		var raif = {};
		var requestID = guid();
		var docExtID = guid();
		var mappingField = new Map();
		var mappingEntity = new Map();
		var pStmt = param.connection.prepareStatement("Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
		rs = null;
		rs = pStmt.executeQuery();
		
		var fieldsRequest = [];
		var fieldsPayDocRu = [];
		var fieldsAccDoc = [];
		var fieldsPayer = [];
		var fieldsPayee = [];
		while (rs.next()) {
			var entityDestination = rs.getString(1);
			var fildSource = rs.getString(2);
			var fieldDestination = rs.getString(3);
			mappingField.set(fildSource, fieldDestination);
			mappingEntity.set(fildSource, entityDestination);
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
				// default:
			}
		}
		
		var after = param.afterTableName;
	    var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	    rs = null;
		rs = pStmt.executeQuery();
		var sourceFile = null;
		while (rs.next()) {
			//var requestId = rs.getString(3);
			var array = new Uint8Array(rs.getBlob(5));
			var encodedString = String.fromCharCode.apply(null,array),
				decodedString = decodeURIComponent(escape(encodedString));
				content = decodedString;
			sourceFile = $.util.codec.encodeBase64(rs.getBlob(5));
			var fileRows = content.split(/\r\n|\n/);
		}
		pStmt.close();
		
		raif.Request = [];
		Request = new Map();
		Request.set('BANK','RAIF');
		Request.set('XMLNS','http://bssys.com/upg/request');
		Request.set('REQUESTID',requestID);
		Request.set('VERSION','0.1');
		Request.set('FILE', sourceFile);
		raif.Request.push(Request);
		
		raif.File = [];
		File.set('REQUESTID', requestID);
		File.set('FILE', sourceFile);
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
					pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TRequest\" (" + fieldsRequest.toString() +") VALUES(?, ?, ?, ?, ?)");
					fieldsRequest.forEach(function(field, i, fieldsRequest){ pStmt.setString(i+1, raif.Request[0].get(field)); });
					pStmt.execute();
					pStmt.close();	
					
					pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TPayDocRu\" (" + fieldsPayDocRu.toString() +") VALUES(?, ?)");
					fieldsPayDocRu.forEach(function(field, i, fieldsPayDocRu){ pStmt.setString(i+1, raif.PayDocRu[0].get(field));	});
					pStmt.execute();
					pStmt.close();
					
					pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TAccDoc\" (" + fieldsAccDoc.toString() +") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
					fieldsAccDoc.forEach(function(field, i, fieldsAccDoc){ pStmt.setString(i+1, raif.AccDoc[0].get(field));	});
					pStmt.execute();
					pStmt.close();
					
					pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TPayer\" (" + fieldsPayer.toString() +") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
					fieldsPayer.forEach(function(field, i, fieldsPayer){ pStmt.setString(i+1, raif.Payer[0].get(field));	});
					pStmt.execute();
					pStmt.close();
					
					pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TPayee\" (" + fieldsPayee.toString() +") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
					fieldsPayee.forEach(function(field, i, fieldsPayee){ pStmt.setString(i+1, raif.Payee[0].get(field));	});
					pStmt.execute();
					pStmt.close();
					
				} 
			} else{
				
			}
			
		});

	 //   var sql = 'INSERT INTO "RaiffeisenBank.PayDocRu" VALUES (?, ?)';
		// pStmt = param.connection.prepareStatement(sql);
		// pStmt.setString(1, '123');
		// pStmt.setString(2, '456');
	 //   pStmt.execute();
	 //   //pStmt.executeUpdate();
		// pStmt.close();
	} catch (e) {
	    $.trace.error(e.toString());
		throw e;
	}	
		
	
}