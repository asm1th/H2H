console.log('Custom router started!!!')
var approuter = require('@sap/approuter');

var ar = approuter();

ar.beforeRequestHandler.use('/', function myMiddleware(req, res, next) {
  res.setHeader('x_my_ext', 'passed');
  next();
});

ar.start();