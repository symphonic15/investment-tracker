const { app } = require('electron');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(app.getPath('userData')+"/db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ assets: [], market_updates: [], assets_count: 0 })
  .write();

module.exports = db