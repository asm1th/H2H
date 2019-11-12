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
// document.createElement('pre');
// document['createElement']('pre');
// var raif = {};
// raif.PayDocRu = [];
// var PayDocRu = new Map();
// PayDocRu.set('Test', '123');
// raif.PayDocRu.push(PayDocRu);
// var PayDocRu = new Map();
// PayDocRu.set('Test', '124');
// raif.PayDocRu.push(PayDocRu);
// PayDocRu.set('Test', '125');
// var PayDocRu = {};
// PayDocRu['REQUESTID'] = '123';
// PayDocRu['DOCEXTID'] = '456';
// raif.PayDocRu.push(PayDocRu);
// PayDocRu['REQUESTID'] = '567';
// PayDocRu['DOCEXTID'] = '890';
// raif.PayDocRu.push(PayDocRu);

	var conn = $.db.getConnection();
	var pStmt = conn.prepareStatement("Select \"FILE\" From \"RaiffeisenBank.TRequest\"");
	var rs = null;
	rs = pStmt.executeQuery();
	while (rs.next()) {
		var array = new Uint8Array(rs.getBlob(1));
		sourceFile = $.util.codec.decodeBase64(array);
	}

