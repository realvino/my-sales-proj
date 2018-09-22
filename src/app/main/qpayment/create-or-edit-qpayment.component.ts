import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QPaymentServiceProxy,QPaymentInputDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createQpaymentModal',
    templateUrl: './create-or-edit-qpayment.component.html'
})
export class CreateQpaymentComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    qpayment: QPaymentInputDto = new QPaymentInputDto();
    eventOriginal = this.qpayment;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _qpaymentService: QPaymentServiceProxy
    ) {
        super(injector);
    }


   show(paymentId?: number): void {
        this.qpayment = new QPaymentInputDto();
		//console.log(this.qpayment,'p');
       this._qpaymentService.getPaymentForEdit(paymentId).subscribe((result) => {
           if (result.getPayments != null) {
            this.qpayment = result.getPayments;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.qpayment.id == null) {
               this.qpayment.id = 0;
           }
            //console.log(this.qpayment);
			this.qpayment.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._qpaymentService.createOrUpdatePayment(this.qpayment)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.qpayment = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.qpayment);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
}
