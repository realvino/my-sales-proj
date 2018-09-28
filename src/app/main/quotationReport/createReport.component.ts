import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ReportServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'createReportModal',
    templateUrl: './createReport.component.html'
})
export class CreateReportComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dataTable') dataTable: DataTable;
	@ViewChild('paginator') paginator: Paginator; 

    active = false;
    saving = false;
    reports:Array<any>;
    showGrid:boolean=false;
    filterText:string='';
    reportId:number=0;
    quotationArray:Array<any>;
    quotationArrayCount: number=0;
    companyArray:Array<any>;
    companyArrayCount: number=0;
    contactArray:Array<any>;
    contactArrayCount: number=0;

    constructor(
        injector: Injector,
        private _reportService: ReportServiceProxy
    ) {
        super(injector);
    }
 
    show(): void {
        this.active = true;
        this.reports = [{id:'1', text:'Enquiry Report'},
                        {id:'2', text:'Quotation Report'},
                        {id:'3', text:'Company Report'},
                        {id:'4', text:'Contact Report'}
                       ];
        this.modal.show();
    }
    radioChange(value){
        this.reportId = value;
        this.showGrid = false;
    }
    generateReport():void{
        this.showGrid = true;
        if(this.reportId == 1){
            setTimeout(() => {
                this.getInqiuryReport();
            }, 0);        }
        else if(this.reportId == 2){
            setTimeout(() => {
                this.getQuotationReport();
            }, 0); 
        }
        else if(this.reportId == 3){
            setTimeout(() => {
                this.getCompanyReport();
            }, 0); 
        }
        else if(this.reportId == 4){
            setTimeout(() => {
                this.getContactReport();
            }, 0); 
        }
    }
    
    getInqiuryReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._reportService.getInquiryReport(
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
    getQuotationReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._reportService.getQuotationReport(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.quotationArrayCount = result.totalCount;
                this.quotationArray = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
    }
    getCompanyReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._reportService.getCompanyReport(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.companyArrayCount = result.totalCount;
                this.companyArray = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
    }
    getContactReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._reportService.getContactReport(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.contactArrayCount = result.totalCount;
                this.contactArray = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
    }
    onShown(): void {
    }

    close(): void {
        this.modal.hide();
        this.active = false;
        this.showGrid = false;
        this.reportId=0;
    }
}
