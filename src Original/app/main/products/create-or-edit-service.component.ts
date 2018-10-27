import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ServiceServiceProxy, CreateServiceInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createServiceModal',
    templateUrl: './create-or-edit-service.component.html'
})
export class CreateServiceComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    services: CreateServiceInput = new CreateServiceInput();
    eventOriginal = this.services;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _serviceService: ServiceServiceProxy
    ) {
        super(injector);
    }

    show(serviceId?: number): void {
        this.services = new CreateServiceInput();
        this._serviceService.getServiceForEdit(serviceId).subscribe((result) => {
            if (result.services != null) {
                this.services = result.services;
            }
            this.active = true;
            this.modal.show();
        });
    }

    save(): void {
        this.saving = true;
            if (this.services.id == null) {
               this.services.id = 0;
            }
	        this.services.tenantId  = abp.multiTenancy.getTenantIdCookie();
            this._serviceService.createOrUpdateService(this.services)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.services = this.eventOriginal;
                this.close();
                this.modalSave.emit();
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
