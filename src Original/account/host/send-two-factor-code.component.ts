import { Component, Injector, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenAuthServiceProxy, SendTwoFactorAuthCodeModel, AuthenticateModel, AuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { HostService } from './host.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './send-two-factor-code.component.html',
    animations: [accountModuleAnimation()]
})
export class SendTwoFactorCodeComponentHost extends AppComponentBase implements CanActivate, OnInit {

    selectedTwoFactorProvider: string;
    submitting: boolean = false;

    constructor(
        injector: Injector,
        public loginService: HostService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.loginService.authenticateModel &&
            this.loginService.authenticateResult &&
            this.loginService.authenticateResult.twoFactorAuthProviders &&
            this.loginService.authenticateResult.twoFactorAuthProviders.length
            ) {
            return true;
        }
        
        return false;
    }

    ngOnInit(): void {
        this.selectedTwoFactorProvider = this.loginService.authenticateResult.twoFactorAuthProviders[0];
    }

    submit(): void {
        let model = new SendTwoFactorAuthCodeModel();
        model.userId = this.loginService.authenticateResult.userId;
        model.provider = this.selectedTwoFactorProvider;

        this.submitting = true;
        this._tokenAuthService
            .sendTwoFactorAuthCode(model)
            .finally(() => this.submitting = false)
            .subscribe(() => {
                this._router.navigate(['account/verify-code']);
            });
    }
}