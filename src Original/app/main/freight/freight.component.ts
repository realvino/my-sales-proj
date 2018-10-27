import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FreightServiceProxy, FreightListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateFreightComponent } from './create-or-edit-freight.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './freight.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class FreightComponent extends AppComponentBase implements OnInit {

   @ViewChild('createFreightModal') createFreightModal: CreateFreightComponent;
   filter:string = '';
   freight: FreightListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _freightService: FreightServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

  ngOnInit(): void {
        this.getFreight();
  }
  createFreight(): void {
        this.createFreightModal.show(0);
  }

  editFreight(data): void {
        this.createFreightModal.show(data.id);
  }


  getFreight(): void {
     this._freightService.getFreight(this.filter).subscribe((result) => {
            this.freight = result.items;
        });
 }
  deleteFreight(freights: FreightListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Freight', freights.freightCode),
        isConfirmed => {
            if (isConfirmed) {
              this._freightService.getDeleteFreight(freights.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.freight, freights); 
                });
              
            }
        }
    );
  }
}