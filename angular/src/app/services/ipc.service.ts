import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { Asset } from 'src/app/models/asset.interface';
import { Operation } from 'src/app/models/operation.interface';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor(
    private electronService: ElectronService
  ) { }


  /* GENERAL */

  // Get all days with market price updates
  getMarketUpdates() {
    var marketUpdates = this.electronService.ipcRenderer.sendSync('get-market-updates');

    marketUpdates.forEach(marketUpdate => {
      marketUpdate.date = new Date(marketUpdate.date).toLocaleDateString();
    });

    return marketUpdates;
  }

  // Get total invested, investment value (by updated market prices) and current profit in percentage and currency
  getGeneralData() {
    var generalData = this.electronService.ipcRenderer.sendSync('get-general-data');

    return generalData;
  }

  /* ASSETS */

  // Get all assets
  getAllAssets() {
    var assets: Asset[];
    assets = this.electronService.ipcRenderer.sendSync('get-all-assets');
    
    return assets;
  }

  // Get top 5 assets by investment
  getTopAssets() {
    var assets: Asset[];
    assets = this.electronService.ipcRenderer.sendSync('get-top-assets');

    return assets;
  }

  // Get asset by id
  getAsset(id: Number) {
    var asset: Asset;
    asset = this.electronService.ipcRenderer.sendSync('get-asset', id);
    asset.operations.sort((a, b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return asset;
  }

  // Create new asset with provided name
  addAsset(assetName: string) {
    var assets: Asset[];
    var asset: Asset = {
      id: null,
      name: assetName,
      invested: 0.00,
      investment_value: 0.00,
      quantity: 0,
      market_price: 0,
      per_profit: 0.00,
      cur_profit: 0.00,
      last_update: null,
      operations: [],
      operations_count: 0
    };
    
    assets = this.electronService.ipcRenderer.sendSync('add-asset', asset);

    return assets;
  }

  // Edit asset name
  editAsset(assetId: Number, assetName: string) {
    var assets: Asset[];
    const request = {
      assetId,
      assetName
    };

    assets = this.electronService.ipcRenderer.sendSync('edit-asset', request);

    return assets;
  }

  // Delete asset
  deleteAsset(assetId: Number) {
    var assets: Asset[] = this.electronService.ipcRenderer.sendSync('delete-asset', assetId);

    return assets;
  }

  // Update current profit of asset by market price
  updateAssetProfit(assetId: Number, marketPrice: Number) {
    const request = {
      assetId,
      marketPrice
    };
    this.electronService.ipcRenderer.send('update-asset-profit', request);
  }

  /* OPERATIONS */

  // Get all operations from all assets
  getAllOperations() {
    return this.electronService.ipcRenderer.sendSync('get-all-operations');
  }

  // Get operation by asset and operation id
  getOperation(assetId: Number, operationId: Number) {
    var operation: Operation;
    const request = {
      assetId,
      operationId
    }
    operation = this.electronService.ipcRenderer.sendSync('get-operation', request);
    
    return operation;
  }

  // Add operation to asset
  addOperation(assetId: Number, data) {
    var asset: Asset;
    var operation: Operation = {
      id: null,
      type: data.type,
      quantity: data.quantity,
      price: data.price,
      date: data.date
    };
    const request = {
      assetId: assetId,
      operation: operation
    };

    asset = this.electronService.ipcRenderer.sendSync('add-operation', request);

    return asset;
  }

  // Delete operation by asset and id
  deleteOperation(assetId: Number, operationId: Number) {
    var asset: Asset;
    const request = {
      assetId,
      operationId
    }

    asset = this.electronService.ipcRenderer.sendSync('delete-operation', request);

    return asset;
  }
}