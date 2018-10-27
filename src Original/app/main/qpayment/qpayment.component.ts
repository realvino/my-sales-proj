import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { QPaymentServiceProxy, QPaymentListDto,FileDto,QPaymentInputDto } from 'shared/service-proxies/service-proxies';
import { CreateQpaymentComponent } from './create-or-edit-qpayment.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './qpayment.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class QpaymentComponent extends AppComponentBase implements OnInit {

   @ViewChild('createQpaymentModal') createQpaymentModal: CreateQpaymentComponent;
   filter = '';
   getPayments : QPaymentListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _qpaymentService: QPaymentServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d =abp.multiTenancy.getTenantIdCookie();
		//console.log(d);    
		
	}

  ngOnInit(): void {
        this.getQPayment();
  }
  createQPayment(): void {
        this.createQpaymentModal.show(0);
  }

  editQPayment(data): void {
	  //console.log(data);
	  this.createQpaymentModal.show(data.id);
  }


  getQPayment(): void {
     this._qpaymentService.getPayments(this.filter).subscribe((result) => {
            this.getPayments = result.items;
        });
 }
  deleteQPayment(qpayment: QPaymentListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the QPayment', qpayment.paymentCode),
        isConfirmed => {
            if (isConfirmed) {
              this._qpaymentService.getDeletePayment(qpayment.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.getPayments, qpayment); 
                });
              
            }
        }
    );
  }
}