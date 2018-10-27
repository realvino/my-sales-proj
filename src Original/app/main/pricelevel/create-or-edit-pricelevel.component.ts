import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PriceLevelServiceProxy,PriceLevelCreate } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createPriceLevelModal',
    templateUrl: './create-or-edit-pricelevel.component.html'
})
export class CreatePricelevelComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    PriceLevel: PriceLevelCreate = new PriceLevelCreate();
    eventOriginal = this.PriceLevel;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
         private _PriceLevelService: PriceLevelServiceProxy
    ) {
        super(injector);
    }


   show(pricelevelId?: number): void {
        this.PriceLevel = new PriceLevelCreate();
        this._PriceLevelService.getPriceLevelForEdit(pricelevelId).subscribe((result) => {
			//console.log(result,'e');
          if (result.getPriceLevels != null) {
            this.PriceLevel = result.getPriceLevels;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.PriceLevel.id == null) {
               this.PriceLevel.id = 0;
           }
           this.PriceLevel.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._PriceLevelService.createOrUpdatePriceLevel(this.PriceLevel)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.PriceLevel = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.PriceLevel);
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
