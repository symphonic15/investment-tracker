import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IpcService } from 'src/app/services/ipc.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/general', title: 'General',  icon:'fas fa-desktop text-primary', class: '' },
  { path: '/assets/index', title: 'My investments',  icon:'fas fa-chart-bar text-primary', class: '' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menuItems: any[];
  public menuTopAssets: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    private ipcService: IpcService
  ) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    const topAssets = this.ipcService.getTopAssets();
    let topAssetsLinks: any[] = [];

    topAssets.forEach(function(asset) {
      let assetLink = {path: '/assets/view/'+asset.id, title: asset.name }
      topAssetsLinks.push(assetLink);
    });

    this.menuTopAssets = topAssetsLinks;

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
