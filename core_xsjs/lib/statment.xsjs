$.import("xsjs", "dbf");
var xml2js = $.require('xml2js');
var dbf = $.xsjs.dbf;
var json = JSON.parse($.request.body.asString());
var array = new Uint8Array($.util.codec.decodeBase64(json.root.fileBody))
var content = dbf.binToString(array);
var decodedString = decodeURIComponent(escape(content));
var fileBody = json.root.fileBody;

createStatment(param, docType, fileName, fileType, fileSize, fileBody, decodedString);
