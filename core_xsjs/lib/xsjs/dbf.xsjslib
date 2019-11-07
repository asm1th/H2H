function request_create(param) {
	try {
		var rs = null;
		
		var H2HMapping = new Map();
		var pStmt = param.connection.prepareStatement("Select \"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
		rs = null;
		rs = pStmt.executeQuery();
		while (rs.next()) {
			var fildSource = rs.getString(1);
			var fieldDestination = rs.getString(2);
			H2HMapping.set(fildSource, fieldDestination);
		}
		
		var after = param.afterTableName;
	    var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	    rs = null;
		rs = pStmt.executeQuery();
		
		while (rs.next()) {
			var requestId = rs.getString(3);
			var array = new Uint8Array(rs.getBlob(5));
			var encodedString = String.fromCharCode.apply(null,array),
				decodedString = decodeURIComponent(escape(encodedString));
				content = decodedString;
			var fileRows = content.split(/\r\n|\n/);
			
			
			//$.trace.error("Partner ID: " + rs.getString('requestId'));
			//$.trace.error("Partner ID: " + rs.getString(2));
		}
		pStmt.close();
		
		// var vFile = getBase64(file);
	    
   
	    var sql = 'INSERT INTO "RaiffeisenBank.PayDocRu" VALUES (?, ?)';
		pStmt = param.connection.prepareStatement(sql);
		pStmt.setString(1, '123');
		pStmt.setString(2, '456');
	    pStmt.execute();
	    //pStmt.executeUpdate();
		pStmt.close();
	    
	} catch (e) {
	    $.trace.error(e.toString());
		throw e;
	}	
		
	
}