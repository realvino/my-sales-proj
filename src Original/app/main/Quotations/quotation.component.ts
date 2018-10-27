import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { QuotationServiceProxy,QuotationList } from "shared/service-proxies/service-proxies";
import { CreateQModalComponent } from "./create-or-edit-quot.component";

@Component({
    templateUrl: './quotation.component.html',
    animations: [appModuleAnimation()]
})

export class QuotationComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createQModal') createQModal: CreateQModalComponent;
	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filterText: string = '';
	products: QuotationList [] = [];

   constructor(
        injector: Injector,
        
        private _activatedRoute: ActivatedRoute,
		private route:Router,
        private _quotationProxyService: QuotationServiceProxy
    )
    {
        super(injector);
		//let d = abp.multiTenancy.getTenantIdCookie();
		//console.log(d);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

		}
	
	 getQuotation(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._quotationProxyService.getQuotation(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
				this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
				
            });

    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }

 
    createQuotation(): void {

        this.createQModal.show(0);
    }

    editQuotation(data): void {
       // console.log(75,data);
        this.route.navigate(['app/main/quotation/editquotation/'+data.id]);
     //this.createQuotationModal.show(data.id);
    }
 
    
	deleteQuotation(quotations:QuotationList):void{
		//console.log(data);
		this.message.confirm(
		 this.l('Are you sure to Delete the Quotation', quotations.quotationTitleName),
		 (isConfirmed) => {
			if (isConfirmed) {
				this._quotationProxyService.deleteQuotation(quotations.id)
                        .subscribe(result => {
							if(result){
							this.notify.success(this.l("Deleted Successfully"));	
							}
							else{
								this.getQuotation();
							}
						});
			} 
			 
		 }
		);
	}
	
} 