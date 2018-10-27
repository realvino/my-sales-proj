import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationEnd } from "@angular/router";
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationServiceProxy,QuotationList,CreateQuotationInput,Select2ServiceProxy,Datadto,Datadto3, UpdateQuotationTotal } from "shared/service-proxies/service-proxies";
import {CreateEditQProductComponent} from './create-or-edit-product.component';
import { QuotationPreviewModalComponent } from "./quotation-preview.component";
import {Location} from '@angular/common';
import { CreateEditqserviceComponent } from '@app/main/Quotations/create-or-edit-qservice.component';

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    //selector: 'createQuotationModal',
    templateUrl: './create-or-edit-quotation.component.html',
    styleUrls : ['./create-or-edit-quotation.component.css']
})
export class CreateEditQuotationComponent extends AppComponentBase implements OnInit {


    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('createQProductModal') createQProductModal: CreateEditQProductComponent;
    @ViewChild('quotationPreviewModal') quotationPreviewModal: QuotationPreviewModalComponent;
    @ViewChild('createQServiceModal') createQServiceModal: CreateEditqserviceComponent;
    private _location: Location;
    quotationTitle:Array<any>=[];
    quotationTitleArray:Datadto[];
    companies:Array<any>=[];
    company=[];
    companycontacts:Array<any>=[];
    companyContact:Datadto[];
    currencies:Array<any>=[];
    currency:Datadto3[];
    copyContacts:Array<any>=[];
    copyContact:Datadto[];
    warrantyData:Array<any>=[];
    warranty:Datadto[];
    validityData:Array<any>=[];
    validity:Datadto[];
    deliveryData:Array<any>=[];
    delivery:Datadto[];
    packingData:Array<any>=[];
    packing:Datadto[];
    freightData:Array<any>=[];
    freight:Datadto[];
    paymentData:Array<any>=[];
    payment:Datadto[];
    statusData:Array<any>=[];
    reason:Array<any>=[];
    reasonData:Datadto[];
    competitor:Array<any>=[];
    competitorData:Datadto[];
    qProducts:Array<any>=[];
    qServices:Array<any>=[];
    status:Datadto[];
    private sub: any;
    private id: number;
    //private total: number;
    active_title:SelectOption[];
    active_company:SelectOption[];
    active_currency:SelectOption[];
    active_payment:SelectOption[];
    active_validity:SelectOption[];
    active_delivery:SelectOption[];
    active_freight:SelectOption[];
    active_warranty:SelectOption[];
    active_packing:SelectOption[];
    active_contact:SelectOption[];
    active_reason:SelectOption[];
    active_competitor:SelectOption[];
    showcontact:boolean=false;
    salesman:string;
    saving_btn:boolean=false;
    pointenable:string="yes";
	loading:boolean = false;
	quotation:QuotationList = new QuotationList();
    quotation_input:CreateQuotationInput = new CreateQuotationInput();
    active = false;
    saving = false;
    total: string;
    updateQuotTot:UpdateQuotationTotal = new UpdateQuotationTotal();
    vatAmount: string;
    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _quotationServiceProxy:QuotationServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private route:Router
    ) {
        super(injector);
        this.sub = this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            /* if(this.id!=0){
                this.getEditQuoation(this.id);
				this.getQuotationTitle();
				this.getCompany();
				this.getCurrency();
				this.getWarranty();
				this.getValidity();
				this.getPayment();
				this.getPacking();
				this.getDelivery();
				this.getFreight();
				this.getStatus();
                this.getQuotationProduct(this.id);
            } */

        });
        /* this.getQuotationTitle();
        this.getCompany();
        this.getCurrency();
        this.getWarranty();
        this.getValidity();
        this.getPayment();
        this.getPacking();
        this.getDelivery();
        this.getFreight();
        this.getStatus(); */


    }
    ngOnInit(){
        this.active= true;
        this.pointenable ="yes";
        if(this.id!=0){
            this.getEditQuoation(this.id);
            this.getQuotationProduct(this.id);
        }
        this.getQuotationTitle();
        this.getCompany();
        this.getCurrency();
        this.getWarranty();
        this.getValidity();
        this.getPayment();
        this.getPacking();
        this.getDelivery();
        this.getFreight();
        this.getStatus();
        this.getReason();
        this.getCompetitor();
        this.getQuotationService(this.id);
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    getEditQuoation(id){
        this.loading = true;
        this._quotationServiceProxy.getQuotationForEdit(id)
            .subscribe((result) => {
                this.quotation_input =result.quotations;
                this.quotation = result.quotations;

                this.active_title=[{id:this.quotation.quotationTitleId,text:this.quotation.quotationTitleName}];
                this.active_company=[{id:this.quotation.companyId,text:this.quotation.companyName}];
                this.active_contact=[{id:this.quotation.contactId,text:this.quotation.contactName}];
                this.active_currency=[{id:this.quotation.currencyId,text:this.quotation.currencyName}];
                this.active_warranty=[{id:this.quotation.warrantyId,text:this.quotation.warrantyName}];
                this.active_validity=[{id:this.quotation.validityId,text:this.quotation.validityName}];
                this.active_packing=[{id:this.quotation.packingId,text:this.quotation.packingName}];
                this.active_delivery=[{id:this.quotation.deliveryId,text:this.quotation.deliveryName}];
                this.active_payment=[{id:this.quotation.paymentId,text:this.quotation.paymentName}];
                this.active_freight=[{id:this.quotation.freightId,text:this.quotation.freightName}];
                this.active_reason=[{id:this.quotation.reasonId,text:this.quotation.reasonName}];
                this.total = this.quotation.overAllTotal.toFixed(2);
                if(this.quotation_input.salesmanId==0 || this.quotation_input.salesmanId==null) this.saving_btn=true;
                else this.saving_btn=false;
                if(this.quotation.won == true || this.quotation.lost == true){
                    this.pointenable = "no";
                }
                if(this.quotation_input.vat){
                    this.quotation_input.vatAmount = ((this.quotation.overAllTotal/this.quotation.exchangeRate) * this.quotation_input.vatPercentage)/100;
                    this.vatAmount = (this.quotation_input.vatAmount * this.quotation.exchangeRate).toFixed(2);
                    this.total = (this.quotation.overAllTotal + (this.quotation_input.vatAmount * this.quotation.exchangeRate)).toFixed(2);                
                }
                else{
                    this.quotation_input.vatAmount = 0;
                }

                this.getCompany();
                this.loading = false;
            });
    }
    getQuotationProduct(id){
        this._quotationServiceProxy.getQuotationProduct(id).subscribe((res)=>{
            this.qProducts =res.items;
        });
    }

    getQuotationTitle(){
        this._selectProxyService.getQuotationTitle().subscribe(result=>{
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
    getCompany(){
        this._selectProxyService.getCompany().subscribe(result=>{
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
                        this.getCompanyContact(this.quotation_input.companyId);
                        if(this.quotation_input.salesmanId==0) this.saving_btn=true;
                        else this.saving_btn=false;
                    }
                });
            }
        });
    }

    getCompanyContact(id){

        this._selectProxyService.getCompanyContact(id).subscribe(result=>{
            if(result.select2data!=null){
                this.companyContact = result.select2data;
                this.companycontacts = [];
                this.companyContact.forEach((quo:{id:number,name:string})=>{
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

    getCopyCompanyContact(id){
        this._selectProxyService.getCompanyContact(id).subscribe(result=>{
            if(result.select2data!=null){
                this.copyContact = result.select2data;
                this.copyContacts = [];
                this.copyContact.forEach((quo:{id:number,name:string})=>{
                    this.copyContacts.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }

    getWarranty(){
        this._selectProxyService.getWarranty().subscribe(result=>{
            if(result.select2data!=null){
                this.warranty = result.select2data;
                this.warrantyData = [];
                this.warranty.forEach((quo:{id:number,name:string})=>{
                    this.warrantyData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getValidity(){
        this._selectProxyService.getValidity().subscribe(result=>{
            if(result.select2data!=null){
                this.validity = result.select2data;
                this.validityData = [];
                this.validity.forEach((quo:{id:number,name:string})=>{
                    this.validityData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getPacking(){
        this._selectProxyService.getPacking().subscribe(result=>{
            if(result.select2data!=null){
                this.packing = result.select2data;
                this.packingData = [];
                this.packing.forEach((quo:{id:number,name:string})=>{
                    this.packingData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getDelivery(){
        this._selectProxyService.getDelivery().subscribe(result=>{
            if(result.select2data!=null){
                this.delivery = result.select2data;
                this.deliveryData = [];
                this.delivery.forEach((quo:{id:number,name:string})=>{
                    this.deliveryData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getPayment(){
        this._selectProxyService.getPayment().subscribe(result=>{
            if(result.select2data!=null){
                this.payment = result.select2data;
                this.paymentData = [];
                this.payment.forEach((quo:{id:number,name:string})=>{
                    this.paymentData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }
    getFreight(){
        this._selectProxyService.getFreight().subscribe(result=>{
            if(result.select2data!=null){
                this.freight = result.select2data;
                this.freightData = [];
                this.freight.forEach((quo:{id:number,name:string})=>{
                    this.freightData.push({
                        id:quo.id,
                        text:quo.name
                    });
                });
            }
        });
    }

    getStatus(){
        this._selectProxyService.getStatus().subscribe(result=>{
            if(result.select2data!=null){
                this.status = result.select2data;
                this.statusData = [];
                this.status.forEach((quo:{id:number,name:string})=>{
                    this.statusData.push({
                        id:quo.id,
                        text:quo.name,
                        stat_switch:quo.name=='Won'?this.quotation.won:false || quo.name=='Lost'?this.quotation.lost:false || quo.name=='Submitted'?this.quotation.submitted:false,
                        switch_disable:false
                    });
                });
          if(this.quotation.statusName =="Revised")
            {
              let revised_ind = this.statusData.findIndex(x=> x.text == "Revised");

              this.statusData[revised_ind].stat_switch = true;

            }
            }
        });
    }
    getReason(){
        this._selectProxyService.getReason().subscribe(result=>{
            if(result.select2data!=null){
                this.reasonData = result.select2data;
                this.reason = [];
                this.reasonData.forEach((rea:{id:number,name:string})=>{
                    this.reason.push({
                        id:rea.id,
                        text:rea.name
                    });
                });
            }
        });
    }
    getCompetitor(){
        this._selectProxyService.getCompetitor().subscribe(result=>{
            if(result.select2data!=null){
                this.competitorData = result.select2data;
                this.competitor = [];
                this.competitorData.forEach((compet:{id:number,name:string})=>{
                    this.competitor.push({
                        id:compet.id,
                        text:compet.name
                    });
                });
            }
        });
    }
    selectedTitle(data){
        this.quotation_input.quotationTitleId=data.id;
    }
    removedTitle(data){
        this.quotation_input.quotationTitleId=null;
    }
    selectedCompany(data){
        this.quotation_input.companyId=data.id;
        this.quotation_input.contactId=null;
		this.active_contact=[];
        this.getCopyCompanyContact(data.id);
        this.getCompanyContact(data.id);
        this.showcontact=true;
        this.company.forEach((quo:{id:number,salesId:number,salesName:string})=>{
            if(this.quotation_input.companyId==quo.id){
                this.quotation_input.salesmanId=quo.salesId;
                this.salesman = quo.salesName;
            }
        });
    }
    removedCompany(data){
        this.quotation_input.companyId=null;
        this.showcontact=false;
		this.quotation_input.contactId=null;
		this.active_contact=[];
		this.companycontacts = [];
        this.quotation_input.salesmanId=null;
        this.salesman = null;
    }
    selectedCurrency(data){
        this.quotation_input.currencyId=data.id;

    }
    removedCurrency(data){
        this.quotation_input.currencyId=null;
    }
    selectedCompanyContact(data){
       this.quotation_input.contactId=data.id;
    }
    removedCompanyContact(data){
        this.quotation_input.contactId=null;
    }

    selectedWarranty(data){

        this.quotation_input.warrantyId=data.id;
    }
    removedWarranty(data){
        this.quotation_input.warrantyId=null;
    }
    selectedPayment(data){

        this.quotation_input.paymentId=data.id;
    }
    removedPayment(data){
        this.quotation_input.paymentId=null;
    }
    selectedDelivery(data){
        this.quotation_input.deliveryId=data.id;

    }
    removedDelivery(data){
        this.quotation_input.deliveryId=null;
    }
    selectedFreight(data){
        this.quotation_input.freightId=data.id;

    }
    removedFreight(data){
        this.quotation_input.paymentId=null;
    }
    selectedPacking(data){
        this.quotation_input.packingId=data.id;

    }
    removedPacking(data){
        this.quotation_input.packingId=null;
    }
    selectedValidity(data){
        this.quotation_input.validityId=data.id;

    }
    removedValidity(data){
        this.quotation_input.validityId=null;
    }
    selectedStatus(data){
        this.quotation_input.statusId=data.id;
    }
    removedStatus(data){
        this.quotation_input.statusId=null;
    }
    selectedReason(data){
        this.quotation_input.reasonId=data.id;
    }
    removedReason(data){
        this.quotation_input.reasonId=null;
    }
    selectedCompetitor(data){
        this.quotation_input.competitorId=data.id;
    }
    removedCompetitor(data){
        this.quotation_input.competitorId=null;
    }
    saveQuotation(){

        if (this.quotation_input.id == null) {
            this.quotation_input.id = 0;
        }
        if (this.quotation_input.salesmanId == 0) {
            this.saving_btn=true;
            this.quotation_input.salesmanId = null;
        }
        else this.saving_btn=false;
        if(this.quotation_input.competitorId == 0){
            this.quotation_input.competitorId = null;
        }
        if(!this.quotation_input.overallDiscount){
            this.quotation_input.overallDiscount = 0;
        }
        this.quotation_input.tenantId= abp.multiTenancy.getTenantIdCookie();
        this._quotationServiceProxy.createOrUpdateQuotation(this.quotation_input).finally(() => this.saving = false)
            .subscribe((result) => {
                if(result > 0){
                    console.log(result);
                    this.notify.success(this.l('Saved Successfully'));
                    this.route.navigate(['app/main/quotation/editquotation',result])
                    this.id = result;
                    this.ngOnInit();
                }
        });

    }
    addProduct(quotation){
       this.createQProductModal.show(quotation,0,this.quotation_input.exchangeRate);
    }
    editPro(id){
        this.createQProductModal.show(this.id,id,this.quotation_input.exchangeRate);
    }
    trashPro(id){
        this.message.confirm(
            this.l('Are you sure to Delete the Quotation Product'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._quotationServiceProxy.deleteQuotationProduct(id)
                    .subscribe(result => {
                        this.notify.success(this.l("Deleted Successfully"));
                        this.getQuotationProduct(this.id);
                        this.updateQuotTot.quotationId= this.id;
                        this._quotationServiceProxy.updateQuotationTotal(this.updateQuotTot).finally(() => this.saving = false)
                        .subscribe(() => {
                            this.ngOnInit();
                        });
                    });
                }
            }
        );
    }

    getQuotationService(id){
        this._quotationServiceProxy.getQuotationService(id).subscribe((res)=>{
            this.qServices =res.items;
        });
    }

    addService(quotation){
        this.createQServiceModal.show(quotation);
    }
    editService(id){
        this.createQServiceModal.show(this.id,id);
    }
    deleteService(id){
        this.message.confirm(
            this.l('Are you sure to Delete the Quotation Service'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._quotationServiceProxy.deleteQuotationService(id)
                    .subscribe(result => {
                        this.notify.success(this.l("Deleted Successfully"));
                        this.updateQuotTot.quotationId= this.id;
                        this._quotationServiceProxy.updateQuotationTotal(this.updateQuotTot).finally(() => this.saving = false)
                        .subscribe(() => {
                            this.ngOnInit();
                        });
                    });
                }
            }
        );
    }

    goToQuotation(){
        //this._location.back();
        this.route.navigate(['app/main/quotation']);
    }
    goToEnquiry(){
        this.route.navigate(['/app/main/leads/',this.quotation.enquiryId]);
    }

    quot_preview(i:number){
       // console.log(i,this.id);
        this.quotationPreviewModal.show(this.id,i);
    }
    // getQuotationStatusId(text,statusIndex){

    //     var index = this.statusData.findIndex(x=> x.text == text);
    //     var won_index = this.statusData.findIndex(x=> x.text == 'Won');
    //     var lost_index = this.statusData.findIndex(x=> x.text == 'Lost');
    //     var revised_index = this.statusData.findIndex(x=> x.text == 'Revised');
    //     var submitted_index = this.statusData.findIndex(x=> x.text == 'Submitted');
    //     if(this.statusData[won_index].stat_switch && this.statusData[lost_index].stat_switch && text=='Won'){
    //       this.statusData[lost_index].stat_switch = false;
    //       document.getElementById('Lost').click();
    //     }
    //     if(this.statusData[lost_index].stat_switch && this.statusData[won_index].stat_switch && text=='Lost'){
    //        document.getElementById('Won').click();
    //     }
    //   if(this.statusData[submitted_index].stat_switch && text=='Submitted'){
    //         this.statusData[revised_index].stat_switch = false;
    //         this.quotation_input.revised = false;
    //         this.statusData[won_index].switch_disable = false;
    //        this.statusData[lost_index].switch_disable = false;
           
    //   }
    //   else if(this.statusData[revised_index].stat_switch == true && text=='Revised'){
    //     this.quotation_input.revised = true;
    //     this.statusData[submitted_index].stat_switch = false;
    //   }
    //   else if(this.statusData[revised_index].stat_switch == false && text=='Revised'){
    //     this.quotation_input.revised = false;
    //     this.statusData[submitted_index].stat_switch = true;
    //   }
    //   else {

    //       if(this.quotation.statusName =="Revised")
    //        {
    //          this.statusData[revised_index].stat_switch = true;
    //        }  
          
    //    }

    //    this.quotation_input.won = this.statusData[won_index].stat_switch;
    //    this.quotation_input.lost = this.statusData[lost_index].stat_switch;
    //    this.quotation_input.submitted = this.statusData[submitted_index].stat_switch;
    //    //this.quotation_input.revised = this.statusData[revised_index].stat_switch;

    //     if(!this.quotation_input.submitted && this.quotation_input.won){
    //          document.getElementById('Won').click(); 
    //     }else if(!this.quotation_input.submitted && this.quotation_input.lost){
    //         document.getElementById("Lost").click();
    //     }
    //    if(statusIndex){
    //     this.quotation_input.statusId = this.statusData[index].id;
    //   }else if(this.quotation_input.submitted){
    //     this.quotation_input.statusId = this.statusData[submitted_index].id;
    //     this.quotation_input.submitted = true;
    //   }
    //   else if(this.quotation_input.won){
    //     this.statusData[lost_index].stat_switch = false;
    //   }
    //   else if(this.quotation_input.lost){
    //     this.statusData[lost_index].stat_switch = false;
    //   }
    //   else if(this.quotation_input.revised == true){
    //     this.statusData[submitted_index].stat_switch = false;
    //   }
    //   else if(this.quotation_input.revised == false){

    //     if(this.quotation.statusName =="Submitted"){
    //         this.statusData[submitted_index].stat_switch = true;
    //        }   
    //           }
    //   else if(!this.quotation_input.submitted){
    //     var new_index = this.status.findIndex(x=>x.name == 'New');

    //     this.quotation_input.statusId = this.status[new_index].id;
    //   }else{
    //     this.quotation_input.statusId = this.quotation.statusId;
    //   }
    // }

    getQuotationStatusId(text,statusIndex){
        var index = this.statusData.findIndex(x=> x.text == text);
        var won_index = this.statusData.findIndex(x=> x.text == 'Won');
        var lost_index = this.statusData.findIndex(x=> x.text == 'Lost');
        var revised_index = this.statusData.findIndex(x=> x.text == 'Revised');
        var submitted_index = this.statusData.findIndex(x=> x.text == 'Submitted');
        if(text == 'Submitted'){
           if(statusIndex){
              this.quotation_input.statusId = this.statusData[index].id;
              this.quotation_input.submitted = true;
              this.statusData[revised_index].stat_switch = false;
              this.quotation_input.revised = false;
              this.statusData[won_index].switch_disable = false;
              this.statusData[lost_index].switch_disable = false;
              if(this.quotation.statusName =="Revised"){
                this.statusData[won_index].switch_disable = true;
                this.statusData[lost_index].switch_disable = true;
              }
           }else{
               this.quotation_input.submitted = false;
               this.statusData[won_index].switch_disable = true;
               this.statusData[lost_index].switch_disable = true;
               this.statusData[won_index].stat_switch = false;
               this.statusData[lost_index].stat_switch = false;
               this.quotation_input.won = false;
               this.quotation_input.lost = false;
                if(this.quotation.statusName =="Revised"){
                   this.statusData[revised_index].stat_switch = true;
                   this.quotation_input.statusId = this.statusData[revised_index].id;
                }
                else{
                   var new_index = this.status.findIndex(x=>x.name == 'New');
                   this.quotation_input.statusId = this.status[new_index].id;
                }    
               
           }
        }else if(text == 'Revised'){
            if(statusIndex){
                this.quotation_input.statusId = this.statusData[index].id;
                this.quotation_input.revised = true;
                this.statusData[submitted_index].stat_switch = false;
                this.statusData[won_index].stat_switch = false;
                this.statusData[lost_index].stat_switch = false;
                this.statusData[won_index].switch_disable = true;
                this.statusData[lost_index].switch_disable = true;
                this.quotation_input.won = false;
                this.quotation_input.lost = false;
            }else{
                this.quotation_input.revised = false;
                if(this.quotation.statusName =="Submitted"){
                    this.statusData[submitted_index].stat_switch = true;
                    this.quotation_input.submitted = true;
                    this.statusData[won_index].switch_disable = false;
                    this.statusData[lost_index].switch_disable = false;
                    this.quotation_input.revised = false;
                    this.quotation_input.statusId = this.statusData[submitted_index].id;
                } 
            }
        }else if(text == 'Won'){
            if(statusIndex){
                this.quotation_input.statusId = this.statusData[index].id;
                this.quotation_input.won = true;
                this.quotation_input.lost = false;
                this.quotation_input.reasonId=null;
                this.quotation_input.competitorId=null;
                this.statusData[lost_index].stat_switch = false;
            }else{
                this.quotation_input.won = false;
                this.quotation_input.customerPONumber = null;
                this.quotation_input.salesOrderNumber = null;
                this.quotation_input.statusId = this.statusData[submitted_index].id;
            }
        }else if(text == 'Lost'){
            if(statusIndex){
                this.quotation_input.statusId = this.statusData[index].id;
                this.quotation_input.lost = true;
                this.quotation_input.won = false;
                this.quotation_input.customerPONumber = null;
                this.quotation_input.salesOrderNumber = null;
                this.statusData[won_index].stat_switch = false;
            }else{
                this.quotation_input.lost = false;
                this.quotation_input.reasonId=null;
                this.quotation_input.competitorId=null;
                this.quotation_input.statusId = this.statusData[submitted_index].id;
            }
        }
     }

    receiveMessage($event) {
        this.getEditQuoation(this.quotation_input.id);
    }
    isValidSave(form){
       if(this.quotation_input.lost == true){
           if(!form.valid || !this.quotation_input.companyId || !this.quotation_input.contactId || !this.quotation_input.currencyId || !this.quotation_input.deliveryId || !this.quotation_input.freightId || !this.quotation_input.packingId || !this.quotation_input.validityId || !this.quotation_input.warrantyId || !this.quotation_input.paymentId || !this.salesman || !this.quotation_input.reasonId || !this.quotation_input.competitorId){
             return true;
           }
           else{
             return false;
           }
       }
       else{
           if(!form.valid || !this.quotation_input.companyId || !this.quotation_input.contactId || !this.quotation_input.currencyId || !this.quotation_input.deliveryId || !this.quotation_input.freightId || !this.quotation_input.packingId || !this.quotation_input.validityId || !this.quotation_input.warrantyId || !this.quotation_input.paymentId || !this.salesman){
              return true;
           }
           else{
              return false;
           }
           
       }
    }


}