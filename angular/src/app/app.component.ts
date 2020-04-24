import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IpcService } from 'src/app/services/ipc.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menuItems: any[];
  public menuTopAssets: any[];
  public databasePath: SafeUrl;
  public isCollapsed = true;

  constructor(
    private router: Router,
    private ipcService: IpcService,
    private DOMSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.getTopAssets();

    this.databasePath = this.DOMSanitizer.bypassSecurityTrustUrl(this.ipcService.getDatabasePath());

    if (this.eventEmitterService.refreshTopAssetsSub == undefined) {
      this.eventEmitterService.refreshTopAssetsSub = this.eventEmitterService.refreshTopAssets.subscribe(() => {
        this.getTopAssets();
      });
    }
  }

  getTopAssets() {
    let topAssets = this.ipcService.getTopAssets();
    let topAssetsLinks: any[] = [];

    topAssets.forEach(function(asset) {
      let assetLink = { path: '/assets/view/'+asset.id, title: asset.name }
      topAssetsLinks.push(assetLink);
    });

    this.menuTopAssets = topAssetsLinks;
  }

  openImportModal(content) {
    this.modalService.open(content, { centered: true }).result.then(() => {
      this.ipcService.importDatabase();
      this.getTopAssets();
      this.router.navigate(['/']);
    }, () => {});
  }
}
