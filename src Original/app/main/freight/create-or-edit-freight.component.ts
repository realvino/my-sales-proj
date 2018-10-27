import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FreightServiceProxy,CreateFreightInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createFreightModal',
    templateUrl: './create-or-edit-freight.component.html'
})
export class CreateFreightComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    freights: CreateFreightInput = new CreateFreightInput();
    eventOriginal = this.freights;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _freightService: FreightServiceProxy
    ) {
        super(injector);
    }


   show(freightId?: number): void {
        this.freights = new CreateFreightInput();
        this._freightService.getFreightForEdit(freightId).subscribe((result) => {
           if (result.freight != null) {
            this.freights = result.freight;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.freights.id == null) {
               this.freights.id = 0;
           }
           // console.log(this.freights);
		   this.freights.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._freightService.createOrUpdateFreight(this.freights)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('Saved Successfully'));
                this.freights = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.freights);
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
