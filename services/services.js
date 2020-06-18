const { ipcMain } = require('electron');
const serviceFunctions = require('./functions');

/* FILES */

// Get user database path
ipcMain.on('get-database-path', (event) => {
  event.returnValue = serviceFunctions.getDatabasePath();
});

// Replace database
ipcMain.on('import-database', async (event) => {
  await serviceFunctions.importDatabaseFile();
  event.returnValue = null;
});

/* GENERAL */

// Get all realized market updates
ipcMain.on('get-market-updates', (event) => {
  event.returnValue = serviceFunctions.getMarketUpdates();
});

// Get general info
ipcMain.on('get-general-data', (event) => {
  event.returnValue = serviceFunctions.getGeneralData();
});

/* ASSETS */

// Get all assets
ipcMain.on('get-all-assets', (event) => {
  event.returnValue = serviceFunctions.getAllAssets();
});

// Get 5 most invested assets
ipcMain.on('get-top-assets', (event) => {
  event.returnValue = serviceFunctions.getTopAssets();
});

// Get asset by id
ipcMain.on('get-asset', (event, assetId) => {
  event.returnValue = serviceFunctions.getAsset(assetId);
});

// Add asset
ipcMain.on('add-asset', (event, asset) => {
  event.returnValue = serviceFunctions.addAsset(asset);
});

// Edit asset
ipcMain.on('edit-asset', (event, data) => {
  event.returnValue = serviceFunctions.editAsset(data.assetId, data.assetName);
});

// Delete asset
ipcMain.on('delete-asset', (event, assetId) => {
  event.returnValue =  serviceFunctions.deleteAsset(assetId);
});

// Update asset invested
ipcMain.on('update-asset-invested', (assetId) => {
  serviceFunctions.updateAssetInvested(assetId);
});

// Update asset profit
ipcMain.on('update-asset-profit', (event, data) => {
  serviceFunctions.updateAssetProfit(data.assetId, data.marketPrice);
});

/* OPERATIONS */

// Get all operations with extra attribute "asset_name"
ipcMain.on('get-all-operations', (event) => {
  event.returnValue = serviceFunctions.getAllOperations();
});

// Get operation by asset id and operation id
ipcMain.on('get-operation', (event, data) => {
  event.returnValue = serviceFunctions.getOperation(data.assetId, data.operationId);
});

// Add operation to asset
ipcMain.on('add-operation', (event, data) => {
  event.returnValue = serviceFunctions.addOperation(data.assetId, data.operation);
});

// Delete operation
ipcMain.on('delete-operation', (event, data) => {
  event.returnValue = serviceFunctions.deleteOperation(data.assetId, data.operationId);
});

/* MARKET UPDATES */
ipcMain.on('add-market-update', () => {
  serviceFunctions.addMarketUpdate();
});

ipcMain.on('clear-market-updates', (event) => {
  event.returnValue = serviceFunctions.clearMarketUpdates();
});