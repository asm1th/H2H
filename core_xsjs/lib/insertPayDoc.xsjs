try {
    var requestId = $.request.parameters.get("requestId");
    var docExtId = $.request.parameters.get("docExtId");
} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(e.message);
}