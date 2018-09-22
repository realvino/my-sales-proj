import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WarrantyServiceProxy, WarrantyListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateWarrantyComponent } from './create-or-edit-warranty.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './warranty.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class WarrantyComponent extends AppComponentBase implements OnInit {

   @ViewChild('createWarrantyModal') createWarrantyModal: CreateWarrantyComponent;
   filter = '';
   warranty: WarrantyListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _warrantyService: WarrantyServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d); 
    }

  ngOnInit(): void {
        this.getWarranty();
  }
  createWarranty(): void {
        this.createWarrantyModal.show(0);
  }

  editWarranty(data): void {
        this.createWarrantyModal.show(data.id);
  }


  getWarranty(): void {
     this._warrantyService.getWarranty(this.filter).subscribe((result) => {
            this.warranty = result.items;
        });
 }
  deleteWarranty(warranties: WarrantyListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Warranty', warranties.warrantyCode),
        isConfirmed => {
            if (isConfirmed) {
              this._warrantyService.getDeleteWarranty(warranties.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.warranty, warranties); 
                });
              
            }
        }
    );
  }
}