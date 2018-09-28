import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EnquiryServiceProxy,EnquiryList,ActivityServiceProxy,ActivityListDto,EnquiryInput,Select2ServiceProxy, QuotationServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router,ActivatedRoute,NavigationEnd } from "@angular/router";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import {CreateActivityComponent} from './createActivity.component';
import { DatePipe } from '@angular/common';
import {CreateQModalComponent} from "app/main/Quotations/create-or-edit-quot.component"
import * as moment from "moment"

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    templateUrl: './editEnquiry.component.html',
    styleUrls: ['./editEnquiry.component.css'],
    animations: [appModuleAnimation()]
})
export class EditEnquiryComponent extends AppComponentBase implements OnInit {
   
    active = false;
    saving = false;
	
    enquiry_detail:EnquiryList= new EnquiryList();
    private sub: any;
    private id: number;
    filterText: string = '';
    records:ActivityListDto[]=[];
	enquiry:EnquiryInput = new EnquiryInput();
    private _quotationProxyService: QuotationServiceProxy
	public contactlist: Array<any>=[];
    public contact:Array<any> =[];
    public companytypes: Array<any>=[];
    public companytypo: Array<any>=[];
    public milestones: Array<any>=[];
    public milestone: Array<any>=[];
    public statuslist: Array<any>=[];
    public status: Array<any>=[];
	active_milestone:SelectOption[];
	active_contact:SelectOption[];
	active_milestonestatus:SelectOption[];
	active_company:SelectOption[];
    dpdate:string;
	
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createEActivityModal') createEActivityModal: CreateActivityComponent;
    @ViewChild('createQModal') createQModal: CreateQModalComponent; 
    constructor(
        injector: Injector,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _enquiryService: EnquiryServiceProxy,
        private _activityService:ActivityServiceProxy,
		private _selectProxyService: Select2ServiceProxy
		
    ) {
        super(injector);
        
    }
    ngOnInit(){
        this.sub = this._activatedRoute.params.subscribe(params => {
           this.id = +params['id']; // (+) converts string 'id' to a number
           this.getAllEnquiryDetail();
            this.getData();
        });
		this.getCompany();
        this.getMilestone();
        this.getCompanyContact();
        this.getStatusbyMilestone();

    }
    show(enquiryId ?: number): void {

        //this.modal.show
		
        this.active= true;
        this.getData();
		
		

    }
    getAllEnquiryDetail(){
        this._enquiryService.getEnquiryForEdit(this.id).subscribe(result=>{
				
            if(result.enquiryDetail!=null){
                this.enquiry_detail = result.enquiryDetail;
				this.enquiry.id = result.enquiryDetail.id;
				this.enquiry.enquiryNo = result.enquiryDetail.enquiryNo;
                this.enquiry.title = result.enquiryDetail.title;
                
                this.enquiry.mileStoneId = result.enquiryDetail.mileStoneId;
                if(result.enquiryDetail.mileStoneStatusId){
                    this.enquiry.mileStoneStatusId = result.enquiryDetail.mileStoneStatusId;
                }
                else{
                    this.enquiry.mileStoneStatusId = null;
                }
				this.enquiry.closeDate = result.enquiryDetail.closeDate;
				this.enquiry.companyId = result.enquiryDetail.companyId;
				this.enquiry.contactId = result.enquiryDetail.contactId;
				this.enquiry.remarks = result.enquiryDetail.remarks;

                this.dpdate = moment(this.enquiry.closeDate).format('MM/DD/YYYY');
                //console.log(this.dpdate,'date');
				this.active_milestone = [{id: result.enquiryDetail.mileStoneId, text: result.enquiryDetail.mileStoneName}];
                this.active_contact = [{id: result.enquiryDetail.contactId, text: result.enquiryDetail.contactName}];
                if(result.enquiryDetail.mileStoneStatusId){
                    this.active_milestonestatus = [{id: result.enquiryDetail.mileStoneStatusId, text: result.enquiryDetail.mileStoneStatusName}];
                }
				this.active_company = [{id: result.enquiryDetail.companyId, text: result.enquiryDetail.companyName}];
            }
        });
    }
    createQuotation(){
        this.createQModal.show(this.enquiry,'quotation');
    }

    getEnqQuotation(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this._enquiryService.getEnquiryQuotation(this.id,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,this.primengDatatableHelper.getSkipCount(this.paginator,event)
            ).subscribe((result) => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
				this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
				
            });
        
    }

	
	editQuotation(data): void {
        this.router.navigate(['app/main/quotation/editquotation/'+data.id]);
    }
    
	deleteQuotation(data):void{
       		this.message.confirm(
		this.l('Are you sure to Delete the Quotation', data.subjectName),
		isConfirmed => {
			if (isConfirmed) {
				this._quotationProxyService.deleteQuotation(data.id)
                    .subscribe(result => {
		  	this.notify.success(this.l("Deleted Successfully"));
                        this.getEnqQuotation();	
				
				});
			} 
			 
		});
	}
	
	 save(): void {
        this.saving = true;
		if (this.enquiry.id == null) {
            this.enquiry.id = 0;
        }
		let stdate= moment(moment(this.dpdate).toDate().toString());
         this.enquiry.closeDate = moment(stdate).add(6, 'hours');
        //console.log( this.enquiry);
		this.enquiry.tenantId = abp.multiTenancy.getTenantIdCookie();
		this._enquiryService.createOrUpdateEnquiry(this.enquiry).finally(() => this.saving = false)
            .subscribe(() => {
			this.notify.success(this.l('SavedSuccessfully'));
			this.enquiry = new EnquiryInput();
            this.close();
                
			
        }); 
 
    }
	
    onShown(): void {
        //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        var locat = this.router.url.slice(0, -1);
        this.router.navigate([locat]);
		this.router.navigate(['/app/main/leads']);	
        this.active = false;
    }

    getData(event?: LazyLoadEvent): void {

        this._activityService.getEnquiryWiseActivity(this.id)
            .subscribe((result) => {
               this.records=result.items;

            });

    }

    createActivity(){
        this.createEActivityModal.show(this.enquiry_detail,0);
    }
    editAct(data){
        this.createEActivityModal.show(this.enquiry_detail,data.id);
    }


    deleteAct(record): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Activity'),
                isConfirmed => {
                if (isConfirmed) {
                      this._activityService.getDeleteActivity(record.id).subscribe(result=>{
                     if(result)
                     {
                     this.notify.error(this.l('This could not be deleted'));
                     }else{
                         this.getData();
                     }
                     });
                }
            });
    }
	
	  getCompany():void{
        this._selectProxyService.getCompany().
            subscribe((result)=>{
                if(result.select2data != null){

                    this.companytypes=result.select2data;
                    this.companytypo = [];
                    this.companytypes.forEach((company:{id:number, name:string}) => {
                        this.companytypo.push({
                            id: company.id,
                            text: company.name
                        });
                    });
                }


            });

    }
	
	getMilestone():void{

        this._selectProxyService.getEnqMilestone().
            subscribe((result)=>{
				if(result.select2data != null){
                    this.milestones=result.select2data;
                    this.milestone = [];
                    this.milestones.forEach((company:{id:number, name:string}) => {
                        this.milestone.push({
                            id: company.id,
                            text: company.name
                        });
                    });

                }
            });
    }
	getCompanyContact():void{
        this._selectProxyService.getCompanyContact(this.enquiry.companyId).
            subscribe((result)=>{

                if(result.select2data != null){

                    this.contactlist=result.select2data;
                    this.contact = [];
                    this.contactlist.forEach((company:{id:number, name:string}) => {
                        this.contact.push({
                            id: company.id,
                            text: company.name
                        });
                    });

                }
            });
    }
	  getStatusbyMilestone():void{
        //console.log('mile',this.enquiry.mileStoneId);
        this._selectProxyService.getMileStoneMileStatus(this.enquiry.mileStoneId).
            subscribe((result)=>{

                if(result.select2data != null){

                    this.statuslist=result.select2data;
                    this.status = [];
                    this.statuslist.forEach((company:{id:number, name:string}) => {
                        this.status.push({
                            id: company.id,
                            text: company.name
                        });
                    });
                }
            });
    }


 doSomething(data): void {
	
        this.enquiry.companyId = data.id;
		this.getCompanyContact();
    }
    removeType(data?:any){
        this.enquiry.companyId=null;
        this.enquiry.contactId=null;
        this.active_contact=[];
        this.contact = [];
    }
	 selectContact(data): void {
        //console.log(data.id,'contact id');
        this.enquiry.contactId = data.id;
    }
    removeContact(data?:any){
        this.enquiry.contactId = null;
    }

    selectMilestone(data): void {
		
        this.enquiry.mileStoneId = data.id;
		this.getStatusbyMilestone();
    }
    removeMilestone(data?:any){
        // this.infotype.countryId = null;
        this.enquiry.mileStoneId = null;
        this.enquiry.mileStoneStatusId=null;
        this.active_milestonestatus=[];
    }
    selectStatus(data): void {
        this.enquiry.mileStoneStatusId = data.id;

    }
    removeStatus(data?:any){
        this.enquiry.mileStoneStatusId =null;
    }
    refreshCompany(value):void{

        //console.log(value,78);
        this.enquiry.companyId=value.id;
        this.enquiry.contactId=null;
        this.active_contact=[];
        this.getCompanyContact();

    }
    refreshMile(value):void{

       // console.log(value,78);
        this.enquiry.mileStoneId=value.id;
        this.enquiry.mileStoneStatusId=null;
        this.active_milestonestatus=[];
        this.getStatusbyMilestone();

    }
	


}