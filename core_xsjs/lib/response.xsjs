
function historyAdd(conn, docExtId, action, status, description){
	var now = new Date();
	sql = 'INSERT INTO "RaiffeisenBank.THistory" (DOCEXTID,TIMESTAMP,ACTION,STATUS,DESCRIPTION) VALUES(?,?,?,?,?)';
	var pStmt = conn.prepareStatement(sql);
	pStmt.setString(1,docExtId);
	pStmt.setTimestamp(2,now);
	pStmt.setString(3,action);
	pStmt.setString(4,status);
	pStmt.setString(5,description);
	pStmt.execute();
	conn.commit();
	pStmt.close();
}

function changeStatus(conn, docExtId, status){
	var pStmt = conn.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + docExtId + "'");
	var statusInt = 0
	switch (status) {
		case 'DELIVERED':			statusInt = 6; break;
		case 'ACCEPTED':			statusInt = 7; break;
		case 'INVALIDEDS':			statusInt = 11; break;
		case 'REQUISITE_ERROR': 	statusInt = 10; break;
		case 'DECLINED_BY_ABS':		statusInt = 9; break;
		case 'RECALL':				statusInt = 12; break;
		case 'DECLINED_BY_BANK': 	statusInt = 13; break;
		case 'IMPLEMENTED':			statusInt = 8; break;
	}
	if (statusInt > 0) {
		pStmt.setInt(1, statusInt);
		pStmt.execute();
	}
	conn.commit();
	pStmt.close();
}

var conn = $.db.getConnection();
var json_response = JSON.parse($.request.body.asString());
var docExtId = json_response.root.docExtId;
var status = json_response.root.statusStateCode;
var msg = json_response.root.message;
var cnt = 0;

if(msg == ''){
	switch (status) {
		case 'DELIVERED':			msg = 'Доставлен'; break;
		case 'ACCEPTED':			msg = 'Принят АБС'; break;
		case 'IMPLEMENTED':			msg = 'Исполнен'; break;
	}
}

pStmt = conn.prepareStatement("Select Count(*) FROM \"RaiffeisenBank.TAccDoc\" Where \"DOCEXTID\"='" + docExtId + "'");
var rs = pStmt.executeQuery();
while (rs.next()) {
	cnt = rs.getInt(1);
}
pStmt.close();

if(cnt > 0){
	historyAdd(conn, docExtId, 'Получение', status, msg);
	changeStatus(conn, docExtId, status)
}

$.response.status = $.net.http.OK;
$.response.contentType = "text/plain";
$.response.setBody('Good');

	// var pStmt = conn.prepareStatement("select * from \"" + after + "\"");
	// var rs = pStmt.executeQuery();
	// while (rs.next()) {
	// 	docExtId	= 		rs.getString(1);
 //   	status 		=		rs.getString(2);
 //   	description	=		rs.getString(3);
	// }
	// pStmt.close();
	
	// historyAdd(conn, docExtId, 'Отправка', 'success', 'Доставлен');
	// historyAdd(conn, docExtId, 'Отправка', 'success', 'Принят АБС');
	
	
	// try {
	// 		pStmt = conn.prepareStatement("Update \"RaiffeisenBank.TPayDocRu\" set \"STATUS\" = ? Where \"DOCEXTID\"='" + docExtId + "'");
	// 	    pStmt.setInt(1, 8);
	// 	    pStmt.execute();
	// 	    pStmt.close();
	// 	    historyAdd(conn, docExtId, 'Отправка', 'success', 'Исполнен');
	// 	} catch (err) {
	// 		pStmt.close();
	// 	}