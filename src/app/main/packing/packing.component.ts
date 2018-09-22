import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PackingServiceProxy, PackingListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreatePackingComponent } from './create-or-edit-packing.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './packing.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class PackingComponent extends AppComponentBase implements OnInit {

   @ViewChild('createPackingModal') createPackingModal: CreatePackingComponent;
   filter:string ='';
   pack: PackingListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _packingService: PackingServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		 let d =  abp.multiTenancy.getTenantIdCookie();
    }

  ngOnInit(): void {
        this.getPacking();
  }
  createPacking(): void {
        this.createPackingModal.show(0);
  }

  editPacking(data): void {
	  //console.log(data);
        this.createPackingModal.show(data.id);
  }


  getPacking(): void {
     this._packingService.getPacking(this.filter).subscribe((result) => {
            this.pack = result.items;
        });
 }
  deletePacking(packing: PackingListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Packing', packing.packingCode),
        isConfirmed => {
            if (isConfirmed) {
              this._packingService.getDeletePacking(packing.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.pack, packing); 
                });
              
            }
        }
    );
  }
}