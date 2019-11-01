try {
    var requestId = $.request.parameters.get("requestId");
    var docExtId = $.request.parameters.get("docExtId");
    $.response.setBody(docExtId);
} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody('!!!!!!!');
    //$.response.setBody(e.message);
}