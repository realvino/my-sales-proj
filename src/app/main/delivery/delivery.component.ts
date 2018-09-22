import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DeliveryServiceProxy, DeliveryList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateDeliveryComponent } from './create-or-edit-delivery.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './delivery.component.html',
    styleUrls: ['./collection.component.less'],
    animations: [appModuleAnimation()]
})

export class DeliveryComponent extends AppComponentBase implements OnInit {

   @ViewChild('createDeliveryModal') createDeliveryModal: CreateDeliveryComponent;
   filter:string = '';
   delivery:DeliveryList[] =[];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _deliveryService: DeliveryServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
		let d =abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

  ngOnInit(): void {
        this.getDelivery();
  }
  createDelivery(): void {
        this.createDeliveryModal.show(0);
  }

  editDelivery(data): void {
        this.createDeliveryModal.show(data.id);
  }


  getDelivery(): void {
     this._deliveryService.getDelivery(this.filter).subscribe((result) => {
            this.delivery = result.items;
        });
 }
  deleteDelivery(deliveries: DeliveryList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Delivery', deliveries.deliveryCode),
        isConfirmed => {
            if (isConfirmed) {
              this._deliveryService.getDeleteDelivery(deliveries.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.delivery, deliveries); 
                });
              
            }
        }
    );
  }
}