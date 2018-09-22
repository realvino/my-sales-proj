import { Component, Injector, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenAuthServiceProxy, SendTwoFactorAuthCodeModel, AuthenticateModel, AuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { SwitchService } from './switch.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './send-two-factor-code.component.html',
    animations: [accountModuleAnimation()]
})
export class SendTwoFactorCodeComponentswitch extends AppComponentBase implements CanActivate, OnInit {

    selectedTwoFactorProvider: string;
    submitting: boolean = false;

    constructor(
        injector: Injector,
        public switchService: SwitchService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.switchService.authenticateModel &&
            this.switchService.authenticateResult &&
            this.switchService.authenticateResult.twoFactorAuthProviders &&
            this.switchService.authenticateResult.twoFactorAuthProviders.length
            ) {
            return true;
        }
        
        return false;
    }

    ngOnInit(): void {
        this.selectedTwoFactorProvider = this.switchService.authenticateResult.twoFactorAuthProviders[0];
    }

    submit(): void {
        let model = new SendTwoFactorAuthCodeModel();
        model.userId = this.switchService.authenticateResult.userId;
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