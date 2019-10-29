var conn = $.db.getConnection();
var sql = 'SELECT "fildSource","fieldDestination" FROM "H2H.Mapping" WHERE "bankType" = \'RAIF\' AND "formatType" = \'PO\'';
var stmt = conn.prepareStatement(sql);
var rs = stmt.executeQuery();
var data = [];

/*while (rs.next()) {
	var vals = {}; // this is the moved line of code...
	vals.fildSource = rs.getString(1);
    vals.fieldDestination  = rs.getString(2);
	data.push(vals);
	$.response.status = $.net.http.OK;
    }
$.response.setBody(JSON.stringify(data));*/
var H2H_Mapping = new Map();
while (rs.next()) {

	H2H_Mapping.set(rs.getString(1), rs.getString(2))
}
$.response.setBody(H2H_Mapping.size);

stmt.close();
