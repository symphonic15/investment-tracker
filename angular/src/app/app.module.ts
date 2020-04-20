import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxElectronModule } from 'ngx-electron';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Pipes
import { AssetFilter } from './pipes/asset-filter.pipe'

// Components
import { AppComponent } from './app.component';
import { IndexAssetsComponent } from './components/pages/assets/index-assets/index-assets.component';
import { ViewAssetComponent } from './components/pages/assets/view-asset/view-asset.component';
import { GeneralComponent } from './components/pages/general/general.component';

import { AppRoutingModule } from './app.routing';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    CommonModule,
    NgxElectronModule,
    ClipboardModule,
    AppRoutingModule
  ],
  declarations: [
    AssetFilter,
    AppComponent,
    IndexAssetsComponent,
    ViewAssetComponent,
    GeneralComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
