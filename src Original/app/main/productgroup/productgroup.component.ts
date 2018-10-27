import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { ProductGroupListDto, ProductGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateProductGroupModalComponent } from "app/main/productgroup/create-or-edit-productgroup.component";

@Component({
    templateUrl: './productgroup.component.html',
    styleUrls: ['./productgroup.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductGroupComponent extends AppComponentBase implements OnInit {

  @ViewChild('createProductGroupModal') createProductGroupModal: CreateProductGroupModalComponent;
   filter = '';
   productGroups: ProductGroupListDto[] = [];

   constructor(
        injector: Injector,
        private _productgroupService: ProductGroupServiceProxy
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getproductGroup();
    }
  createProductGroup(): void {
        this.createProductGroupModal.show();
    }

  editProductGroup(data): void {
	  //console.log(1,data);
        this.createProductGroupModal.show(data.id);
    }


  getproductGroup(): void {
	  
    this._productgroupService.getProductGroup(this.filter).subscribe((result) => {
		 //console.log(result);
            this.productGroups = result.items;
        });
 }
 deleteproductGroup(group: ProductGroupListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Product Group', group.productGroupName),
        isConfirmed => {
            if (isConfirmed) {
                this._productgroupService.getDeleteProductGroup(group.id).subscribe((result) => {
			        this.notify.info(this.l('Successfully Deleted'));
                    this.getproductGroup();
                });
            }
        }
    );
}
}