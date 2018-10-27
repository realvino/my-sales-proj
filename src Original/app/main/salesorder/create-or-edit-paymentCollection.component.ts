import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {CalendarModule} from 'primeng/primeng';
// import { CompanyContactServiceProxy,CreateCompanyOrContact } from '@shared/service-proxies/service-proxies';
import { Select2ServiceProxy,EnquiryInput,EnquiryServiceProxy, QuotationServiceProxy, PaymentCollectionLists, CreatePaymentCollectionInput, Datadto3, Datadto } from "shared/service-proxies/service-proxies";

import * as moment from "moment";

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createPaymentCollectionModal',
    templateUrl: './create-or-edit-paymentCollection.component.html',
    styleUrls : ['./create-or-edit-paymentCollection.component.css']
})
export class CreatePaymentCollectionComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    active = false;
    saving = false;
    active_payment :SelectOption[];
    active_currency: SelectOption[];
    tenantId:number;
    chequeDate:string;
    bankDate:string;
    paymentCollection : PaymentCollectionLists = new PaymentCollectionLists();
    paymentCollectionInput : CreatePaymentCollectionInput = new CreatePaymentCollectionInput();
    payment:Array<any>=[];
    currency:Array<any>=[];
    currencies:Datadto3[];
    payments:Datadto[];
    pointenable:string="yes";
    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _quotationService: QuotationServiceProxy
    ) {
        super(injector);
        this.tenantId = abp.multiTenancy.getTenantIdCookie();
    }

    show(payCollectionId?: number, quotationId?: number): void {   
        this.pointenable ="yes";
        this.paymentCollectionInput = new CreatePaymentCollectionInput();
        this.paymentCollectionInput.quotationId = quotationId;
        this._selectProxyService.getCurrency().subscribe(result=> {
            if (result.select3data != null) {
                this.currency = [];
                this.currencies = result.select3data;
                this.currencies.forEach((curr:{id:number,name:string})=> {
                    this.currency.push({
                        id: curr.id,
                        text: curr.name
                    });

                    if(curr.name == 'United States Dollar'){
                        this.paymentCollectionInput.currencyId=curr.id;
                        this.active_currency = [{id: this.paymentCollectionInput.currencyId, text: curr.name}];
                    }
                });
            }
        });

        this._selectProxyService.getPayments().subscribe(result=> {
            if (result.select2data != null) {
                this.payment = [];
                this.payments = result.select2data;
                this.payments.forEach((pay:{id:number,name:string})=> {
                    this.payment.push({
                        id: pay.id,
                        text: pay.name
                    });
                });
            }
        });
        this._selectProxyService.getDueAmount(quotationId).subscribe(result=> {
            if (result.select6data != null) {
                this.paymentCollectionInput.dueAmount = result.select6data.dueAmount;
            }
        });

        if(payCollectionId > 0){
            this._quotationService.getPaymentCollectionForEdit(payCollectionId).subscribe((result) => {
               if (result != null) {
                this.paymentCollection = result;
                this.paymentCollectionInput.id =  this.paymentCollection.id;
                this.paymentCollectionInput.quotationId =  this.paymentCollection.quotationId;
                this.paymentCollectionInput.salesInvoiceNUmber =  this.paymentCollection.salesInvoiceNUmber;
                this.paymentCollectionInput.paymentId =  this.paymentCollection.paymentId;
                if(this.paymentCollection.paymentId >0){
                    this.active_payment = [{id: this.paymentCollection.paymentId, text: this.paymentCollection.paymentName}];
                }
                this.paymentCollectionInput.amount =  this.paymentCollection.amount;
                this.paymentCollectionInput.dueAmount =  this.paymentCollection.dueAmount;
                this.paymentCollectionInput.chequeNo =  this.paymentCollection.chequeNo;
                this.paymentCollectionInput.voucherNo =  this.paymentCollection.voucherNo;
                if(this.paymentCollection.chequeDate != null)
                {
                   this.chequeDate = moment(this.paymentCollection.chequeDate).format('MM/DD/YYYY');
                }
                if(this.paymentCollection.bankDate != null)
                {
                   this.bankDate = moment(this.paymentCollection.bankDate).format('MM/DD/YYYY');
                }
                
                if(this.paymentCollection.received == true){
                    this.pointenable = "no";
                }

                this.paymentCollectionInput.remarks = this.paymentCollection.remarks;
                this.paymentCollectionInput.currencyId =  this.paymentCollection.currencyId;
                if(this.paymentCollection.currencyId >0){
                    this.active_currency = [{id: this.paymentCollection.currencyId, text: this.paymentCollection.currencyName}];
                }
                this.paymentCollectionInput.received = this.paymentCollection.received;
               }
            });
        }
        this.active = true;
        this.modal.show();
    }
    save(): void {
        this.saving = false;
        if (this.paymentCollectionInput.id == null) {
            this.paymentCollectionInput.id = 0;
        }
        if(this.chequeDate){
            let stdate= moment(moment(this.chequeDate).toDate().toString());
            this.paymentCollectionInput.chequeDate = moment(stdate).add(6, 'hours');
        }
        if(this.bankDate){
            let stdate= moment(moment(this.bankDate).toDate().toString());
            this.paymentCollectionInput.bankDate = moment(stdate).add(6, 'hours');
        }
        this.paymentCollectionInput.tenantId=this.tenantId;
        this._quotationService.createOrUpdatePaymentCollection(this.paymentCollectionInput).
            finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit();
        });

    }
    onShown(): void {
        //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
    selectPayment(data): void {
        this.paymentCollectionInput.paymentId = data.id;
    }
    removePayment(data?:any){
        this.paymentCollectionInput.paymentId=null;
        this.active_payment=[];
    }
    selectCurrency(data): void {
        this.paymentCollectionInput.currencyId = data.id;
    }
    removeCurrency(data?:any){
        this.paymentCollectionInput.currencyId=null;
        this.active_currency=[];
    }


}