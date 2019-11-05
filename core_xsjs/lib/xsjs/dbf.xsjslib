function paydocru_create(param) {
/* 
	try {
		$.trace.error("Insert");
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		rs = pStmt.executeQuery();
		var partnerId = 0;
		$.trace.error("Before Read Partner");
		while (rs.next()) {
			//	partnerId = rs.getInteger(7);
			$.trace.error("Partner ID: " + partnerId);
		}
		pStmt.close();

		pStmt = param.connection.prepareStatement(
			"INSERT INTO \"PurchaseOrder.Header\" " +
			"(\"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDAT\", \"HISTORY.CREATEDBY\", \"HISTORY.CHANGEDBY\", PARTNER, " +
			" NOTEID, CURRENCY, GROSSAMOUNT, NETAMOUNT, TAXAMOUNT, LIFECYCLESTATUS, APPROVALSTATUS, CONFIRMSTATUS, ORDERINGSTATUS, INVOICINGSTATUS ) " +
			"values(now(), now(), null, null, '100000000', null, 'EUR', 100, 100, 100, 'N', 'I', 'I', 'I', 'I' )"
		);

	//	pStmt.setString(1, "100000000");

		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
			$.trace.error(e.toString());
		throw e;
	}*/

	
	try {
	    // var requestId = '';
	    // var docExtId = param.docExtId;
	    
		$.trace.error("InsertPayDocRu");
		var after = param.afterTableName;
	    var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		rs = pStmt.executeQuery();
		while (rs.next()) {
			var requestId = rs.getString(1);
			var docExtId = rs.getString(2);
			//$.trace.error("Partner ID: " + rs.getString('requestId'));
			//$.trace.error("Partner ID: " + rs.getString(2));
		}
		pStmt.close();
	    
	/*    
	    var sql = 'INSERT INTO "RaiffeisenBank.PayDocRu" (requestId, docExtId) VALUES (?, ?)';
		pStmt = param.connection.prepareStatement(sql);
		pstmt.setString(1, param.requestId);
		pstmt.setString(2, param.docExtId);
	    pStmt.execute();
	    //pStmt.executeUpdate();
		pStmt.close();
		*/
	    
	} catch (e) {
	    $.trace.error(e.toString());
		throw e;
	}	
		
	
}