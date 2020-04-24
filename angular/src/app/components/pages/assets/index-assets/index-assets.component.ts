import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IpcService } from 'src/app/services/ipc.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

import { Asset } from 'src/app/models/asset.interface';

@Component({
  selector: 'app-index-assets',
  templateUrl: './index-assets.component.html',
  styleUrls: ['./index-assets.component.css']
})
export class IndexAssetsComponent implements OnInit {
  assets: Asset[];
  generalData;

  // Modal values
  assetName: string;
  marketPriceInput: FormControl;
  assetNameInput: FormControl;

  constructor(
    private modalService: NgbModal,
    private ipcService: IpcService,
    private eventEmitterService: EventEmitterService
  ) {
    this.assets = this.ipcService.getAllAssets();
    this.generalData = this.ipcService.getGeneralData();

    this.marketPriceInput = new FormControl('', [Validators.required]);
    this.assetNameInput = new FormControl('', [Validators.required]);
  }

  ngOnInit() {}

  openAddModal(content) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.assets = this.ipcService.addAsset(this.assetNameInput.value);
      this.eventEmitterService.onAssetsChanged();
    }, () => {});

    this.assetNameInput.setValue('');
  }

  openEditModal(content, assetId, assetName) {
    this.assetName = assetName;
    this.assetNameInput.setValue(assetName);

    this.modalService.open(content, { centered: true }).result.then(() => {
      this.assets = this.ipcService.editAsset(assetId, this.assetNameInput.value);
      this.eventEmitterService.onAssetsChanged();
    }, () => {});

    this.assetNameInput.setValue('');
  }

  openDeleteModal(content, assetId, assetName) {
    this.assetName = assetName;

    this.modalService.open(content, { centered: true }).result.then(() => {
      this.assets = this.ipcService.deleteAsset(assetId);
      this.generalData = this.ipcService.getGeneralData();
      this.eventEmitterService.onAssetsChanged();
    }, () => {});

    this.assetName = null;
  }

  openUpdateModal(content, assetId) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.ipcService.updateAssetProfit(assetId, this.marketPriceInput.value);
      this.assets = this.ipcService.getAllAssets();
      this.generalData = this.ipcService.getGeneralData();
    }, () => {});

    this.marketPriceInput.setValue('');
  }
}
