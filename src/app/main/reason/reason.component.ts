import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ReasonServiceProxy, ReasonListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateReasonComponent } from './create-or-edit-reason.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './reason.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class ReasonComponent extends AppComponentBase implements OnInit {

   @ViewChild('createReasonModal') createReasonModal: CreateReasonComponent;
   filter = '';
   sorting = '';
   maxResultCount : number;
   skipCount : number;
   reasons: ReasonListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _reasonService: ReasonServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d= abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

  ngOnInit(): void {
        this.getReason();
  }
  createReason(): void {
        this.createReasonModal.show(0);
  }

  editReason(data): void {
	  //console.log(data);
        this.createReasonModal.show(data.id);
  }


  getReason(): void {
     this._reasonService.getReason(this.filter,this.sorting,this.maxResultCount,this.skipCount).subscribe((result) => {
            this.reasons = result.items;
			//console.log(result.items,'g');
        });
 }
  deleteReason(reason: ReasonListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Reason', reason.code),
        isConfirmed => {
            if (isConfirmed) {
              this._reasonService.getDeleteReason(reason.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.reasons, reason); 
                });
              
            }
        }
    );
  }
}