const serverless = require('serverless-http');

// Netlify packages the function with included_files. The function's working
// directory is the app root, so Pug templates and public assets resolve there.
process.env.APP_ROOT = process.cwd();

const app = require('../../app');

exports.handler = serverless(app);
