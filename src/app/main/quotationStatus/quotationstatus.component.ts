import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { QuotationStatusServiceProxy, QuotationStatusList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateQuotationStatusComponent } from './create-or-edit-quotationstatus.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './quotationstatus.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class QuotationStatusComponent extends AppComponentBase implements OnInit {

   @ViewChild('createQuotationStatusModal') createQuotationStatusModal: CreateQuotationStatusComponent;
   filter = '';
   quotationStatus: QuotationStatusList[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _quotationstatusService: QuotationStatusServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		 let d =  abp.multiTenancy.getTenantIdCookie();
    }

  ngOnInit(): void {
        this.getQuotation();
  }
  createQuotation(): void {
	  
        this.createQuotationStatusModal.show(0);
  }

  editQuotation(data): void {
        this.createQuotationStatusModal.show(data.id);
  }


  getQuotation(): void {
     this._quotationstatusService.getQuotationStatus(this.filter).subscribe((result) => {
		// console.log(result);
            this.quotationStatus = result.items;
        });
 }
  deleteQuotation(quotationstat: QuotationStatusList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Quotation Status', quotationstat.quotationStatusCode),
        isConfirmed => {
            if (isConfirmed) {
              this._quotationstatusService.getDeleteQuotationStatus(quotationstat.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.quotationStatus, quotationstat); 
                });
              
            }
        }
    );
  }
}