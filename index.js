const app = require('./api/index');
const serverless = require('serverless-http');

// Export the app for lambda
module.exports.handler = serverless(app);