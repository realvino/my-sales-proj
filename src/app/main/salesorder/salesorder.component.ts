import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { QuotationServiceProxy,QuotationList } from "shared/service-proxies/service-proxies";

@Component({
    templateUrl: './salesorder.component.html',
    animations: [appModuleAnimation()]
})

export class SalesOrderComponent extends AppComponentBase implements AfterViewInit {

    //@ViewChild('createTeamModal') createTeamModal: CreateEditTeamComponent;

	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filterText: string = '';
    
    salesorder: QuotationList [] = []; 

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
	
	 getSalesorder(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._quotationProxyService.getSalesOrder(
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
   
 
    createteam(): void {
        //this.createTeamModal.show();
    }

    editSalesorder(record): void {
        this.route.navigate(['app/main/salesorder/editsalesorder/'+record.id+'/'+1]);
      //  this.quotationPreviewModal.show(record.id,1);
     //this.createTeamModal.show(record.id);
    }
 
    
 	deleteSalesorder(data):void{
		//console.log(data);
	/* 	this.message.confirm(
		 this.l('Are you sure to Delete the Team', teams.name),
		 (isConfirmed) => {
			if (isConfirmed) {
				this._teamProxyService.deleteTeam(teams.id)
                        .subscribe(result => {
							if(result){
							this.notify.success(this.l("Deleted Successfully"));	
							}
							else{
								this.getTeam();
							}
						});
			} 
			 
		 }
		); */
	}  
	
} 