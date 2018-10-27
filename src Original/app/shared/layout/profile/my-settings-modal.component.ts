import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ProfileServiceProxy, CurrentUserProfileEditDto, DefaultTimezoneScope, UpdateGoogleAuthenticatorKeyOutput, Datadto, Select2ServiceProxy } from "@shared/service-proxies/service-proxies";
import { AppSessionService } from '@shared/common/session/app-session.service'
import { AppTimezoneScope } from '@shared/AppEnums';
import { SmsVerificationModalComponent } from './sms-verification-modal.component';
import { SelectOption } from '@app/main/milestoneStatus/create-edit-mileStone.component';

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html'
})
export class MySettingsModalComponent extends AppComponentBase {
 

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('mySettingsModal') modal: ModalDirective;
    @ViewChild('smsVerificationModal') smsVerificationModal: SmsVerificationModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
     
    public active: boolean = false;
    public saving: boolean = false;
    public isGoogleAuthenticatorEnabled: boolean = false;
    public isPhoneNumberConfirmed: boolean;
    public isPhoneNumberEmpty: boolean = false;
    public smsEnabled: boolean;
    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;
    startupPagesList: Datadto[];
    startupPages:Array<any>=[];
    active_startup: SelectOption[];
    
    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _selectProxyService: Select2ServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.smsEnabled = this.setting.getBoolean("App.UserManagement.SmsVerificationEnabled");
            this.user = result;
            //console.log(this.user);
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            if(this.user.rootId > 0){
                this.active_startup =[{id: this.user.rootId, text : this.user.rootName}];
            }
            this._selectProxyService.getDashboardSelect().subscribe((result)=>{
                if(result.select2data != null){
                    //console.log(result.select2data);
                    this.startupPagesList = result.select2data;
                    this.startupPages = [];
                    this.startupPagesList.forEach((page:{id:number, name:string}) => {
                        this.startupPages.push({
                            id: page.id,
                            text: page.name
                        });
                    });
                }
            });
            this.modal.show();
            this.isGoogleAuthenticatorEnabled = result.isGoogleAuthenticatorEnabled;
            this.isPhoneNumberConfirmed = result.isPhoneNumberConfirmed;
            this.isPhoneNumberEmpty = result.phoneNumber === "";
        });
        
    }

    updateQrCodeSetupImageUrl(): void {
        this._profileService.updateGoogleAuthenticatorKey().subscribe((result: UpdateGoogleAuthenticatorKeyOutput) => {
            this.user.qrCodeSetupImageUrl = result.qrCodeSetupImageUrl;
            this.isGoogleAuthenticatorEnabled = true;
        });
    }

    smsVerify(): void {
        this._profileService.sendVerificationSms()
            .subscribe(() => {
                 this.smsVerificationModal.show();
        });
    }


selectStartup(data): void {
        this.user.rootId  = data.id;
        this.user.rootName = data.text;
    }
    removeStartup(data){
        this.user.rootId = 0;
        this.user.rootName = "";
    }

    changePhoneNumberToVerified(): void {
        this.isPhoneNumberConfirmed = true;
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.active = false;
        this.active_startup = [];
        this.modal.hide();
    }

    save(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this._appSessionService.user.name = this.user.name;
                this._appSessionService.user.surname = this.user.surname;
                this._appSessionService.user.userName = this.user.userName;
                this._appSessionService.user.emailAddress = this.user.emailAddress;

                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                        window.location.reload();
                    });
                }
            });
    }
}