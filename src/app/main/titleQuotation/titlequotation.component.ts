import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TitleOfQuotationServiceProxy, TitleOfQuotationList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateTitleOfQuotationComponent } from './create-or-edit-titlequotation.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './titlequotation.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class TitleQuotationComponent extends AppComponentBase implements OnInit {

   @ViewChild('createTitleOfQuotationModal') createTitleOfQuotationModal: CreateTitleOfQuotationComponent;
   filter = '';
   title: TitleOfQuotationList[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _titleofquotationService: TitleOfQuotationServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		 let d =abp.multiTenancy.getTenantIdCookie();
    }

  ngOnInit(): void {
        this.getTitlequotation();
  }
  createTitlequotation(): void {
        this.createTitleOfQuotationModal.show(0);
  }

  editTquotation(data): void {
        this.createTitleOfQuotationModal.show(data.id);
  }


  getTitlequotation(): void {
     this._titleofquotationService.getTitleOfQuotation(this.filter).subscribe((result) => {
            this.title = result.items;
        });
 }
  deleteTquotation(titlequt: TitleOfQuotationList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Title Of Quotation', titlequt.code),
        isConfirmed => {
            if (isConfirmed) {
              this._titleofquotationService.getDeleteTitleOfQuotation(titlequt.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.title, titlequt); 
                });
              
            }
        }
    );
  }
}