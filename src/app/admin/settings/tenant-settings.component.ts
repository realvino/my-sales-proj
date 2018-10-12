import { Component, OnInit, Injector, ViewEncapsulation, ViewChild,ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CreateTenantTargetInput,TenantDashboardServiceProxy,TenantTargetListDto,TenantSettingsServiceProxy, HostSettingsServiceProxy, DefaultTimezoneScope, TenantSettingsEditDto, SendTestEmailInput, SettingVatAmountInput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppTimezoneScope } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { TokenService } from '@abp/auth/token.service';
import { IAjaxResponse } from '@abp/abpHttp';
import {MonthPicker} from 'app/admin/users/month';

import * as moment from "moment";
import { CreateTargetComponent } from '@app/admin/settings/createTarget.component';

@Component({
    templateUrl: "./tenant-settings.component.html",
    animations: [appModuleAnimation()]
})
export class TenantSettingsComponent extends AppComponentBase implements OnInit {


    @ViewChild('createTargetModal') createTargetModal: CreateTargetComponent;
    @ViewChild('calen') calen: ElementRef;
    usingDefaultTimeZone: boolean = false;
	saving: boolean = false;
    initialTimeZone: string = null;
    testEmailAddress: string = undefined;
    monthVal:string="Jul-2017";
	filter:string;
	sorting:string;
	maxResultCount:number;
	skipCount:number;
    targetInput:CreateTenantTargetInput=new CreateTenantTargetInput();
	tenantTarget:TenantTargetListDto[] =[];
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    activeTabIndex: number = (abp.clock.provider.supportsMultipleTimezone) ? 0 : 1;
    loading: boolean = false;
    settings: TenantSettingsEditDto = undefined;
    logoUploader: FileUploader;
    customCssUploader: FileUploader;
    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.Tenant;
    target_disable:boolean = true;
    tenantVatAmountInput:SettingVatAmountInput = new SettingVatAmountInput();
    allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

    dashboardHeaderStats: DashboardHeaderStats;
    
    constructor(
        injector: Injector,
        private _tenantSettingsService: TenantSettingsServiceProxy,
        private _appSessionService: AppSessionService,
        private _tokenService: TokenService,
        private _profileService: ProfileServiceProxy,
        private _tenantDashboardService:TenantDashboardServiceProxy
    ) {
        super(injector);
        this.dashboardHeaderStats = new DashboardHeaderStats();
    }

    ngOnInit(): void {
        this.testEmailAddress = this._appSessionService.user.emailAddress;
        this.getSettings();
		this.getTenantTarget();
        this.initUploaders();
        this.getTenantVatAmont();
       //this.monthVal= date.toLocaleString("en-us", { month: "short" });
    }

    getSettings(): void {
        this.loading = true;
        this._tenantSettingsService.getAllSettings()
            .finally(() => {
                this.loading = false;
            })
            .subscribe((result: TenantSettingsEditDto) => {
                this.settings = result;
                if (this.settings.general) {
                    this.initialTimeZone = this.settings.general.timezone;
                    this.usingDefaultTimeZone = this.settings.general.timezoneForComparison === abp.setting.values["Abp.Timing.TimeZone"];
                }
            });
    }

    initUploaders(): void {
        this.logoUploader = this.createUploader(
            "/TenantCustomization/UploadLogo",
            result => {
                this._appSessionService.tenant.logoFileType = result.fileType;
                this._appSessionService.tenant.logoId = result.id;
            }
        );

        this.customCssUploader = this.createUploader(
            "/TenantCustomization/UploadCustomCss",
            result => {
                this.appSession.tenant.customCssId = result.id;
                $('#TenantCustomCss').remove();
                $('head').append('<link id="TenantCustomCss" href="' + AppConsts.remoteServiceBaseUrl + '/TenantCustomization/GetCustomCss?id=' + this.appSession.tenant.customCssId + '" rel="stylesheet"/>');
            }
        );

        this.logoUploader = this.createUploader(
            "/TenantCustomization/UploadLogo",
            result => {
                this._appSessionService.tenant.logoFileType = result.fileType;
                this._appSessionService.tenant.logoId = result.id;
                this._profileService.updateLogo().subscribe(()=>{});
            }
        );
    }

    createUploader(url: string, success?: (result: any) => void): FileUploader {
        const uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + url });

        uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        uploader.onSuccessItem = (item, response, status) => {
            let ajaxResponse = <IAjaxResponse>JSON.parse(response);
            if (ajaxResponse.success) {
                this.notify.info(this.l('SavedSuccessfully'));
                success && success(ajaxResponse.result);
            } else {
                this.message.error(ajaxResponse.error.message);
            }
        };

        const uploaderOptions: FileUploaderOptions = {};
        uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        uploaderOptions.removeAfterUpload = true;
        uploader.setOptions(uploaderOptions);
        return uploader;
    }

    uploadLogo(): void {
        this.logoUploader.uploadAll();
    }

    uploadCustomCss(): void {
        this.customCssUploader.uploadAll();
    }

    clearLogo(): void {
        this._tenantSettingsService.clearLogo().subscribe(() => {
            this._appSessionService.tenant.logoFileType = null;
            this._appSessionService.tenant.logoId = null;
            this.notify.info(this.l('ClearedSuccessfully'));
        });
    }

    clearCustomCss(): void {
        this._tenantSettingsService.clearCustomCss().subscribe(() => {
            this.appSession.tenant.customCssId = null;
            $('#TenantCustomCss').remove();
            this.notify.info(this.l('ClearedSuccessfully'));
        });
    }
    ngAfterViewInit() {
        //this.monthVal = this.calen.nativeElement;
    }
    restoreLogo():void{
        this._profileService.updateLogo().subscribe(()=>{
            this.notify.info(this.l('Restored Successfully'));
        });
    }

    saveAll(): void {
        if(this.tenantVatAmountInput.vatAmount > 0){
            if (this.tenantVatAmountInput.id == null) {
                this.tenantVatAmountInput.id = 0;
            }
            this.tenantVatAmountInput.tenantId=abp.multiTenancy.getTenantIdCookie();
            //console.log(this.tenantVatAmountInput);
            this._tenantDashboardService.createOrUpdateTenantVatAmount(this.tenantVatAmountInput)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.getTenantVatAmont();
            });
        }
        this._tenantSettingsService.updateAllSettings(this.settings).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && this.usingDefaultTimeZone && this.initialTimeZone !== this.settings.general.timezone) {
                this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                    window.location.reload();
                });
            }
            
        });

    }

    sendTestEmail(): void {
        let input = new SendTestEmailInput();
        input.emailAddress = this.testEmailAddress;
        this._tenantSettingsService.sendTestEmail(input).subscribe(result => {
            this.notify.info(this.l("TestEmailSentSuccessfully"));
        });
    }
    
	getTenantTarget(){
		this._tenantDashboardService.getTenantTarget(this.filter).subscribe((result) => {
			this.tenantTarget =result.items;

        });
    
	}
	
	deleteTenantTarget(data) {

        this.message.confirm(
            this.l('Are you sure to Delete the TenantTarget', data.value),
                isConfirmed => {
                if (isConfirmed) {
                    this._tenantDashboardService.getDeleteTarget(data.id).subscribe(() => {
                        this.notify.success(this.l('Deleted Successfully'));
                        this.getTenantTarget();
                    });
                }
            });
    }
    createTarget(){
        this.createTargetModal.show(0);
    }

    getTenantVatAmont(){
        this.tenantVatAmountInput = new SettingVatAmountInput();
		this._tenantDashboardService.getTenantVatAmountSettingForEdit(abp.multiTenancy.getTenantIdCookie()).subscribe((result) => {
            this.tenantVatAmountInput = result;
            //console.log(this.tenantVatAmountInput);
        });
	}
    check(event: KeyboardEvent) {
        if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
          event.preventDefault();
        }
    }
    editTenantTarget(data){
        //console.log(data);
        this.createTargetModal.show(data.id);
    }

}
abstract class DashboardChartBase {
    loading: boolean = true;

    showLoading() {
        setTimeout(() => { this.loading = true; });
    }

    hideLoading() {
        setTimeout(() => { this.loading = false; });
    }
};
class DashboardHeaderStats extends DashboardChartBase {

    totalProfit: number = 0; totalProfitCounter: number = 0;
    newFeedbacks: number = 0; newFeedbacksCounter: number = 0;
    newOrders: number = 0; newOrdersCounter: number = 0;
    newUsers: number = 0; newUsersCounter: number = 0;

    totalProfitChange: number = 76; totalProfitChangeCounter: number = 0;
    newFeedbacksChange: number = 85; newFeedbacksChangeCounter: number = 0;
    newOrdersChange: number = 45; newOrdersChangeCounter: number = 0;
    newUsersChange: number = 57; newUsersChangeCounter: number = 0;

    init(totalProfit, newFeedbacks, newOrders, newUsers) {
        this.totalProfit = totalProfit;
        this.newFeedbacks = newFeedbacks;
        this.newOrders = newOrders;
        this.newUsers = newUsers;
        this.hideLoading();
    };
};