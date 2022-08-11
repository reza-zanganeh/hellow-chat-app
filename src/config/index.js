const envMode = process.env.mode || process.env.MODE || "local"
const projectConfig = require(`./${envMode}.js`)
module.exports = projectConfig
