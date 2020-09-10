$.import("xsjs", "dbf");
var xml2js = $.require('xml2js');
var dbf = $.xsjs.dbf;
var json = JSON.parse($.request.body.asString());
var array = new Uint8Array($.util.codec.decodeBase64(json.root.fileBody))
var content = dbf.binToString(array);
var decodedString = decodeURIComponent(escape(content));
var fileBody = json.root.fileBody;

try {
	dbf.createStatment($.db.getConnection(), json.root.docType, json.root.fileName, json.root.fileType, json.root.fileSize, fileBody, decodedString);
	$.response.contentType = "text/plain";
	$.response.setBody('SUCCESS');
	$.response.status = $.net.http.OK;
} catch (err) {
	$.response.contentType = "text/plain";
	$.response.setBody('ERROR');
	$.response.status = $.net.http.BAD_REQUEST;
}

