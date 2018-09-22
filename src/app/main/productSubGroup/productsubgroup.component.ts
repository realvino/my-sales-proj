import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ProductSubGroupServiceProxy, ProductSubGpListDto } from "shared/service-proxies/service-proxies";
import { CreateproductsubgroupModalComponent } from "app/main/productSubGroup/create-or-edit-productsubgroup.component";

@Component({
    templateUrl: './productsubgroup.component.html',
    animations: [appModuleAnimation()]
})

export class ProductSubGroupComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createProductSubGroupModal') createProductSubGroupModal: CreateproductsubgroupModalComponent;
	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filterText: string = '';
    
	productsubGroup: ProductSubGpListDto [] = [];

   constructor(
        injector: Injector,
        
        private _activatedRoute: ActivatedRoute,
		private route:Router,
        private _productSubGroupProxyService: ProductSubGroupServiceProxy
    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

		}
	
	 getSubGroup(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._productSubGroupProxyService.getProductSubGroup(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator , event))
            .subscribe((result) => {
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.hideLoadingIndicator();
				
            });

    }
   
 
    createSubGroup(): void {
        this.createProductSubGroupModal.show();
    }

    editSubGroup(data): void {
     this.createProductSubGroupModal.show(data.id);
    }
 
    
	deleteSubGroup(productsubGroup:ProductSubGpListDto):void{
		//console.log(data);
		this.message.confirm(
		 this.l('Are you sure to Delete the Product SubGroup', productsubGroup.productSubGroupName),
		 (isConfirmed) => {
			if (isConfirmed) {
				this._productSubGroupProxyService.getDeleteProductSubGroup(productsubGroup.id)
                        .subscribe(result => {

                                this.notify.success(this.l("Deleted Successfully"));
                                this.getSubGroup();
						});
			} 
			 
		 }
		);
	}
	
} 