import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IpcService } from 'src/app/services/ipc.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

import { Asset } from 'src/app/models/asset.interface';

@Component({
  selector: 'app-view-asset',
  templateUrl: './view-asset.component.html',
  styleUrls: ['./view-asset.component.css']
})
export class ViewAssetComponent implements OnInit {
  assetId: Number;
  asset: Asset;

  // Modal values
  operationForm: FormGroup;
  marketPriceInput: FormControl;
  validationError: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ipcService: IpcService,
    private eventEmitterService: EventEmitterService
  ) {
    this.assetId = this.route.snapshot.params.assetId;
    this.asset = this.ipcService.getAsset(this.assetId);

    // Sort operations by date
    this.asset.operations.sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime());

    this.operationForm = this.formBuilder.group({
      type: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required]
    });
    this.marketPriceInput = new FormControl('', [Validators.required]);
  }

  ngOnInit(): void {}

  openAddModal(content) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      var data = {
        type: this.operationForm.value.type,
        quantity: this.operationForm.value.quantity,
        price: this.operationForm.value.price,
        date: new Date()
      };

      if(data.type == 'S') {
        if(data.quantity > this.asset.quantity) {
          this.validationError = "You do not have that amount";
          this.openAddModal(content);
        } else {
          this.asset = this.ipcService.addOperation(this.assetId, data);
        }
      } else {
        this.asset = this.ipcService.addOperation(this.assetId, data);
      }

      this.asset.operations.sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime());

      this.eventEmitterService.onAssetsChanged();
    }, () => {});

    this.operationForm = this.formBuilder.group({
      type: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required]
    });
  }

  openDeleteModal(content, operationId) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.asset = this.ipcService.deleteOperation(this.assetId, operationId);
      this.asset.operations.sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
      this.eventEmitterService.onAssetsChanged();
    }, () => {});
  }

  openUpdateModal(content) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.ipcService.updateAssetProfit(this.assetId, this.marketPriceInput.value);
      this.asset = this.ipcService.getAsset(this.assetId);
    }, () => {});

    this.marketPriceInput.setValue('');
  }
  
}
