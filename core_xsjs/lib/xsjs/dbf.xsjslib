
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function request_create(param) {
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
		while (rs.next()) {
			var entityDestination = rs.getString(1);
			var fildSource = rs.getString(2);
			var fieldDestination = rs.getString(3);
			mappingField.set(fildSource, fieldDestination);
			mappingEntity.set(fieldDestination, entityDestination);
		}
		
		var after = param.afterTableName;
	    var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	    rs = null;
		rs = pStmt.executeQuery();
		var sourceFile = null;
		while (rs.next()) {
			var requestId = rs.getString(3);
			var array = new Uint8Array(rs.getBlob(5));
			var encodedString = String.fromCharCode.apply(null,array),
				decodedString = decodeURIComponent(escape(encodedString));
				content = decodedString;
			sourceFile = $.util.codec.encodeBase64(rs.getBlob(5));
			var fileRows = content.split(/\r\n|\n/);
		}
		pStmt.close();
		raif.Request = {};
		raif.Request.BANK = 'RAIF';
		raif.Request.XMLNS = 'http://bssys.com/upg/request';
		raif.Request.REQUESTID = requestID;
		raif.Request.VERSION = '0.1';
		raif.Request.FILE = sourceFile;
		
		pStmt = param.connection.prepareStatement("INSERT INTO \"RaiffeisenBank.TRequest\" VALUES(?, ?, ?, ?, ?)")
		pStmt.setString(1, raif.Request.BANK);
		pStmt.setString(2, raif.Request.XMLNS);
		pStmt.setString(3, raif.Request.REQUESTID);
		pStmt.setString(4, raif.Request.VERSION);
		pStmt.setString(5, raif.Request.FILE);
		pStmt.execute();
		pStmt.close();
		
		fileRows.forEach(function(row, i, fileRows){
			var sourceRow = row.split('=');
			var sourceField = sourceRow[0];
			var sourceValue = sourceRow[1];
			if (sourceValue != null) {
				var destinationField = mappingField.get(sourceRow[0]);
				var destinationEntity = mappingEntity.get(destinationField);
			} else {
				
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