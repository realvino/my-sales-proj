﻿import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AbpModule } from '@abp/abp.module';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { UtilsModule } from '@shared/utils/utils.module';
import { CommonModule } from '@shared/common/common.module';

import { AccountComponent } from './account.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { LoginComponent } from './login/login.component';
import { SwitchComponent } from './switch/switch.component';
import { HostComponent } from './host/host.component';
import { HostloginComponent } from './hostlogin/hostlogin.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { SelectEditionComponent } from './register/select-edition.component';
import { TenantRegistrationHelperService } from './register/tenant-registration-helper.service';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { LoginService } from './login/login.service';
import { SwitchService } from './switch/switch.service';
import { HostService } from './host/host.service';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { LanguageSwitchComponent } from './language-switch.component';
import { BuyComponent } from './payment/buy.component';
import { UpgradeOrExtendComponent } from './payment/upgrade-or-extend.component';

import { PaymentGatewaysComponent } from './payment/payment-gateways.component';
import { PayPalComponent } from './payment/paypal/paypal.component';
import { SendTwoFactorCodeComponentHost } from './host/send-two-factor-code.component';
import { SendTwoFactorCodeComponentswitch } from './switch/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponentHost } from 'account/host/validate-two-factor-code.component';
import { ValidateTwoFactorCodeComponentSwitch } from './switch/validate-two-factor-code.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,

        RecaptchaModule.forRoot(),
        ModalModule.forRoot(),

        AbpModule,

        CommonModule,

        UtilsModule,
        ServiceProxyModule,
        AccountRoutingModule
    ],
    declarations: [
        AccountComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        RegisterComponent,
        RegisterTenantComponent,
        RegisterTenantResultComponent,
        SelectEditionComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        SendTwoFactorCodeComponentHost,
        SendTwoFactorCodeComponentswitch,
        ValidateTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponentHost,
        ValidateTwoFactorCodeComponentSwitch,
        LanguageSwitchComponent,
        BuyComponent,
        UpgradeOrExtendComponent,
        PaymentGatewaysComponent,
        PayPalComponent,
		SwitchComponent,HostComponent,HostloginComponent
    ],
    providers: [
        LoginService,SwitchService,HostService,
        TenantRegistrationHelperService
    ]
})
export class AccountModule {

}