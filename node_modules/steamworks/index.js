var steamworks;

if(process.arch == "x64")
    steamworks = require('./steamworks-binding-x64.node');
else
    steamworks = require('./steamworks-binding-ia32.node');

module.exports = steamworks;