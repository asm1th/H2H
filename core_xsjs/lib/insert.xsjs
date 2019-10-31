try {
    var bank = 'RAIF';
    var xmlns = 'http://bssys.com/upg/request';
    var requestId = 'ae059298-e102-1ee9-a8ae-7595552d079a'//$.request.parameters.get("uuid");
    var version = '0.1';/H2H/core_xsjs (Run script start)/H2H/core_xsjs (Run script start)
    var fileName = $.request.parameters.get("filename");
} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(e.message);
}

var output = {};
output.data = [];

try {
    var conn = $.db.getConnection();
    //var sql = 'INSERT INTO "RaiffeisenBank.Request" (bank, xmlns, requestId, version, file) VALUES (?, ?, ?, ?, ?)';
	//var pstmt = conn.prepareStatement(sql);
    if ($.request.entities.length > 0) {
        //  Read in the posted image or binary data as an Array Buffer - you can use this to save as a BLOB
        var fileBody = $.request.entities[0].body.asArrayBuffer();
        /*pstmt.setInteger(1, bank);
        pstmt.setInteger(2, xmlns);
        pstmt.setInteger(3, requestId);
        pstmt.setInteger(4, version);
        pstmt.setBlob(5, fileBody); // Set the Blob as the array buffer that has the image data
        pstmt.setString(5, fileName);
        pstmt.executeQuery();*/
        conn.commit();
        $.response.setBody(0);
        conn.close();
        $.response.contentType = "text/html";
        $.response.setBody("[200]:Upload for file" + fileName + " was successful!");
    } else {
        $.response.setBody("No Entries in request");
    }
} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(1);
}