import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Asset } from 'src/app/models/asset.interface';

@Pipe({
  name: 'assetFilter'
})
@Injectable()
export class AssetFilter implements PipeTransform {
  transform(assets: Asset[], value: string) {
    return value ? assets.filter(asset => asset.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) : assets;
  }
}