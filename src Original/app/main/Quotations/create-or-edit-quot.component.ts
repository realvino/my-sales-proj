import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute,Router } from "@angular/router";
import { QuotationServiceProxy,QuotationList,CreateQuotationInput,Select2ServiceProxy,Datadto,Datadto3,Datadto5 } from "shared/service-proxies/service-proxies";


export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createQModal',
    templateUrl: './create-or-edit-quot.component.html'
})
export class CreateQModalComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    active = false;
    saving = false;
    saving_btn:boolean=false;
    quotation:QuotationList = new QuotationList();
    quotation_input:CreateQuotationInput = new CreateQuotationInput();
    eventOriginal = this.quotation_input;
    companies:Array<any>=[];
    company=[];
    companycontacts:Array<any>=[];
    companyContact:Datadto[];
    currencies:Array<any>=[];
    currency:Datadto3[];
    salesman:string;
    showcontact:boolean=false;
    dis:boolean=false;
    quotationTitle:Array<any>=[];
    enquiry:Array<any>=[];

    quotationTitleArray:Datadto[];
    enquiryArray:Datadto[];
    enquiryDetail:Datadto5 =  new Datadto5();


    disable_company:boolean=false;

    come_from:string = "";
    enquiryDetails:any;
    active_company:SelectOption[];
    active_contact:SelectOption[];
    active_currency:SelectOption[];
    disable_save: boolean= true;


    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private router:Router,
        private _selectProxyService: Select2ServiceProxy,
        private _quotationServiceProxy:QuotationServiceProxy
    ) {
        super(injector);
		
    }
    
    show(enquiry?: any,type?:string): void  {
        this.quotation_input = new CreateQuotationInput();
        var the_url = window.location.pathname;
        var the_arr = the_url.split('/');
        the_arr.pop();
        var from_location = the_arr[3];
        //console.log(from_location,'loc');
        if(from_location=='leads'){
            this.disable_company = true;
        }
        else this.disable_company = false;
        this.salesman = null;
        this.come_from = type;
        this.enquiryDetails = enquiry;
        if(enquiry.id > 0){
            this._selectProxyService.getEnquiryDetail(enquiry.id).subscribe(result=>{
                if(result.select2data!=null){
                    this.dis = true;
                    this.quotation_input.enquiryId = enquiry.id;
                    this.enquiryDetail = result.select2data; 
                    this.quotation_input.currencyId = this.enquiryDetail.currencyId;
                    this.quotation_input.salesmanId = this.enquiryDetail.salesId;
                    this.quotation_input.companyId = this.enquiryDetail.companyId;
                    this.quotation_input.contactId = this.enquiryDetail.contactId;
                    this.active_company=[{id:this.enquiryDetail.id, text:this.enquiryDetail.name}];
                    if(this.quotation_input.salesmanId > 0  && this.quotation_input.currencyId > 0){
                        this.disable_save = false;
                    }
                }
            });
        }
        this.active = true;
        this.saving_btn=true;
        this.getCompany();
        this.getCurrency();
        this.getQuotationTitle();
        this.modal.show();


    }

   save(): void {
        this.saving = true;

        if(this.enquiryDetails.companyId !=null){
            this.quotation_input.companyId=this.enquiryDetails.companyId;
            this.quotation_input.contactId=this.enquiryDetails.contactId;
            this.quotation_input.enquiryId=this.enquiryDetails.id;
            this.quotation_input.mileStoneId=this.enquiryDetails.mileStoneId;
        }
        
        if(this.quotation_input.salesmanId == 0){
           this.saving_btn=true;
              this.quotation_input.salesmanId=null;
        }
        else this.saving_btn=false;

        if (this.quotation_input.id == null) {
               this.quotation_input.id = 0;
        }

        this.quotation_input.tenantId= abp.multiTenancy.getTenantIdCookie();
             this._quotationServiceProxy.createOrUpdateQuotation(this.quotation_input).finally(() => this.saving = false)
                .subscribe((result) => {
                   this.close();
                   this.notify.success(this.l('Saved Successfully'));
                  this.modalSave.emit(this.quotation_input);
                //   if(this.come_from=='quotation'){
                //     this.router.navigate(['app/main/quotation/editquotation/',result]);
                // }
                this.router.navigate(['app/main/quotation/editquotation/',result]);
                     this.quotation_input = new CreateQuotationInput();

            }); 
              

    }
    onShown(): void {
       // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.quotation_input = new CreateQuotationInput();
    }
    getCompany(){

        this._selectProxyService.getCompany().subscribe(result=>{           
            if(result.select2data!=null){
                this.company = result.select2data;
                this.companies = [];
                this.company.forEach((quo:{id:number,name:string})=>{
                    if(this.enquiryDetails.companyId==quo.id){
                        this.active_company=[{id:quo.id,text:quo.name}];
                        this.quotation_input.companyId=this.enquiryDetails.companyId;
                     }    
                    this.companies.push({
                        id:quo.id,
                        text:quo.name
                    });
                    
                });
                this.company.forEach((quo:{id:number,salesId:number,salesName:string})=>{
                    if(this.enquiryDetails.companyId==quo.id)
                    {
                        this.salesman = quo.salesName;
                    }
                    if(this.quotation_input.companyId==quo.id){
                        this.quotation_input.salesmanId=quo.salesId;
                        this.salesman = quo.salesName;
                        if(this.quotation_input.salesmanId==0||this.quotation_input.salesmanId==null) this.saving_btn=true;
                        else this.saving_btn=false;  
                                         
                    }
                });
            }
            this.getCompanyContact(this.enquiryDetails.companyId); 
            this.saving_btn=false;           
        });

        /* this._selectProxyService.getCompany().subscribe(result=>{
            if(result.select2data!=null){
                this.company = result.select2data;
                this.companies = [];
                this.company.forEach((quo:{id:number,name:string})=>{


                    this.companies.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
                this.company.forEach((quo:{id:number,salesId:number,salesName:string})=>{

                    if(this.quotation_input.companyId==quo.id){
                        this.quotation_input.salesmanId=quo.salesId;
                        this.salesman = quo.salesName;
                        if(this.quotation_input.salesmanId==0||this.quotation_input.salesmanId==null) this.saving_btn=true;
                        else this.saving_btn=false;
                    }
                });
            }
        }); */

    }

    getCompanyContact(id){

        this._selectProxyService.getCompanyContact(id).subscribe(result=>{
            if(result.select2data!=null){
                this.companyContact = result.select2data;
                this.companycontacts = [];
                this.companyContact.forEach((quo:{id:number,name:string})=>{
                    if(this.enquiryDetails.contactId==quo.id){
                        this. active_contact=[{id:quo.id,text:quo.name}];
                        this.quotation_input.contactId=this.enquiryDetails.contactId;
                        this.showcontact=true;                     
                    }  
                    this.companycontacts.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getCurrency(){
        this._selectProxyService.getCurrency().subscribe(result=>{
            if(result.select3data!=null){
                this.currency = result.select3data;
                this.currencies = [];
                this.currency.forEach((quo:{id:number,code:string})=>{

                    this.currencies.push({
                        id:quo.id,
                        text:quo.code
                    });
                });
            }
        });
    }
    private selectedCompany(data){
        this.quotation_input.companyId=data.id;
     
        this.getCompanyContact(data.id);
        this.showcontact=true;
        this.company.forEach((quo:{id:number,salesId:number,salesName:string})=>{

            if(this.quotation_input.companyId==quo.id){
                //console.log(this.quotation_input.companyId,quo.salesId);
                this.quotation_input.salesmanId=quo.salesId;
                this.salesman = quo.salesName;
                if(this.quotation_input.salesmanId==0||this.quotation_input.salesmanId==null) this.saving_btn=true;
                else this.saving_btn=false;
            }
        });

    }
    getQuotationTitle(){

        this._selectProxyService.getQuotationTitle().subscribe(result=>{
			//console.log(result,'quotation');
            if(result.select2data!=null){
                this.quotationTitleArray = result.select2data;
                this.quotationTitle = [];
                this.quotationTitleArray.forEach((quo:{id:number,name:string})=>{


                    this.quotationTitle.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }

    searchEnquiry(data){
        this._selectProxyService.getEnquiry(data).subscribe(result=>{
			//console.log(result,'enquiry');
            if(result.select2data!=null){
                this.enquiryArray = result.select2data;
                this.enquiry = [];
                this.enquiryArray.forEach((enq:{id:number,name:string})=>{


                    this.enquiry.push({
                        id:enq.id,
                        text:enq.name
                    });
                });
            }
        });
    }
    selectedEnquiry(data){
        this._selectProxyService.getEnquiryDetail(data.id).subscribe(result=>{
			//console.log(result,'enquiry');
            if(result.select2data!=null){
                this.enquiryDetail = result.select2data; 
                this.quotation_input.enquiryId = data.id;
                this.quotation_input.currencyId = this.enquiryDetail.currencyId;
                this.quotation_input.salesmanId = this.enquiryDetail.salesId;
                this.quotation_input.companyId = this.enquiryDetail.companyId;
                this.quotation_input.contactId = this.enquiryDetail.contactId;
                if(this.quotation_input.salesmanId > 0  && this.quotation_input.currencyId > 0){
                    this.disable_save = false;
                }

            }
        });
    }
    removedEnquiry(data){
        this.enquiryDetail =  new Datadto5();
        this.quotation_input.enquiryId = null;
    }
    
    private removedCompany(data){
        this.quotation_input.companyId=null;
        this.showcontact=false;
        this.quotation_input.salesmanId=null;
        if(this.quotation_input.salesmanId==0||this.quotation_input.salesmanId==null) {
            this.saving_btn=true;

        }
        else {
            this.saving_btn=false;

        }
        if(this.quotation_input.subjectName == '' || this.quotation_input.subjectName == undefined || this.quotation_input.currencyId == null || this.quotation_input.currencyId == undefined || this.quotation_input.salesmanId == null || this.quotation_input.salesmanId == undefined || this.quotation_input.companyId== null || this.quotation_input.companyId == undefined || this.quotation_input.contactId == null || this.quotation_input.contactId == undefined){
            this.disable_save= true;
        }
        else this.disable_save = false;
        this.salesman ='';

    }
    private selectedCurrency(data){
        this.quotation_input.currencyId=data.id;
        if( this.quotation_input.subjectName == '' || this.quotation_input.subjectName == undefined || this.quotation_input.currencyId == null || this.quotation_input.currencyId == undefined || this.quotation_input.salesmanId == null || this.quotation_input.salesmanId == undefined || this.quotation_input.companyId== null || this.quotation_input.companyId == undefined || this.quotation_input.contactId == null || this.quotation_input.contactId == undefined){
            this.disable_save= true;
        }
        else this.disable_save = false;

    }
    private removedCurrency(data){
        this.quotation_input.currencyId=null;
        this.disable_save = true;
    }
    private selectedCompanyContact(data){
          this.quotation_input.contactId=data.id;
        if(this.quotation_input.subjectName == '' || this.quotation_input.subjectName == undefined || this.quotation_input.currencyId == null || this.quotation_input.currencyId == undefined || this.quotation_input.salesmanId == null || this.quotation_input.salesmanId == undefined || this.quotation_input.companyId== null || this.quotation_input.companyId == undefined || this.quotation_input.contactId == null || this.quotation_input.contactId == undefined){
            this.disable_save= true;
        }
        else this.disable_save = false;
    }
    private removedCompanyContact(data){
        this.quotation_input.contactId=null;
        this.disable_save = true;
    }
    private selectedTitle(data){
		
        this.quotation_input.quotationTitleId=data.id;

    }
    private removedTitle(data){
        this.quotation_input.quotationTitleId=null;
    }


    nameChange(data){

        if( data.trim() == ''  || this.quotation_input.currencyId == null || this.quotation_input.currencyId == undefined || this.quotation_input.salesmanId == null || this.quotation_input.salesmanId == undefined || this.quotation_input.companyId== null || this.quotation_input.companyId == undefined || this.quotation_input.contactId == null || this.quotation_input.contactId == undefined){
            this.disable_save= true;
        }
        else this.disable_save = false;
    }

    refreshCompany(value):void{

        this.quotation_input.companyId=value.id;
        this.quotation_input.contactId=null;
        this.active_contact=[];
        this.getCompanyContact(value.id);

    }

}
