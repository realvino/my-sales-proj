import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PackingServiceProxy,CreatePackingInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createPackingModal',
    templateUrl: './create-or-edit-packing.component.html'
})
export class CreatePackingComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    packing: CreatePackingInput = new CreatePackingInput();
    eventOriginal = this.packing;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
       private _packingService: PackingServiceProxy
    ) {
        super(injector);
    }


   show(packingId?: number): void {
        this.packing = new CreatePackingInput();
		//console.log(this.packing);
       this._packingService.getPackingForEdit(packingId).subscribe((result) => {
           if (result.pack != null) {
            this.packing = result.pack;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.packing.id == null) {
               this.packing.id = 0;
           }
            //console.log(this.packing);
			this.packing.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._packingService.createOrUpdatePacking(this.packing)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('Saved Successfully'));
                this.packing = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.packing);
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
