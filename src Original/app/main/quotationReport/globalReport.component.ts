import { Component, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { EnquiryServiceProxy } from "shared/service-proxies/service-proxies";
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './globalReport.component.html',
    animations: [appModuleAnimation()]
})

export class GlobalReportComponent extends AppComponentBase implements AfterViewInit {

	@ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 
   
    filterText: string = '';

   constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _enquiryService: EnquiryServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
	}
	
    getGlobalReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._enquiryService.getGlobalReport(
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
	exportExcel():void{
        this._enquiryService.getGlobalReportToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
} 