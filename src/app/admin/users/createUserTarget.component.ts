import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserServiceProxy, CreateTargetInput, GetAvailableTarget } from '@shared/service-proxies/service-proxies';
import * as moment from "moment"

@Component({
    selector: 'createUserTargetModal',
    templateUrl: './createUserTarget.component.html'
})
export class CreateUserTargetComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    userTarget:CreateTargetInput=new CreateTargetInput();
    UserId:number
    active = false;
    saving = false;
    month:string;
    targetAvailable: GetAvailableTarget;
    allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
    otherUserTarget:number;
    oldTargetPercentage:number;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy
    ) {
        super(injector);
    }

    show(userId?:number,userTargetId?:number): void {
        this.UserId= userId;
        if(userTargetId >0){
            this._userService.getTargetForEdit(userTargetId,this.userTarget.validityDate).subscribe((result)=> {
                if(result.targets != null){
                    this.userTarget = result.targets;
                    this.oldTargetPercentage = result.targets.targetAmount;
                    this.month = moment(this.userTarget.validityDate).format("MMM-YYYY");
                }
                if(result.targetDetail != null){
                    this.userTarget.total = Math.round((result.targetDetail.totaltarget*this.userTarget.targetAmount)/100);
                }
            });
        }
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;
        if (this.userTarget.id == null) {
            this.userTarget.id = 0;
        }
        this.userTarget.tenantId = abp.multiTenancy.getTenantIdCookie();
        this.userTarget.targetTypeId = 1;
        this.userTarget.userId = this.UserId;
        let validityDate= moment(moment(this.month).toDate().toString());
        this.userTarget.validityDate = moment(validityDate).add(6, 'hours');
        this._userService.createOrUpdateTarget(this.userTarget)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
				this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit();
            });

    }
    onDateChange(value): void{
        this.month = moment(value).format('MMM-YYYY');
        this.userTarget.validityDate = value;
        this.getTotalAmount();
    } 
    onShown(): void {
    }
    close(): void {
        this.userTarget =new CreateTargetInput();
        this.modal.hide();
        this.active = false;
        this.month = "";
    }
    getTotalAmount(){
        this._userService.getTargetForEdit(this.UserId, this.userTarget.validityDate).subscribe((result)=>{
            if(result.targetDetail != null){
                this.targetAvailable = result.targetDetail;
                if(this.userTarget.id){
                    if(this.oldTargetPercentage == this.userTarget.targetAmount){
                        this.otherUserTarget = Math.round((this.targetAvailable.totaltarget*this.targetAvailable.availableTarget)/100);
                        this.userTarget.total = Math.round((this.targetAvailable.totaltarget*this.userTarget.targetAmount)/100);
                    }else{
                        this.targetAvailable.availableTarget = this.targetAvailable.availableTarget - this.oldTargetPercentage;
                        this.otherUserTarget = Math.round((this.targetAvailable.totaltarget*this.targetAvailable.availableTarget)/100);
                        this.userTarget.total = Math.round((this.targetAvailable.totaltarget*this.userTarget.targetAmount)/100);
                        if(this.targetAvailable.totaltarget < (this.otherUserTarget + this.userTarget.total)){
                           this.notify.warn(this.l("Target Exceeeds"));
                        }
                    }
                }
                else{
                    this.otherUserTarget = Math.round((this.targetAvailable.totaltarget*this.targetAvailable.availableTarget)/100);
                    this.userTarget.total = Math.round((this.targetAvailable.totaltarget*this.userTarget.targetAmount)/100);
                    if(this.targetAvailable.totaltarget < (this.otherUserTarget + this.userTarget.total)){
                       this.notify.warn(this.l("Target Exceeeds"));
                    }
                }
            }
        });
    }
    check(event: KeyboardEvent) {
        if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
          event.preventDefault();
        }
    }
}
