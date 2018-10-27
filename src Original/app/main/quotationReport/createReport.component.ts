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
    mileStoness: Array<any> = [];
    mileStoneStatuss: Array<any> = [];
    salespersons: Array<any> = [];
    creators: Array<any> = [];
    countrys: Array<any> = [];
    currencys : Array<any> = [];
    customerTypes : Array<any> = [];
    statusNames : Array<any> = [];
    mileStones: string;
    mileStoneStatus: string;
    salesperson: string;
    creator: string;
    country: string;
    currency: string;
    customerType: string;
    statusName: string;
    submittedDate: any;
    wonDate:any;
    lostDate:any;
    enqCreationTime:any;
    enqCreationTimeId:number;
    quotCreationTime:any;
    quotCreationTimeId:number;
    submittedDateId:number;
    wonDateId:number;
    lostDateId:number;
    newView= [{id:0, selected:false}];
    filter= {
        mileStones: [],
        mileStoneStatus: [],
        salesperson: [],
        creator: [],
        creationTime: [],
        country: [],
        currency : [],
        customerType : [],
        statusName : [],
        submittedDate : [],
        wonDate : [],
        lostDate : []
    };
    showColumns: Array<any> = [];

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
        this.mileStones = '';
        this.mileStoneStatus = "";
        this.creator = "";
        this.salesperson = "";
        this.enqCreationTime = "";
        this.quotCreationTime= '';
        this.country = "";
        this.currency = "";
        this.customerType = "";
        this.statusName = "";
        this.submittedDate = "";
        this.wonDate = "";
        this.lostDate= "";
        this.mileStoness = [];
        this.mileStoneStatuss = [];
        this.salespersons = [];
        this.creators = [];
        this.countrys = [];
        this.currencys = [];
        this.customerTypes = [];
        this.statusNames = [];
        this.enqCreationTimeId = 0;
        this.quotCreationTimeId =0;
        this.submittedDateId= 0;
        this.wonDateId=0;
        this.lostDateId=0;
        this. filter= {
            mileStones: [],
            mileStoneStatus: [],
            salesperson: [],
            creator: [],
            creationTime: [],
            country: [],
            currency : [],
            customerType : [],
            statusName : [],
            submittedDate : [],
            wonDate : [],
            lostDate : []
        };
    }
    generateReport():void{
        this.showGrid = true;
        this.getColumns();
        setTimeout(() => {
            this.getFilterReport();
        }, 0);
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
        this.getFilterReport();
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
        this.getFilterReport();
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
        this.getFilterReport();
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
        this.getFilterReport();
    }
    selectedCountry(filter) {
        this.country = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.country =  element ;
                i = 0;
            }
            else{
                this.country = this.country + "," + element;
            }
        });
        this.getFilterReport();
    }
    selectedCurrency(filter) {
        this.currency = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.currency =  element ;
                i = 0;
            }
            else{
                this.currency = this.currency + "," + element;
            }
        });
        this.getFilterReport();
    }
    selectedCustomerType(filter) {
        this.customerType = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.customerType =  element ;
                i = 0;
            }
            else{
                this.customerType = this.customerType + "," + element;
            }
        });
        this.getFilterReport();
    }
    selectedStatus(filter) {
        this.statusName = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.statusName =  element ;
                i = 0;
            }
            else{
                this.statusName = this.statusName + "," + element;
            }
        });
        this.getFilterReport();
    }
    selectedClosedDate(filter) {
       if(filter.originalEvent == 1)
        {
            if(this.reportId == 1){
                this.quotCreationTime = '';
                this.quotCreationTimeId = 0;
                this.enqCreationTime = "";
                this.enqCreationTimeId = filter.value;
                if(filter.value == 7){
                   this.enqCreationTime = filter.datepicker;
                   this.enqCreationTimeId = 0;
                }
            }
            else if(this.reportId == 2){
                this.quotCreationTime = '';
                this.quotCreationTimeId = filter.value;
                this.enqCreationTime = "";
                this.enqCreationTimeId = 0;
                if(filter.value == 7){
                   this.quotCreationTime = filter.datepicker;
                   this.quotCreationTimeId = 0;
                }
            }
        }
        else if(filter.originalEvent == 3)
        {
          this.submittedDate = "";
          this.submittedDateId = filter.value
          if(filter.value ==7){
            this.submittedDate = filter.datepicker;
            this.submittedDateId = 0;
          }
          
        }
        else if(filter.originalEvent == 4)
        {
           this.wonDate = "";
           this.wonDateId = filter.value
            if(filter.value ==7){
              this.wonDate = filter.datepicker;
              this.wonDateId = 0;
            }
        }
        else if(filter.originalEvent == 5)
        {
            this.lostDate = "";
            this.lostDateId = filter.value
            if(filter.value ==7){
               this.lostDate = filter.datepicker;
               this.lostDateId = 0;
            }
        }
        this.getFilterReport();
    }
    getFilterReport(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this._reportService.getFilterReport(
            this.reportId, 0, this.salesperson, this.creator, this.country, this.customerType, 
            this.currency, this.mileStones, this.mileStoneStatus, this.statusName, 
            this.enqCreationTime, this.enqCreationTimeId, this.quotCreationTime, this.quotCreationTimeId,
            this.submittedDate, this.submittedDateId, this.wonDate, this.wonDateId, this.lostDate, this.lostDateId,
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
                this.primengDatatableHelper.records.forEach((item:{country:string})=>{
                    if(item.country != ""){
                        var index = this.countrys.findIndex(x => x.label == item.country)
                        if(index == -1){
                            this.countrys.push({
                                label: item.country,
                                value: item.country
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{currency:string})=>{
                    if(item.currency != ""){
                        var index = this.currencys.findIndex(x => x.label == item.currency)
                        if(index == -1){
                            this.currencys.push({
                                label: item.currency,
                                value: item.currency
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{customerType:string})=>{
                    if(item.customerType != ""){
                        var index = this.customerTypes.findIndex(x => x.label == item.customerType)
                        if(index == -1){
                            this.customerTypes.push({
                                label: item.customerType,
                                value: item.customerType
                            });                   
                        }
                    }
                });
                this.primengDatatableHelper.records.forEach((item:{statusName:string})=>{
                    if(item.statusName != ""){
                        var index = this.statusNames.findIndex(x => x.label == item.statusName)
                        if(index == -1){
                            this.statusNames.push({
                                label: item.statusName,
                                value: item.statusName
                            });                   
                        }
                    }
                });
            });
    }
    getColumns(){
        if(this.reportId == 1){
            this._reportService.getEnquiryReportColumn().subscribe((result)=>{
                if(result != null){
                    this.showColumns=[];
                    result.forEach((col:{columnId:number, columnName:string}) => {
                        this.showColumns.push({
                            id: col.columnId,
                            text: col.columnName
                        });
                    });
                }
            });
        }
        else if(this.reportId == 2){
            this._reportService.getQuotationReportColumn().subscribe((result)=>{
                if(result != null){
                    this.showColumns=[];
                    result.forEach((col:{columnId:number, columnName:string}) => {
                        this.showColumns.push({
                            id: col.columnId,
                            text: col.columnName
                        });
                    });
                }
            });
        }
        else if(this.reportId == 3){
            this._reportService.getCompanyReportColumn().subscribe((result)=>{
                if(result != null){
                    this.showColumns=[];
                    result.forEach((col:{columnId:number, columnName:string}) => {
                        this.showColumns.push({
                            id: col.columnId,
                            text: col.columnName
                        });
                    });
                }
            });
        }
        else if(this.reportId == 4){
            this._reportService.getContactReportColumn().subscribe((result)=>{
                if(result != null){
                    this.showColumns=[];
                    result.forEach((col:{columnId:number, columnName:string}) => {
                        this.showColumns.push({
                            id: col.columnId,
                            text: col.columnName
                        });
                    });
                }
            });
        }
        
    }
    Show(data){
        var index = this.showColumns.findIndex(x=> x.text == data);
        if(index == -1){
            return false;
        }
        else{
            return true;
        }
    }
}
