import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ReasonServiceProxy,CreateReasonInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createReasonModal',
    templateUrl: './create-or-edit-reason.component.html'
})
export class CreateReasonComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    reason: CreateReasonInput = new CreateReasonInput();
    eventOriginal = this.reason;

	
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _reasonService: ReasonServiceProxy
    ) {
        super(injector);
		
    }


   show(reasonId?:number): void {
        this.reason = new CreateReasonInput();
        this._reasonService.getReasonForEdit(reasonId).subscribe((result) => {
			//console.log(result.reasons,'e');
           if (result.reasons != null) {
			this.reason = result.reasons;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.reason.id == null) {
               this.reason.id = 0;
           }
          // console.log(this.reason,'s');
		 //this.reason.tenantId = abp.multiTenancy.getTenantIdCookie();
		this._reasonService.createOrUpdateReason(this.reason)
        .finally(() => this.saving = false)
         .subscribe(() => {
				this.notify.success(this.l('Saved Successfully'));
                this.reason = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.reason);
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
