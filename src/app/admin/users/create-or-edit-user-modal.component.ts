import { forwardRef,Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, ProfileServiceProxy,CreateTargetInput,TargetListDto, UserEditDto, CreateOrUpdateUserInput, UserRoleDto, PasswordComplexitySetting, Datadto, Select2ServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
// import {DatePicker} from './year';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


import * as _ from "lodash";
import { CreateUserTargetComponent } from '@app/admin/users/createUserTarget.component';
export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styles: [`.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditUserModalComponent extends AppComponentBase {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('createOrEditModal') modal: ModalDirective;
    // @ViewChild('my-datepicker') DatePicker: DatePicker;
    @ViewChild('createUserTargetModal') createUserTargetModal: CreateUserTargetComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() value :string;

    active: boolean = false;
    saving: boolean = false;
    canChangeUserName: boolean = true;
    isTwoFactorEnabled: boolean = this.setting.getBoolean("Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled");
    isLockoutEnabled: boolean = this.setting.getBoolean("Abp.Zero.UserManagement.UserLockOut.IsEnabled");
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    user: UserEditDto = new UserEditDto();
    userTarget:CreateTargetInput=new CreateTargetInput();
    eventOriginal = this.userTarget;
    targets : TargetListDto[]= [];
    roles: UserRoleDto[];
    sendActivationEmail: boolean = true;
    setRandomPassword: boolean = true;
    passwordComplexityInfo: string = '';
    profilePicture: string;
    yearVal:string="2016";
    filter:string="";
    targetId:number;
    enableTarget:boolean=true;

    startupPagesList: Datadto[];
    startupPages:Array<any>=[];
    active_startup: SelectOption[];

    // yearPick : Hero[];
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _selectProxyService: Select2ServiceProxy
    ) {
        super(injector);
        // this.yearPick= [{val:'testing'}];
    }


    show(userId?: number): void {

        if (!userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }
        var d = new Date();
        this.rootdata();
        this.yearVal =d.getFullYear().toString();
        //console.log(userId,89);
        this._userService.getUserForEdit(userId).subscribe(result => {
            this.user = result.user;
            this.roles = result.roles;
            if(result.root != null){
                this.active_startup =[{id: result.root.id, text : result.root.name}];
            }
            let countV =0;
            this.roles.forEach((e:any)=>{

                if(e.roleName=='Admin' && e.isAssigned==true)
                    countV++;

            });
            //console.log(countV);
            if(countV>0) this.enableTarget=false; else this.enableTarget=true;

            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;

            this.getProfilePicture(result.profilePictureId);

            if (userId) {
                this.active = true;
                this.setRandomPassword = false;
                this.sendActivationEmail = false;
                this.getUsertarget();
            }

            this._profileService.getPasswordComplexitySetting().subscribe(result => {
                this.passwordComplexitySetting = result.setting;
                this.setPasswordComplexityInfo();
                this.modal.show();
            });
        });
    }

rootdata(){
    this._selectProxyService.getDashboardSelect().subscribe((result)=>{
        if(result.select2data != null){
            //console.log(result.select2data);
            this.startupPagesList = result.select2data;
            this.startupPages = [];
            this.active_startup = [];
            this.startupPagesList.forEach((page:{id:number, name:string}) => {
                this.startupPages.push({
                    id: page.id,
                    text: page.name
                });
                
            });
        }
    });
}

selectStartup(data): void {
   this.user.rootId  = data.id;
}
removeStartup(data){
    this.user.rootId = 0;
}

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireDigit_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireLowercase_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireUppercase_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireNonAlphanumeric_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequiredLength_Hint", this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(profilePictureId: string): void {
        if (!profilePictureId) {
            this.profilePicture = "/assets/common/images/default-profile-picture.png";
        } else {
            this._profileService.getProfilePictureById(profilePictureId).subscribe(result => {

                if (result && result.profilePicture) {
                    this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                } else {
                    this.profilePicture = "/assets/common/images/default-profile-picture.png";
                }
            });
        }
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    save(): void {
        var input = new CreateOrUpdateUserInput();

        input.user = this.user;

        //console.log(this.user.id);

        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames =
            _.map(
                _.filter(this.roles, { isAssigned: true }), role => role.roleName
            );

        this.saving = true;
        //console.log(input);
        this._userService.createOrUpdateUser(input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });



    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    getAssignedRoleCount(): number {
        return _.filter(this.roles, { isAssigned: true }).length;
    }
    
    getUsertarget() {
        this._userService.getTarget(this.filter,this.user.id).subscribe((result) => {
            this.targets =result.items;
        });
    }
    createUserTarget(){
       this.createUserTargetModal.show(this.user.id,0);
    }
    editUserTarget(data){
        this.createUserTargetModal.show(data.userId,data.id);
    }
    deleteUsertarget(data) {

        this.message.confirm(
            this.l('Are you sure to Delete the TargetAmount', data.targetAmount),
                isConfirmed => {
                if (isConfirmed) {
                    this._userService.getDeleteTarget(data.id).subscribe(() => {
                        this.notify.success(this.l('Deleted Successfully'));
                        this.getUsertarget();
                    });
                }
            });
    }

}