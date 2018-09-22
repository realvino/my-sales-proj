import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WarrantyServiceProxy,CreateWarrantyInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createWarrantyModal',
    templateUrl: './create-or-edit-warranty.component.html'
})
export class CreateWarrantyComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    warranties: CreateWarrantyInput = new CreateWarrantyInput();
    eventOriginal = this.warranties;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _warrantyService: WarrantyServiceProxy
    ) {
        super(injector);
    }


   show(warrantyId?: number): void {
        this.warranties = new CreateWarrantyInput();
        this._warrantyService.getWarrantyForEdit(warrantyId).subscribe((result) => {
           if (result.warranty != null) {
            this.warranties = result.warranty;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.warranties.id == null) {
               this.warranties.id = 0;
           }
          this.warranties.tenantId = abp.multiTenancy.getTenantIdCookie();
		   
             this._warrantyService.createOrUpdateWarranty(this.warranties)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.warranties = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.warranties);
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
