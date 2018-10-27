import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateActivityTypeInput, ActivityTypeServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createActivityModal',
    templateUrl: './create-or-edit-activity.component.html'
})
export class CreateActivityModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
	activity: CreateActivityTypeInput = new CreateActivityTypeInput();
    eventOriginal = this.activity;
     
    active = false;
    saving = false;
    constructor(
        injector: Injector,
         private _activityService: ActivityTypeServiceProxy
    ) {
        super(injector);
    }
 
   show(activityId ?: number): void {
        this.activity = new CreateActivityTypeInput();
       this._activityService.getActivityTypeForEdit(activityId).subscribe((result) => {
		   //console.log(result);
         if (result.activityTypes != null) {
            this.activity = result.activityTypes;
           } 
             this.active = true;
             this.modal.show();
        });
       
    }


    save(): void {
         this.saving = true;
           if (this.activity.id == null) {
               this.activity.id = 0;
           }
           
		   this.activity.tenantId = abp.multiTenancy.getTenantIdCookie();
             this._activityService.createOrUpdateActivityType(this.activity)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.activity = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.activity);
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
