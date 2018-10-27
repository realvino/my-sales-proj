import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {InfoTypeServiceProxy,NewInfoTypeInputDto} from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'createNewInfoTypeModal',
    templateUrl: './createEditNewInfoType.component.html'
})
export class CreateOrEditNewInfoTypeComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;



    custype = ["Addressinfo", "ContactInfo"];
    custselect = "Addressinfo";

    infotype: NewInfoTypeInputDto = new NewInfoTypeInputDto();
    eventOriginal = this.infotype;

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _infoTypeProxyService: InfoTypeServiceProxy
    ) {
        super(injector);
    }

    show(infotypeId?: number): void {

        this.custselect = "Addressinfo";
        this.active = true;
        this.modal.show();


        this._infoTypeProxyService.getNewInfoTypeForEdit(infotypeId).
            subscribe((result) => {
                if(result.newInfoTypes != null){

                    this.infotype=result.newInfoTypes;
                    if(this.infotype.info == false)
                    {
                        this.custselect ="Addressinfo";
                    }
                    else{
                        this.custselect ="ContactInfo";
                    }
                }


            });


    }



    save(): void {
        this.saving = true;
        // this.saving = true;
        if (this.infotype.id == null) {
            this.infotype.id = 0;
        }


        if(this.custselect == "Addressinfo")
        {
            this.infotype.info = false;
        }
        else{
            this.infotype.info = true;
        }
// console.log(this.infotype);
        this.infotype.tenantId=abp.multiTenancy.getTenantIdCookie();
        this._infoTypeProxyService.createOrUpdateNewInfoType(this.infotype)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.infotype = this.eventOriginal;
                this.close();
                this.infotype.contactName='';
                this.custselect = "Addressinfo";
                this.modalSave.emit(this.infotype);
            });

    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.infotype.contactName='';
        this.custselect = "Addressinfo";
        this.active = false;
    }
}
