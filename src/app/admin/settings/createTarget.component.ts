import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantDashboardServiceProxy, CreateTenantTargetInput } from '@shared/service-proxies/service-proxies';
import * as moment from "moment"

@Component({
    selector: 'createTargetModal',
    templateUrl: './createTarget.component.html'
})
export class CreateTargetComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    targetInput:CreateTenantTargetInput=new CreateTenantTargetInput();
    active = false;
    saving = false;
    month:string;
    constructor(
        injector: Injector,
        private _tenantDashboardService: TenantDashboardServiceProxy
    ) {
        super(injector);
    }

    show(targetId?:number): void {
        if(targetId > 0){
            this._tenantDashboardService.getTenantTargetForEdit(targetId).subscribe((result)=>{
                if(result.tenantTarget != null){
                    this.targetInput = result.tenantTarget;
                    this.month = moment( this.targetInput.targetDate).format('MMM-YYYY');
                    //console.log(this.month);
                }
            });
        }
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;
        if (this.targetInput.id == null) {
            this.targetInput.id = 0;
        }
        this.targetInput.tenantId=abp.multiTenancy.getTenantIdCookie();
		//console.log(this.targetInput);
        this._tenantDashboardService.createOrUpdateTenantTarget(this.targetInput)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
				this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit();
            });

    }
    onDateChange(value): void{
        this.month = moment(value).format('MMM-YYYY');
        this.targetInput.targetDate = value;
    } 
    onShown(): void {
    }
    close(): void {
        this.targetInput =new CreateTenantTargetInput();
        this.modal.hide();
        this.active = false;
        this.month = "";
    }
}
