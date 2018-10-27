import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ValidityServiceProxy, ValidityList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateValidityComponent } from './create-or-edit-validity.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './validity.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class ValidityComponent extends AppComponentBase implements OnInit {

   @ViewChild('createValidityModal') createValidityModal: CreateValidityComponent;
   filter = '';
   validity: ValidityList[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _validityService: ValidityServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d = abp.multiTenancy.getTenantIdCookie();
    }

  ngOnInit(): void {
        this.getValidity();
  }
  createValidity(): void {
        this.createValidityModal.show(0);
  }

  editValidity(data): void {
        this.createValidityModal.show(data.id);
  }


  getValidity(): void {
     this._validityService.getValidity(this.filter).subscribe((result) => {
            this.validity = result.items;
        });
 }
  deleteValidity(validities: ValidityList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Validity', validities.validityCode),
        isConfirmed => {
            if (isConfirmed) {
              this._validityService.getDeleteValidity(validities.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.validity, validities); 
                });
              
            }
        }
    );
  }
}