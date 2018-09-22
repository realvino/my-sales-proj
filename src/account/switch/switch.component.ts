import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceProxy, UpdateUserSignInTokenOutput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SwitchService, ExternalLoginProvider } from './switch.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { IsTenantAvailableInput } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './switch.component.html',
    animations: [accountModuleAnimation()]
})
export class SwitchComponent extends AppComponentBase implements OnInit {
    submitting: boolean = false;
	tenentData = [];
    constructor(
        injector: Injector,
        public switchService: SwitchService,
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
	if( !sessionStorage.email && !sessionStorage.password ){
		this._router.navigate(['/account/login']);
	}
				
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
		
		/*this.switchService.tenencySearching().subscribe((result) => {
               this.tenentData = result.tenentdatas;
         });*/
    }

    login( tenancyName, tenancyId): void {
        this.submitting = true;
		abp.multiTenancy.setTenantIdCookie(tenancyId);
        this.switchService.authenticate(
            () => this.submitting = false
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.switchService.externalAuthenticate(provider);
    }
}