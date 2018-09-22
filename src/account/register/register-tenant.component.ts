import { Component, Injector, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { LoginService } from '../login/login.service';
import {
    TenantRegistrationServiceProxy,
    RegisterTenantOutput,RegisterTenantInput,EmailCheck,
    PasswordComplexitySetting,
    ProfileServiceProxy,
    EditionSelectDto,
    PaymentServiceProxy,
    Datadto
} from '@shared/service-proxies/service-proxies'
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { TenantRegistrationHelperService } from './tenant-registration-helper.service';
import { RegisterTenantModel } from './register-tenant.model';
import {
    SubscriptionStartType,
    PaymentPeriodType,
    SubscriptionPaymentGatewayType
} from '@shared/AppEnums';
interface selectOption{
    id?:number,
    text?:string
}
@Component({
    templateUrl: './register-tenant.component.html',
    animations: [accountModuleAnimation()]
})
export class RegisterTenantComponent extends AppComponentBase implements OnInit, AfterViewInit {
       
    model: RegisterTenantModel = new RegisterTenantModel();
	emailCheck = new EmailCheck();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    subscriptionStartType = SubscriptionStartType;
    paymentPeriodType = PaymentPeriodType;
    selectedPaymentPeriodType: PaymentPeriodType = PaymentPeriodType.Monthly;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
    paymentId: string = '';
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;
    tenantType:Array<any>;
    tenantypeDto:Datadto[];
    saving: boolean = false;
	emailNotExsit: boolean = true;
    custSelect:string;
    constructor(
        injector: Injector,
        private _tenantRegistrationService: TenantRegistrationServiceProxy,
        private _router: Router,
        private _profileService: ProfileServiceProxy,
        private _tenantRegistrationHelper: TenantRegistrationHelperService,
        private _activatedRoute: ActivatedRoute,
		private readonly _loginService: LoginService,
        private _paymentService: PaymentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.model.editionId = this._activatedRoute.snapshot.queryParams["editionId"];
        if (this.model.editionId) {
            this.model.subscriptionStartType = this._activatedRoute.snapshot.queryParams["subscriptionStartType"];
            this.model.gateway = this._activatedRoute.snapshot.queryParams["gateway"];
            this.model.paymentId = this._activatedRoute.snapshot.queryParams["paymentId"];
        }

        //Prevent to create tenant in a tenant context
        // if (this.appSession.tenant != null) {
        //     this._router.navigate(['account/login']);
        //     return;
        // }
        this._tenantRegistrationService.getTenantType().subscribe(result=>{
                if(result.select2data!=null){
                    this.tenantypeDto = result.select2data;
                    this.tenantType = [];
                    let i=1;
                    this.tenantypeDto.forEach((tenant_type:{id:number, name:string}) => {
                        this.tenantType.push({
                            id: tenant_type.id,
                            text: tenant_type.name
                        });
                        if(i==1){
                            this.model.tenantTypeId = tenant_type.id;
                            this.custSelect = tenant_type.name;
                        }
                        i++;
                    });
                }
        });
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    ngAfterViewInit() {
        if (this.model.editionId) {
            this._tenantRegistrationService.getEdition(this.model.editionId)
                .subscribe((result: EditionSelectDto) => {
                    this.model.edition = result;
                });
        }
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
    }

    save(): void {
        if (this.useCaptcha && !this.model.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        this.saving = true;
        this._tenantRegistrationService.registerTenant(this.model)
            .finally(() => { this.saving = false; })
            .subscribe((result: RegisterTenantOutput) => {
                this.notify.success(this.l('SuccessfullyRegistered'));

                this._tenantRegistrationHelper.registrationResult = result;
                this._router.navigate(['account/register-tenant-result']);
            });
    }
	emailValidation( email ){
		this.emailCheck.email = email;
		this._tenantRegistrationService.emailValidation( this.emailCheck ).subscribe((result)  => {			
			if( result.email == 'failure' ){
				this.emailNotExsit = false;
				this.notify.error(this.l('This email already used!!!'));
			}else{
				this.emailNotExsit = true;
			}
        });
	}
    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse;
    }

    onPaymentPeriodChangeChange(selectedPaymentPeriodType) {
        this.selectedPaymentPeriodType = selectedPaymentPeriodType;
    }
    selectedTenantType(data:any){
        this.model.tenantTypeId = data.id;
    }
    check(checkedId:number){
        this.model.tenantTypeId = checkedId;
        console.log(checkedId,'Tenant Type');
    }
}