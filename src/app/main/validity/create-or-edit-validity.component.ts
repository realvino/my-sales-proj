import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ValidityServiceProxy,CreateValidityInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createValidityModal',
    templateUrl: './create-or-edit-validity.component.html'
})
export class CreateValidityComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    validities: CreateValidityInput = new CreateValidityInput();
    eventOriginal = this.validities;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
         private _validityService: ValidityServiceProxy
    ) {
        super(injector);
    }


   show(validityId?: number): void {
        this.validities = new CreateValidityInput();
        this._validityService.getValidityForEdit(validityId).subscribe((result) => {
           if (result.validity != null) {
            this.validities = result.validity;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.validities.id == null) {
               this.validities.id = 0;
           }
           // console.log(this.validities);
             this._validityService.createOrUpdateValidity(this.validities)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.validities = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.validities);
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
