import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {CalendarModule} from 'primeng/primeng';
// import { CompanyContactServiceProxy,CreateCompanyOrContact } from '@shared/service-proxies/service-proxies';
import { Select2ServiceProxy,EnquiryInput,EnquiryServiceProxy, QuotationServiceProxy, PaymentScheduleLists, CreatePaymentScheduleInput } from "shared/service-proxies/service-proxies";

import * as moment from "moment";

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createPaymentScheduleModal',
    templateUrl: './create-or-edit-paymentSchedule.component.html'
})
export class CreatePaymentScheduleComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    active = false;
    saving = false;
    active_user :SelectOption[];
    tenantId:number;
    scheduleDate:string;
    paymentSchedule : PaymentScheduleLists = new PaymentScheduleLists();
    paymentScheduleInput : CreatePaymentScheduleInput = new CreatePaymentScheduleInput();

    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _quotationService: QuotationServiceProxy
    ) {
        super(injector);
        this.tenantId = abp.multiTenancy.getTenantIdCookie();
    }

    show(payScheduleId?: number, quotationId?: number): void {
        this.paymentScheduleInput = new CreatePaymentScheduleInput();
        this.paymentScheduleInput.quotationId = quotationId;
        if(payScheduleId > 0){
            this._quotationService.getPaymentScheduleForEdit(payScheduleId).subscribe((result) => {
               if (result != null) {
                this.paymentSchedule = result;
                this.paymentScheduleInput.id =  this.paymentSchedule.id;
                this.paymentScheduleInput.quotationId =  this.paymentSchedule.quotationId;
                if(this.paymentSchedule.scheduledDate != null)
                {
                   this.scheduleDate = moment(this.paymentSchedule.scheduledDate).format('MM/DD/YYYY');
                }
                this.paymentScheduleInput.total =  this.paymentSchedule.total;
                this.active_user = [{id: this.paymentSchedule.userId, text: this.paymentSchedule.userName}];
               }
            });
        }
        this.active = true;
        this.modal.show();
    }
    save(): void {
        this.saving = false;
        if (this.paymentScheduleInput.id == null) {
            this.paymentScheduleInput.id = 0;
        }
        if(this.scheduleDate){
            let stdate= moment(moment(this.scheduleDate).toDate().toString());
            this.paymentScheduleInput.scheduledDate = moment(stdate).add(6, 'hours');
        }
        this.paymentScheduleInput.tenantId=this.tenantId;
        this._quotationService.createOrUpdatePaymentSchedule(this.paymentScheduleInput).
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

}