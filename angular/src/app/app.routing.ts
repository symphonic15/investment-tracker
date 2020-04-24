import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, Router } from '@angular/router';

import { IndexAssetsComponent } from './components/pages/assets/index-assets/index-assets.component';
import { ViewAssetComponent } from './components/pages/assets/view-asset/view-asset.component';
import { GeneralComponent } from './components/pages/general/general.component';

const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  { path: 'assets/index', component: IndexAssetsComponent },
  { path: 'assets/view/:assetId', component: ViewAssetComponent },
  { path: 'general', component: GeneralComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }
}
