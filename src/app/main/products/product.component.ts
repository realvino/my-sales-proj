import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ProductServiceProxy,ProductListDto, ServiceServiceProxy, ServiceList } from "shared/service-proxies/service-proxies";
import { CreateEditProductComponent } from "app/main/products/create-or-edit-product.component";
import { CreateServiceComponent } from '@app/main/products/create-or-edit-service.component';

@Component({
    templateUrl: './product.component.html',
    animations: [appModuleAnimation()]
})

export class ProductComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createProductModal') createProductModal: CreateEditProductComponent;
    @ViewChild('createServiceModal') createServiceModal: CreateServiceComponent;
	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filterText: string = '';
    filter = '';

    products: ProductListDto [] = [];
    serviceList: ServiceList[] = [];

   constructor(
        injector: Injector,
        
        private _activatedRoute: ActivatedRoute,
		private route:Router,
        private _productProxyService: ProductServiceProxy,
        private _serviceService: ServiceServiceProxy
    )
    {
        super(injector);
		//let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

     ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.filter = this._activatedRoute.snapshot.queryParams['filter'] || '';
        this.getService();

	}
	
	 getProduct(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._productProxyService.getProduct(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator , event))
            .subscribe((result) => {
				this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
				
            });

    }
   
 
    createSubGroup(): void {
        this.createProductModal.show();
    }

    editProduct(record): void {
		//console.log(75,record);
     this.createProductModal.show(record.id);
    }
 
    
	deleteProduct(products:ProductListDto):void{
		this.message.confirm(
		this.l('Are you sure to Delete the products', products.productName),
		  (isConfirmed) => {
			if (isConfirmed) {
				this._productProxyService.getDeleteProduct(products.id)
                .subscribe(result => {
					this.notify.success(this.l("Deleted Successfully"));	
					this.getProduct();
				});
		    } 
     	 }
		);
    }
    
    createService(): void {
       this.createServiceModal.show(0);
    }
    editService(data): void {
        this.createServiceModal.show(data.id);
    }
    getService(): void {
        this._serviceService.getService(this.filter).subscribe((result) => {
           this.serviceList = result.items;
        });
    }
    deleteService(data: ServiceList): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Service', data.serviceName),
            isConfirmed => {
                if (isConfirmed) {
                    this._serviceService.deleteService(data.id).subscribe(() => {
                        this.notify.success(this.l('Successfully Deleted'));
                         this.getService();
                    });
                }
            }
        );
     }
	
} 