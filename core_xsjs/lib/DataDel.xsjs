// try {
// 	var H2HMapping = new Map();
	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\"");
// 	var rs = null;
// 	rs = pStmt.executeQuery();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TRequest\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.THistory\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TFile\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TPayDocRu\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TAccDoc\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TPayer\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TPayee\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TDepartmentalInfo\"");
pStmt.executeUpdate();

pStmt = conn.prepareStatement("delete from \"RaiffeisenBank.TSign\"");
pStmt.executeUpdate();

conn.commit();
pStmt.close();

var now = new Date();
$.response.status = $.net.http.INTERNAL_SERVER_ERROR; 
$.response.contentType = "text/html";
$.response.setBody(now); 