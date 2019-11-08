// try {
// 	var H2HMapping = new Map();
// 	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\"");
// 	var rs = null;
// 	rs = pStmt.executeQuery();
// 	while (rs.next()) {
// 		var fildSource = rs.getString(1);
// 		var fieldDestination = rs.getString(2);
// 		H2HMapping.set(fildSource, fieldDestination);
// 	}

// 	 $.response.setBody('Good!');
// } catch (e) {
// 	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
//     $.response.setBody(e.toString());
// }

// class raif{
// 	constructor(requestId, docExtId) {
// 	    this.requestId = requestId;
// 	    this.docExtId = docExtId;
// 	  }
// }

// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//     s4() + '-' + s4() + s4() + s4();
// }

// var raif = new raif(guid(), guid());
// $.response.setBody('Good!');

var rs = null;

var mappingField = new Map();
var mappingEntity = new Map();
var conn = $.db.getConnection();
var pStmt = conn.prepareStatement(
	"Select \"ENTITYNAME\",\"FILDSOURCE\",\"FIELDDESTINATION\" From \"H2H.Mapping\" Where \"BANKTYPE\" = 'RAIF' and \"FORMATTYPE\" = 'PO'");
rs = null;
rs = pStmt.executeQuery();
while (rs.next()) {
	var entityDestination = rs.getString(1);
	var fildSource = rs.getString(2);
	var fieldDestination = rs.getString(3);
	mappingField.set(fildSource, fieldDestination);
	mappingEntity.set(fieldDestination, entityDestination);
}

$.response.setBody(mappingField['Дата']);