﻿import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceProxy, UpdateUserSignInTokenOutput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HostService, ExternalLoginProvider } from './host.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { UrlHelper } from 'shared/helpers/UrlHelper';

@Component({
    templateUrl: './host.component.html',
    animations: [accountModuleAnimation()]
})
export class HostComponent extends AppComponentBase implements OnInit {
    submitting: boolean = false;

    constructor(
        injector: Injector,
        public loginService: HostService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy
    ) {
        super(injector);
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    var initialReturnUrl = UrlHelper.getReturnUrl();
                    let returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }
    }

    login(): void {
        this.submitting = true;
        /*this.loginService.authenticate(
            () => this.submitting = false
        );*/
		/*this.loginService.tenencySearching(
            () => this.submitting = false
        );*/
		
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }
}