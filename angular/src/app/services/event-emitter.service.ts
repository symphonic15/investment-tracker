import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    
    
@Injectable({    
  providedIn: 'root'    
})    
export class EventEmitterService {    
    
  refreshTopAssets = new EventEmitter();    
  refreshTopAssetsSub: Subscription;    
    
  constructor() { }    
    
  onAssetsChanged() {
    this.refreshTopAssets.emit();    
  }    
}