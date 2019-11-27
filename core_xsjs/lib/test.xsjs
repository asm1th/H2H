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

// 	var conn = $.db.getConnection();
// 	var pStmt = conn.prepareStatement("Select \"VALUE\" From \"RaiffeisenBank.TSign\" Where \"DOCEXTID\"='06296e2b-6b0e-5759-683a-eb5d7b214989'");
// 	var rs = null;
// 	rs = pStmt.executeQuery();
// 	while (rs.next()) {
// 		var array = new Uint8Array(rs.getBlob(1));
// 		var encodedString = String.fromCharCode.apply(null,array),
// 				decodedString = decodeURIComponent(escape(encodedString));
// 				content = decodedString;
// 	}
// 	rs.close();
	
// 	// var test = new $.util.codec.encodeBase64(content);
// 	// encodedString = String.fromCharCode.apply(null,array),
// 	// decodedString = decodeURIComponent(escape(encodedString));
// 	// content = decodedString;
	
// $.response.status = $.net.http.OK;
// $.response.contentType = "text/plain";
// $.response.setBody(content);


  
/*eslint no-console: 0, no-unused-vars: 0, no-shadow:0, quotes: 0*/
//create a new $.util.SAXParser object

//parse XML from String
// var xmlDocument = new $.require("xmldoc").XmlDocument;

// var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
//           '<!-- this is a note -->\n'+
//           '<note noteName="NoteName">'+
//               '<to>To</to>'+
//               '<from>From</from>'+
//               '<heading>Note heading</heading>'+
//               '<body>Note body</body>'+
//           '</note>';
// var body = "";           
// var note = new xmlDocument(xml);
// note.eachChild(function(item){
//   body += item.val + '</br>';	
// });

var now = new Date();
$.response.status = $.net.http.INTERNAL_SERVER_ERROR; 
$.response.contentType = "text/html";
$.response.setBody(now); 