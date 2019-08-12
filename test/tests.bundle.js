var ctx = require.context('.', true, /.+\.test\.js?$/);
require.context('.', true, /.+\.test\.js?$/).keys().forEach(ctx);
module.exports = ctx;