const { app, dialog } = require('electron');
const util = require("util");
const fs = require('fs');
const db = require('../db');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const serviceFunctions = {
  getDatabasePath: function() {
    return app.getPath('userData')+"/db.json";
  },
  importDatabaseFile: async function() {
    var files = await dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });

    if(files) {
      try {
        let content = await readFile(files[0], 'utf-8');
        await writeFile(this.getDatabasePath(), content);
      } catch(error) {
        throw error;
      }
    }

    return db.read();
  },
  getMarketUpdates: function() {
    return db.get('market_updates').value();
  },
  getGeneralData: function() {
    var result = {
      total_invested: 0.00,
      total_investment_value: 0.00,
      per_profit: 0.00,
      cur_profit: 0.00
    };
    var assets;
    var totalAssets = 0;
  
    assets = db.get('assets')
      .value();
  
    assets.forEach(asset => {
      totalAssets++;
  
      result.total_invested += asset.invested;
      result.total_investment_value += asset.investment_value;
      result.per_profit += asset.per_profit;
      result.cur_profit += asset.cur_profit;
    });
  
    result.per_profit = totalAssets != 0 ? (result.per_profit / totalAssets) : 0.00;

    result.total_invested = result.total_invested;
    result.total_investment_value = result.total_investment_value;
    result.per_profit = result.per_profit;
    result.cur_profit = result.cur_profit;
  
    return result;
  },
  getAllAssets: function() {
    return db.get('assets').value();
  },
  getTopAssets: function() {
    return db.get('assets')
      .sortBy('invested')
      .take(5)
      .value()
      .reverse();
  },
  getAsset: function(assetId) {
    return db.get('assets')
      .find({ id: parseInt(assetId) })
      .value();
  },
  addAsset: function(asset) {
    db.update('assets_count', n => n + 1)
      .write();
    asset.id = db.get('assets_count').value();

    return db.get('assets')
      .push(asset)
      .write();
  },
  editAsset: function(assetId, assetName) {
    db.get('assets')
      .find({ id: parseInt(assetId) })
      .assign({ name: assetName })
      .write();
    
    return this.getAllAssets();
  },
  deleteAsset: function(assetId) {
    db.get('assets')
      .remove({ id: parseInt(assetId) })
      .write();
    
    return this.getAllAssets();
  },
  updateAssetInvestment: function(assetId) {
    investmentValue = 0;
    asset = this.getAsset(assetId);

    investmentValue = asset.quantity * asset.market_price;

    db.get('assets')
      .find({ id: parseInt(asset.id) })
      .assign({
        investment_value: parseFloat(investmentValue)
      })
      .write();
  },
  updateAssetInvested: function(assetId) {
    var averageUnityPrice = 0;
    var invested = 0;
    var quantity = 0;
    
    asset = this.getAsset(assetId);

    // Adds buys to invested value
    asset.operations.forEach(operation => {
      if(operation.type == 'B') {
        operationValue = operation.quantity * operation.price;
        invested += operationValue;
        quantity += operation.quantity;
      }
    });

    // Get average price per unity
    averageUnityPrice = invested / quantity;

    // Subtracts sells of invested value
    asset.operations.forEach(operation => {
      if(operation.type == 'S') {
        operationValue = operation.quantity * averageUnityPrice;
        invested -= operationValue;
        quantity -= operation.quantity;
      }
    });

    db.get('assets')
      .find({ id: parseInt(asset.id) })
      .assign({
        invested: parseFloat(invested),
        quantity: parseFloat(quantity)
      })
      .write();
  },
  updateAssetProfit: function(assetId, marketPrice) {
    var asset, totalInvested, totalMarketValue, perProfit, curProfit, lastUpdate;

    if(marketPrice) {
      db.get('assets')
        .find({ id: parseInt(assetId) })
        .assign({ market_price: marketPrice })
        .write();
    }

    asset = this.getAsset(assetId);

    if(asset.market_price) {
      totalInvested = asset.invested;
      totalMarketValue = asset.quantity * asset.market_price;
      perProfit = totalInvested > 0 ? ((totalMarketValue * 100 / totalInvested) - 100) : 0;
      curProfit = totalMarketValue - totalInvested;

      lastUpdate = new Date;
      lastUpdate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());

      db.get('assets')
        .find({ id: parseInt(assetId) })
        .assign({
          investment_value: parseFloat((totalInvested + curProfit)),
          per_profit: parseFloat(perProfit),
          cur_profit: parseFloat(curProfit),
          last_update: lastUpdate })
        .write();
      
      this.addMarketUpdate();
    }
  },
  getAllOperations: function() {
    assets = this.getAllAssets();
    operations = [];

    assets.forEach(asset => {
      asset.operations.forEach(operation => {
        operation.asset_name = asset.name;
        operations.push(operation);
      });
    });

    return operations;
  },
  getOperation: function(assetId, operationId) {
    return db.get('assets')
      .find({ id: parseInt(assetId) })
      .get('operations')
      .find({ id: parseInt(operationId) })
      .value();
  },
  addOperation: function(assetId, operation) {
    var operations = db.get('assets')
      .find({ id: parseInt(assetId) })
      .get('operations')
      .value();

    operation.id = db.get('assets')
      .find({ id: parseInt(assetId) })
      .get('operations_count')
      .value() + 1;

    operations.push(operation);
    db.get('assets')
      .find({ id: assetId })
      .assign({ operations })
      .write();
    
    db.get('assets')
      .find({ id: parseInt(assetId) })
      .update('operations_count', n => n + 1)
      .write();

    this.updateAssetInvested(assetId);

    if(operation.type == 'B') {
      this.updateAssetProfit(assetId, operation.price);
    } else {
      this.updateAssetProfit(assetId);
    }

    this.updateAssetInvestment(assetId);

    return this.getAsset(assetId);
  },
  deleteOperation: function(assetId, operationId) {
    db.get('assets')
      .find({ id: parseInt(assetId) })
      .get('operations')
      .remove({ id: parseInt(operationId) })
      .write();
    
    this.updateAssetInvested(assetId);
    this.updateAssetProfit(assetId);
    this.updateAssetInvestment(assetId);

    return this.getAsset(assetId);
  },
  addMarketUpdate: function() {
    var marketUpdate = {
      total_invested: null,
      per_profit: null,
      cur_profit: null,
      date: null
    };
    var assets;
    var totalAssets = 0;
    const currentDate = new Date();
  
    assets = db.get('assets')
      .value();
  
    assets.forEach(asset => {
      totalAssets++;
  
      marketUpdate.total_invested += asset.invested;
      marketUpdate.per_profit += asset.per_profit;
      marketUpdate.cur_profit += asset.cur_profit;
    });
  
    marketUpdate.per_profit = marketUpdate.per_profit / totalAssets;
    marketUpdate.date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
    if(db.get('market_updates').find({ date: marketUpdate.date }).value()) {
      db.get('market_updates')
        .find({ date: marketUpdate.date })
        .assign(marketUpdate)
        .write();
    } else {
      db.get('market_updates')
        .push(marketUpdate)
        .write();
    }
  }
}

module.exports = serviceFunctions;