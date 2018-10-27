import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DeliveryServiceProxy,CreateDeliveryInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createDeliveryModal',
    templateUrl: './create-or-edit-delivery.component.html'
})
export class CreateDeliveryComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    deliveries: CreateDeliveryInput = new CreateDeliveryInput();
    eventOriginal = this.deliveries;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _deliveryService: DeliveryServiceProxy
    ) {
        super(injector);
    }


   show(deliveryId?: number): void {
        this.deliveries = new CreateDeliveryInput();
        this._deliveryService.getDeliveryForEdit(deliveryId).subscribe((result) => {
           if (result.delivery != null) {
            this.deliveries = result.delivery;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.deliveries.id == null) {
               this.deliveries.id = 0;
           }
           // console.log(this.deliveries);
		   this.deliveries.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._deliveryService.createOrUpdateDelivery(this.deliveries)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('Saved Successfully'));
                this.deliveries = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.deliveries);
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
