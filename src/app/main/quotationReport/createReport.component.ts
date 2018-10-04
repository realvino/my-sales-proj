import { Component, ViewChild, Injector, Output, EventEmitter, Pipe } from '@angular/core';
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
@Pipe({
    name: 'filter'
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
    mileStoness: Array<any> = [];
    mileStoneStatuss: Array<any> = [];
    companyNames: Array<any> = [];
    contactNames: Array<any> = [];
    salespersons: Array<any> = [];
    creators: Array<any> = [];
    mileStones: string;
    mileStoneStatus: string;
    companyName: string;
    contactName: string;
    salesperson: string;
    creator: string;
    enquiryClosureDate: any;
    creationTime:any;
    newView= [{id:0, selected:false}];
    filter= {
        mileStones: [],
        mileStoneStatus: [],
        companyName: [],
        contactName: [],
        salesperson: [],
        creator: [],
        enquiryClosureDate: [],
        creationTime: []
    };
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

        this.mileStoness = [];
        this.mileStoneStatuss = [];
        this.salespersons = [];
        this.companyNames = [];
        this.contactNames = [];
        this.creators = [];
        this. filter= {
            mileStones: [],
            mileStoneStatus: [],
            companyName: [],
            contactName: [],
            salesperson: [],
            creator: [],
            enquiryClosureDate: [],
            creationTime: []
        };
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
                this.primengDatatableHelper.records.forEach((item:{mileStones:string})=>{
                    if(item.mileStones != ""){
                        var index = this.mileStoness.findIndex(x => x.label == item.mileStones)
                        if(index == -1){
                            this.mileStoness.push({
                                label: item.mileStones,
                                value: item.mileStones
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{mileStoneStatus:string})=>{
                    if(item.mileStoneStatus != ""){
                        var index = this.mileStoneStatuss.findIndex(x => x.label == item.mileStoneStatus)
                        if(index == -1){
                            this.mileStoneStatuss.push({
                                label: item.mileStoneStatus,
                                value: item.mileStoneStatus
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{salesperson:string})=>{
                    if(item.salesperson != ""){
                        var index = this.salespersons.findIndex(x => x.label == item.salesperson)
                        if(index == -1){
                            this.salespersons.push({
                                label: item.salesperson,
                                value: item.salesperson
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{companyName:string})=>{
                    if(item.companyName != ""){
                        var index = this.companyNames.findIndex(x => x.label == item.companyName)
                        if(index == -1){
                            this.companyNames.push({
                                label: item.companyName,
                                value: item.companyName
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{contactName:string})=>{
                    if(item.contactName != ""){
                        var index = this.contactNames.findIndex(x => x.label == item.contactName)
                        if(index == -1){
                            this.contactNames.push({
                                label: item.contactName,
                                value: item.contactName
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{creator:string})=>{
                    if(item.creator != ""){
                        var index = this.creators.findIndex(x => x.label == item.creator)
                        if(index == -1){
                            this.creators.push({
                                label: item.creator,
                                value: item.creator
                            });                   
                        }
                    }
                });
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
    selectedMileStone(filter) {
        this.mileStones = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.mileStones =  element ;
                i = 0;
            }
            else{
                this.mileStones = this.mileStones + "," + element;
            }
        });
    }
    selectedMileStoneStatus(filter) {
        this.mileStoneStatus = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.mileStoneStatus =  element ;
                i = 0;
            }
            else{
                this.mileStoneStatus = this.mileStoneStatus + "," + element;
            }
        });
    }
    selectedCreator(filter){
        this.creator = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.creator =  element ;
                i = 0;
            }
            else{
                this.creator = this.creator + "," + element;
            }
        });
    }
    selectedSalesperson(filter) {
        this.salesperson = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.salesperson =  element ;
                i = 0;
            }
            else{
                this.salesperson = this.salesperson + "," + element;
            }
        });
    }
    selectedCompany(filter) {
        this.companyName = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.companyName =  element ;
                i = 0;
            }
            else{
                this.companyName = this.companyName + "," + element;
            }
        });
    }
    selectedContact(filter) {
        this.contactName = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.contactName =  element ;
                i = 0;
            }
            else{
                this.contactName = this.contactName + "," + element;
            }
        });
    }
    selectedClosedDate(filter) {
       if(filter.originalEvent == 1)
        {
           this.creationTime = "";
           this.creationTime = filter.datepicker;
        }
        else if(filter.originalEvent == 2)
        {
          this.enquiryClosureDate = "";
          this.enquiryClosureDate = filter.datepicker;
        }
    }
}
