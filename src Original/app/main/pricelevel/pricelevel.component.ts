import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PriceLevelServiceProxy, PriceLevelList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreatePricelevelComponent } from './create-or-edit-pricelevel.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './pricelevel.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class PriceLevelComponent extends AppComponentBase implements OnInit {

   @ViewChild('createPriceLevelModal') createPriceLevelModal: CreatePricelevelComponent;
   filter = '';
   getPriceLevels: PriceLevelList[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _PriceLevelService: PriceLevelServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

  ngOnInit(): void {
        this.getPricelevel();
  }
  createPricelevel(): void {
        this.createPriceLevelModal.show(0);
  }

  editPriceLevel(data): void {
        this.createPriceLevelModal.show(data.id);
  }


  getPricelevel(): void {
     this._PriceLevelService.getPriceLevel(this.filter).subscribe((result) => {
		 //console.log(result,'g');
            this.getPriceLevels = result.items;
        });
 }
  deletePriceLevel(PriceLevel: PriceLevelList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Price Level', PriceLevel.priceLevelCode),
        isConfirmed => {
            if (isConfirmed) {
              this._PriceLevelService.deletePriceLevel(PriceLevel.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.getPriceLevels, PriceLevel); 
                });
              
            }
        }
    );
  }
}