import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TitleOfQuotationServiceProxy,TitleOfQuotationInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createTitleOfQuotationModal',
    templateUrl: './create-or-edit-titlequotation.component.html'
})
export class CreateTitleOfQuotationComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    titlequt: TitleOfQuotationInput = new TitleOfQuotationInput();
    eventOriginal = this.titlequt;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _titleofquotationService: TitleOfQuotationServiceProxy
    ) {
        super(injector);
    }


   show(titleId?: number): void {
        this.titlequt = new TitleOfQuotationInput();
        this._titleofquotationService.getTitleOfQuotationForEdit(titleId).subscribe((result) => {
           if (result.title != null) {
            this.titlequt = result.title;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.titlequt.id == null) {
               this.titlequt.id = 0;
           }
           // console.log(this.titlequt);
		   this.titlequt.tenantId=abp.multiTenancy.getTenantIdCookie();
             this._titleofquotationService.createOrUpdateTitleOfQuotation(this.titlequt)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.titlequt = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.titlequt);
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
